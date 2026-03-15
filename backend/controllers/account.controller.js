const {
  requestAccount,
  getMyAccounts,
  getAllAccounts,
  approveAccount,
  rejectAccount,
  activateAccount,
  deactivateAccount,
} = require("../services/account.service");
const Admin = require("../models/admin.model");
const requestAccountHandler = async (req, res) => {
  try {
    const { accountType } = req.body;
    const customerId = req.user.id;

    if (!accountType) {
      return res.status(400).json({ 
        message: "Account type is required" 
      });
    }

    if (!["SAVINGS", "CURRENT"].includes(accountType)) {
      return res.status(400).json({
        message: "Account type must be SAVINGS or CURRENT",
      });
    }

    const account = await requestAccount(customerId, accountType);
    res.status(201).json({
      message: "Account request submitted successfully",
      account,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyAccountsHandler = async (req, res) => {
  try {
    const customerId = req.user.id;
    const accounts = await getMyAccounts(customerId);
    res.status(200).json({ accounts });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllAccountsHandler = async (req, res) => {
  try {
    const accounts = await getAllAccounts();
    res.status(200).json({ accounts });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const approveAccountHandler = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const adminId = req.user.id;
    const admin = await Admin.findOne({ adminId });
    const account = await approveAccount(
      accountNumber,
      adminId,
      admin.name
    );
    res.status(200).json({
      message: "Account approved successfully",
      account,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const rejectAccountHandler = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const adminId = req.user.id;
    const admin = await Admin.findOne({ adminId });
    const account = await rejectAccount(
      accountNumber,
      adminId,
      admin.name
    );
    res.status(200).json({
      message: "Account rejected",
      account,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const activateAccountHandler = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const account = await activateAccount(accountNumber);
    res.status(200).json({
      message: "Account activated successfully",
      account,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deactivateAccountHandler = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const account = await deactivateAccount(accountNumber);
    res.status(200).json({
      message: "Account deactivated successfully",
      account,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  requestAccountHandler,
  getMyAccountsHandler,
  getAllAccountsHandler,
  approveAccountHandler,
  rejectAccountHandler,
  activateAccountHandler,
  deactivateAccountHandler,
};