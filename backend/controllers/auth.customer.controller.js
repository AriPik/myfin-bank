const {
  registerCustomer,
  loginCustomer,
  forgotPassword,
  resetPassword,
} = require("../services/auth.customer.service");
const { generateToken } = require("../utils/jwt");

const register = async (req, res) => {
  try {
    const govIdDocumentPath = req.file
      ? req.file.path
      : null;

    const customer = await registerCustomer({
      ...req.body,
      govIdDocumentPath,
    });

    res.status(201).json({
      message:
        "Registration successful. Awaiting KYC verification.",
      customerId: customer.customerId,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Email/Customer ID and password are required",
      });
    }

    const customer = await loginCustomer(identifier, password);

    const token = generateToken({
      id: customer.customerId,
      role: "CUSTOMER",
    });

    // Set JWT in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      token,
      customer: {
        customerId: customer.customerId,
        name: customer.name,
        email: customer.email,
        status: customer.status,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const forgotPasswordHandler = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({
        message: "Email or Customer ID is required",
      });
    }

    const email = await forgotPassword(identifier);

    res.status(200).json({
      message: `OTP sent successfully to registered email`,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const resetPasswordHandler = async (req, res) => {
  try {
    const { identifier, otp, newPassword } = req.body;

    if (!identifier || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email/Customer ID, OTP and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    await resetPassword(identifier, otp, newPassword);

    res.status(200).json({
      message: "Password reset successfully. Please login with new password.",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  forgotPasswordHandler,
  resetPasswordHandler,
};