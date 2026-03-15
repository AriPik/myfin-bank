const {
  loginAdmin,
  seedSuperAdmin,
  seedFirstAdmin,
  registerAdmin,
  getAllAdmins,
  deactivateAdmin,
  activateAdmin,
  forgotPasswordAdmin,
  resetPasswordAdmin,
} = require("../services/auth.admin.service");
const { generateToken } = require("../utils/jwt");

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Email/Admin ID and password are required",
      });
    }

    const admin = await loginAdmin(identifier, password);

    const token = generateToken({
      id: admin.adminId,
      role: admin.role,
    });

    // Set JWT in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        adminId: admin.adminId,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const seedSuperAdminHandler = async (req, res) => {
  try {
    const admin = await seedSuperAdmin();
    res.status(201).json({
      message: "Super Admin created successfully",
      adminId: admin.adminId,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const seedFirstAdminHandler = async (req, res) => {
  try {
    const admin = await seedFirstAdmin();
    res.status(201).json({
      message: "First Admin created successfully",
      adminId: admin.adminId,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const registerAdminHandler = async (req, res) => {
  try {
    const superAdminId = req.user.id;
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const admin = await registerAdmin(req.body, superAdminId);
    res.status(201).json({
      message: "Admin registered successfully",
      admin,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllAdminsHandler = async (req, res) => {
  try {
    const admins = await getAllAdmins();
    res.status(200).json({ admins });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deactivateAdminHandler = async (req, res) => {
  try {
    const { adminId } = req.params;
    const admin = await deactivateAdmin(adminId);
    res.status(200).json({
      message: "Admin deactivated successfully",
      admin,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const activateAdminHandler = async (req, res) => {
  try {
    const { adminId } = req.params;
    const admin = await activateAdmin(adminId);
    res.status(200).json({
      message: "Admin activated successfully",
      admin,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const forgotPasswordAdminHandler = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({
        message: "Email or Admin ID is required",
      });
    }

    await forgotPasswordAdmin(identifier);
    res.status(200).json({
      message: "OTP sent successfully to registered email",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const resetPasswordAdminHandler = async (req, res) => {
  try {
    const { identifier, otp, newPassword } = req.body;

    if (!identifier || !otp || !newPassword) {
      return res.status(400).json({
        message:
          "Email/Admin ID, OTP and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    await resetPasswordAdmin(identifier, otp, newPassword);
    res.status(200).json({
      message:
        "Password reset successfully. Please login with new password.",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  login,
  seedSuperAdminHandler,
  seedFirstAdminHandler,
  registerAdminHandler,
  getAllAdminsHandler,
  deactivateAdminHandler,
  activateAdminHandler,
  forgotPasswordAdminHandler,
  resetPasswordAdminHandler,
};