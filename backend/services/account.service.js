const Customer = require("../models/customer.model");
const { sendWelcomeEmail, sendAccountApprovedEmail } = require("../utils/mailer");
const Account = require("../models/account.model");
const generateId = require("../utils/idGenerator");

const requestAccount = async (customerId, accountType) => {
  // max 1 SAVINGS + 1 CURRENT per customer
  const existingAccount = await Account.findOne({
    customerId,
    accountType,
    status: { $ne: "REJECTED" },
  });

  if (existingAccount) {
    throw new Error(
      `You already have a ${accountType} account`
    );
  }

  const count = await Account.countDocuments();
  const prefix = accountType === "SAVINGS" ? "SACC" : "CACC";
  const accountNumber = generateId(prefix, count + 1);

  const account = await Account.create({
    accountNumber,
    customerId,
    accountType,
    balance: 0,
    overdraftLimit: 0,
    status: "REQUESTED",
  });

  return account;
};

const getMyAccounts = async (customerId) => {
  const accounts = await Account.find({ customerId });
  return accounts;
};

const getAllAccounts = async () => {
  const accounts = await Account.find({});
  return accounts;
};

const approveAccount = async (accountNumber, adminId, adminName) => {
  const account = await Account.findOne({ accountNumber });

  if (!account) {
    throw new Error("Account not found");
  }

  if (account.status !== "REQUESTED") {
    throw new Error("Only requested accounts can be approved");
  }

  const updatedAccount = await Account.findOneAndUpdate(
    { accountNumber },
    {
      status: "ACTIVE",
      approvedBy: adminId,
      approvedByName: "Admin",
      ...(account.accountType === "CURRENT" && { overdraftLimit: 5000 }),
    },
    { new: true }
  );

  const customer = await Customer.findOne({
    customerId: account.customerId,
  });

  await sendAccountApprovedEmail(
    customer.name,
    customer.email,
    accountNumber,
    account.accountType
  );

  return updatedAccount;
};

const rejectAccount = async (accountNumber, adminId, adminName) => {
  const account = await Account.findOne({ accountNumber });

  if (!account) {
    throw new Error("Account not found");
  }

  if (account.status !== "REQUESTED") {
    throw new Error("Only requested accounts can be rejected");
  }

  const updatedAccount = await Account.findOneAndUpdate(
    { accountNumber },
    {
      status: "REJECTED",
      rejectedBy: adminId,
      rejectedByName: "Admin",
    },
    { new: true }
  );

  return updatedAccount;
};

const activateAccount = async (accountNumber) => {
  const account = await Account.findOneAndUpdate(
    { accountNumber },
    {
      status: "ACTIVE",
      deactivationType: null,
      atRiskSince: null,
    },
    { new: true }
  );

  if (!account) {
    throw new Error("Account not found");
  }

  return account;
};

const deactivateAccount = async (accountNumber) => {
  const account = await Account.findOneAndUpdate(
    { accountNumber },
    {
      status: "DEACTIVATED",
      deactivationType: "MANUAL",
    },
    { new: true }
  );

  if (!account) {
    throw new Error("Account not found");
  }

  return account;
};

module.exports = {
  requestAccount,
  getMyAccounts,
  getAllAccounts,
  approveAccount,
  rejectAccount,
  activateAccount,
  deactivateAccount,
};