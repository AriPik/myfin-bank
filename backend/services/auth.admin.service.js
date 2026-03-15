const Admin = require("../models/admin.model");
const bcrypt = require("bcryptjs");
const generateId = require("../utils/idGenerator");
const PasswordResetToken = require("../models/passwordResetToken.model");
const { sendPasswordResetOTP } = require("../utils/mailer");

const loginAdmin = async (identifier, password) => {
  const admin = await Admin.findOne({
    $or: [{ email: identifier }, { adminId: identifier }],
  });

  if (!admin) {
    throw new Error("Invalid credentials");
  }

  if (admin.status === "INACTIVE") {
    throw new Error(
      "Your account has been deactivated. Please contact Super Admin."
    );
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return admin;
};

const seedSuperAdmin = async () => {
  const existing = await Admin.findOne({
    role: "SUPER_ADMIN",
  });

  if (existing) {
    throw new Error("Super Admin already exists");
  }

  const hashedPassword = await bcrypt.hash("SuperAdmin@MyFinBank123", 10);

  const superAdmin = await Admin.create({
    adminId: "MYFIN-ADMIN-0001",
    name: "MyFin Super Admin",
    email: "myfinbank.super.admin@gmail.com",
    password: hashedPassword,
    role: "SUPER_ADMIN",
    status: "ACTIVE",
    createdBy: null,
  });

  return superAdmin;
};

const seedFirstAdmin = async () => {
  const existing = await Admin.findOne({
    adminId: "MYFIN-ADMIN-101",
  });

  if (existing) {
    throw new Error("First Admin already exists");
  }

  const hashedPassword = await bcrypt.hash("Admin@MyFinBank123", 10);

  const admin = await Admin.create({
    adminId: "MYFIN-ADMIN-101",
    name: "MyFin Admin",
    email: "myfinbank.admin@gmail.com",
    password: hashedPassword,
    role: "ADMIN",
    status: "ACTIVE",
    createdBy: "MYFIN-ADMIN-0001",
  });

  return admin;
};

const registerAdmin = async (data, superAdminId) => {
  const existing = await Admin.findOne({ email: data.email });

  if (existing) {
    throw new Error("Admin with this email already exists");
  }

  // Count only regular admins for ID generation
  const adminCount = await Admin.countDocuments({
    role: "ADMIN",
  });

  // ID starts from 101 and increments
  const adminNumber = 101 + adminCount;
  const adminId = `MYFIN-ADMIN-${adminNumber}`;

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const admin = await Admin.create({
    adminId,
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: "ADMIN",
    status: "ACTIVE",
    createdBy: superAdminId,
  });

  return admin;
};

const getAllAdmins = async () => {
  const admins = await Admin.find({ role: "ADMIN" });
  return admins;
};

const deactivateAdmin = async (adminId) => {
  const admin = await Admin.findOne({ adminId });

  if (!admin) {
    throw new Error("Admin not found");
  }

  if (admin.role === "SUPER_ADMIN") {
    throw new Error("Super Admin cannot be deactivated");
  }

  if (admin.status === "INACTIVE") {
    throw new Error("Admin is already inactive");
  }

  const updated = await Admin.findOneAndUpdate(
    { adminId },
    { status: "INACTIVE" },
    { new: true }
  );

  return updated;
};

const activateAdmin = async (adminId) => {
  const admin = await Admin.findOne({ adminId });

  if (!admin) {
    throw new Error("Admin not found");
  }

  if (admin.role === "SUPER_ADMIN") {
    throw new Error("Super Admin status cannot be changed");
  }

  if (admin.status === "ACTIVE") {
    throw new Error("Admin is already active");
  }

  const updated = await Admin.findOneAndUpdate(
    { adminId },
    { status: "ACTIVE" },
    { new: true }
  );

  return updated;
};

const forgotPasswordAdmin = async (identifier) => {
  const admin = await Admin.findOne({
    $or: [{ email: identifier }, { adminId: identifier }],
  });

  if (!admin) {
    throw new Error(
      "No account found with this email or admin ID"
    );
  }

  if (admin.status === "INACTIVE") {
    throw new Error(
      "Your account has been deactivated. Please contact Super Admin."
    );
  }

  // Invalidate existing unused tokens
  await PasswordResetToken.updateMany(
    { customerId: admin.adminId, used: false },
    { used: true }
  );

  const otpNumber = Math.floor(Math.random() * 1000000);
  const otp = String(otpNumber).padStart(6, "0");

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const count = await PasswordResetToken.countDocuments();
  const tokenId = generateId("OTP", count + 1);

  await PasswordResetToken.create({
    tokenId,
    customerId: admin.adminId,
    otp,
    expiresAt,
    used: false,
  });

  await sendPasswordResetOTP(
    admin.name,
    admin.email,
    otp
  );

  return admin.email;
};

const resetPasswordAdmin = async (identifier, otp, newPassword) => {
  const admin = await Admin.findOne({
    $or: [{ email: identifier }, { adminId: identifier }],
  });

  if (!admin) {
    throw new Error(
      "No account found with this email or admin ID"
    );
  }

  const token = await PasswordResetToken.findOne({
    customerId: admin.adminId,
    otp,
    used: false,
    expiresAt: { $gt: new Date() },
  });

  if (!token) {
    throw new Error("Invalid or expired OTP");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await Admin.findOneAndUpdate(
    { adminId: admin.adminId },
    { password: hashedPassword }
  );

  await PasswordResetToken.findOneAndUpdate(
    { tokenId: token.tokenId },
    { used: true }
  );

  return true;
};

module.exports = {
  loginAdmin,
  seedSuperAdmin,
  seedFirstAdmin,
  registerAdmin,
  getAllAdmins,
  deactivateAdmin,
  activateAdmin,
  forgotPasswordAdmin,
  resetPasswordAdmin,
};