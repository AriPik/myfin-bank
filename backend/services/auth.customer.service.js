const Customer = require("../models/customer.model");
const bcrypt = require("bcryptjs");
const PasswordResetToken = require("../models/passwordResetToken.model");
const { sendPasswordResetOTP } = require("../utils/mailer");
const generateId = require("../utils/idGenerator");

const registerCustomer = async (data) => {
  const existingCustomer = await Customer.findOne({ 
    email: data.email 
  });

  if (existingCustomer) {
    throw new Error("Email already registered");
  }

  const count = await Customer.countDocuments();
  const customerId = generateId("CUST", count + 1);

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const customer = await Customer.create({
    customerId,
    name: data.name,
    email: data.email,
    password: hashedPassword,
    phone: data.phone,
    address: data.address,
    govIdType: data.govIdType,
    govIdNumber: data.govIdNumber,
    govIdDocumentPath: data.govIdDocumentPath || null,
  });

  return customer;
};

const loginCustomer = async (identifier, password) => {
  // identifier can be email or customerId
  const customer = await Customer.findOne({
    $or: [{ email: identifier }, { customerId: identifier }],
  });

  if (!customer) {
    throw new Error("Invalid credentials");
  }

  if (customer.status === "PENDING_VERIFICATION") {
    throw new Error("Account pending KYC verification");
  }

  if (customer.status === "REJECTED") {
    throw new Error("Account has been rejected");
  }

  const isMatch = await bcrypt.compare(password, customer.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return customer;
};

const forgotPassword = async (identifier) => {
  const customer = await Customer.findOne({
    $or: [{ email: identifier }, { customerId: identifier }],
  });

  if (!customer) {
    throw new Error("No account found with this email or customer ID");
  }

  if (customer.status !== "ACTIVE") {
    throw new Error("Account is not active");
  }

  // Invalidate any existing unused tokens
  await PasswordResetToken.updateMany(
    { customerId: customer.customerId, used: false },
    { used: true }
  );

  // Generate 6 digit OTP preserving leading zeros
  const otpNumber = Math.floor(Math.random() * 1000000);
  const otp = String(otpNumber).padStart(6, "0");

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const count = await PasswordResetToken.countDocuments();
  const tokenId = generateId("OTP", count + 1);

  await PasswordResetToken.create({
    tokenId,
    customerId: customer.customerId,
    otp,
    expiresAt,
    used: false,
  });

  await sendPasswordResetOTP(
    customer.name,
    customer.email,
    otp
  );

  return customer.email;
};

const resetPassword = async (identifier, otp, newPassword) => {
  const customer = await Customer.findOne({
    $or: [{ email: identifier }, { customerId: identifier }],
  });

  if (!customer) {
    throw new Error("No account found with this email or customer ID");
  }

  // Find valid unused unexpired token
  const token = await PasswordResetToken.findOne({
    customerId: customer.customerId,
    otp,
    used: false,
    expiresAt: { $gt: new Date() },
  });

  if (!token) {
    throw new Error("Invalid or expired OTP");
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  await Customer.findOneAndUpdate(
    { customerId: customer.customerId },
    { password: hashedPassword }
  );

  // Mark token as used
  await PasswordResetToken.findOneAndUpdate(
    { tokenId: token.tokenId },
    { used: true }
  );

  return true;
};

module.exports = {
  registerCustomer,
  loginCustomer,
  forgotPassword,
  resetPassword,
};