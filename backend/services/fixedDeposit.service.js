const FixedDeposit = require("../models/fixedDeposit.model");
const Account = require("../models/account.model");
const Transaction = require("../models/transaction.model");
const generateId = require("../utils/idGenerator");

const openFD = async (customerId, data) => {
  const account = await Account.findOne({
    accountNumber: data.accountNumber,
  });

  if (!account) {
    throw new Error("Account not found");
  }

  if (account.customerId !== customerId) {
    throw new Error("Unauthorized access to this account");
  }

  if (account.status !== "ACTIVE") {
    throw new Error("Account is not active");
  }

  if (account.balance < data.amount) {
    throw new Error("Insufficient balance to open FD");
  }

  // Calculate maturity amount
  // Simple interest: P + (P * R/100 * T/12)
  const maturityAmount =
    data.amount +
    (data.amount * data.interestRate * data.tenureMonths) / (100 * 12);

  const startDate = new Date();
  const maturityDate = new Date(startDate);
  maturityDate.setMonth(maturityDate.getMonth() + data.tenureMonths);

  // Deduct FD amount from account
  const newBalance = account.balance - data.amount;

  await Account.findOneAndUpdate(
    { accountNumber: data.accountNumber },
    { balance: newBalance }
  );

  // Create transaction record
  const txnCount = await Transaction.countDocuments();
  const txnId = generateId("TXN", txnCount + 1, 6);

  await Transaction.create({
    txnId,
    accountNumber: data.accountNumber,
    transactionCategory: "FD_INVESTMENT",
    type: "DEBIT",
    amount: data.amount,
    balanceAfterTxn: newBalance,
    description: `FD Investment`,
  });

  const count = await FixedDeposit.countDocuments();
  const fdId = generateId("FD", count + 1);

  const fd = await FixedDeposit.create({
    fdId,
    accountNumber: data.accountNumber,
    amount: data.amount,
    interestRate: data.interestRate,
    tenureMonths: data.tenureMonths,
    maturityAmount: Math.round(maturityAmount * 100) / 100,
    startDate,
    maturityDate,
    status: "ACTIVE",
  });

  return fd;
};

const getMyFDs = async (customerId) => {
  const accounts = await Account.find({ customerId });
  const accountNumbers = accounts.map((a) => a.accountNumber);
  const fds = await FixedDeposit.find({
    accountNumber: { $in: accountNumbers },
  });
  return fds;
};

const liquidateFD = async (fdId, customerId) => {
  const fd = await FixedDeposit.findOne({ fdId });

  if (!fd) {
    throw new Error("FD not found");
  }

  if (fd.status !== "ACTIVE") {
    throw new Error("Only active FDs can be liquidated");
  }

  const account = await Account.findOne({
    accountNumber: fd.accountNumber,
  });

  if (account.customerId !== customerId) {
    throw new Error("Unauthorized access to this FD");
  }

  // Penalty calculation
  // Customer gets principal + reduced interest (50% of promised rate)
  const today = new Date();
  const monthsElapsed = Math.floor(
    (today - fd.startDate) / (1000 * 60 * 60 * 24 * 30)
  );

  const penaltyRate = fd.interestRate * 0.5;
  const creditAmount =
    fd.amount +
    (fd.amount * penaltyRate * monthsElapsed) / (100 * 12);

  const roundedCreditAmount = Math.round(creditAmount * 100) / 100;

  // Credit amount back to account
  const newBalance = account.balance + roundedCreditAmount;

  await Account.findOneAndUpdate(
    { accountNumber: fd.accountNumber },
    { balance: newBalance }
  );

  // Create transaction record
  const txnCount = await Transaction.countDocuments();
  const txnId = generateId("TXN", txnCount + 1, 6);

  await Transaction.create({
    txnId,
    accountNumber: fd.accountNumber,
    transactionCategory: "FD_INVESTMENT",
    type: "CREDIT",
    amount: roundedCreditAmount,
    balanceAfterTxn: newBalance,
    description: `FD Premature Liquidation — ${fdId}`,
  });

  // Update FD status to BROKEN
  const updatedFD = await FixedDeposit.findOneAndUpdate(
    { fdId },
    { status: "BROKEN" },
    { new: true }
  );

  return { updatedFD, creditAmount: roundedCreditAmount };
};

module.exports = { openFD, getMyFDs, liquidateFD };