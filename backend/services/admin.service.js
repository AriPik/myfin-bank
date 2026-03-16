const Customer = require("../models/customer.model");
const Account = require("../models/account.model");
const Transaction = require("../models/transaction.model");
const Loan = require("../models/loan.model");
const FixedDeposit = require("../models/fixedDeposit.model");
const RecurringDeposit = require("../models/recurringDeposit.model");
const { sendWelcomeEmail } = require("../utils/mailer");
const getAllCustomers = async () => {
  const customers = await Customer.find({}).select("-password");
  return customers;
};

const getCustomerById = async (customerId) => {
  const customer = await Customer.findOne({ customerId }).select(
    "-password"
  );

  if (!customer) {
    throw new Error("Customer not found");
  }

  const accounts = await Account.find({ customerId });

  return { customer, accounts };
};

const activateCustomer = async (customerId) => {
  const customer = await Customer.findOne({ customerId });

  if (!customer) {
    throw new Error("Customer not found");
  }

  if (customer.status === "ACTIVE") {
    throw new Error("Customer is already active");
  }

  const updated = await Customer.findOneAndUpdate(
    { customerId },
    { status: "ACTIVE" },
    { new: true }
  ).select("-password");

  await sendWelcomeEmail(
    customer.name,
    customer.email,
    customer.customerId
  );
  return updated;
};

const rejectCustomer = async (customerId) => {
  const customer = await Customer.findOne({ customerId });

  if (!customer) {
    throw new Error("Customer not found");
  }

  if (customer.status === "REJECTED") {
    throw new Error("Customer is already rejected");
  }

  const updated = await Customer.findOneAndUpdate(
    { customerId },
    { status: "REJECTED" },
    { new: true }
  ).select("-password");

  return updated;
};

const getReportsSummary = async () => {
  const totalCustomers = await Customer.countDocuments();
  const activeCustomers = await Customer.countDocuments({
    status: "ACTIVE",
  });
  const pendingCustomers = await Customer.countDocuments({
    status: "PENDING_VERIFICATION",
  });

  const totalAccounts = await Account.countDocuments();
  const activeAccounts = await Account.countDocuments({
    status: "ACTIVE",
  });
  const atRiskAccounts = await Account.countDocuments({
    status: "AT_RISK",
  });

  const totalDeposits = await Transaction.aggregate([
    { $match: { type: "CREDIT", transactionCategory: "DEPOSIT" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const totalWithdrawals = await Transaction.aggregate([
    { $match: { type: "DEBIT", transactionCategory: "WITHDRAW" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const activeLoans = await Loan.countDocuments({ status: "ACTIVE" });
  const pendingLoans = await Loan.countDocuments({
    status: "PENDING",
  });
  const totalLoanAmount = await Loan.aggregate([
    { $match: { status: "ACTIVE" } },
    { $group: { _id: null, total: { $sum: "$remainingBalance" } } },
  ]);

  const activeFDs = await FixedDeposit.countDocuments({
    status: "ACTIVE",
  });
  const totalFDAmount = await FixedDeposit.aggregate([
    { $match: { status: "ACTIVE" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const activeRDs = await RecurringDeposit.countDocuments({
    status: "ACTIVE",
  });
  const totalRDAmount = await RecurringDeposit.aggregate([
    { $match: { status: "ACTIVE" } },
    { $group: { _id: null, total: { $sum: "$monthlyAmount" } } },
  ]);

  return {
    customers: {
      total: totalCustomers,
      active: activeCustomers,
      pending: pendingCustomers,
    },
    accounts: {
      total: totalAccounts,
      active: activeAccounts,
      atRisk: atRiskAccounts,
    },
    transactions: {
      totalDeposits: totalDeposits[0]?.total || 0,
      totalWithdrawals: totalWithdrawals[0]?.total || 0,
    },
    loans: {
      active: activeLoans,
      pending: pendingLoans,
      totalOutstanding: totalLoanAmount[0]?.total || 0,
    },
    fixedDeposits: {
      active: activeFDs,
      totalAmount: totalFDAmount[0]?.total || 0,
    },
    recurringDeposits: {
      active: activeRDs,
      totalMonthlyAmount: totalRDAmount[0]?.total || 0,
    },
  };
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  activateCustomer,
  rejectCustomer,
  getReportsSummary,
};