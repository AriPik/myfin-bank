const RecurringDeposit = require("../models/recurringDeposit.model");
const Account = require("../models/account.model");
const Transaction = require("../models/transaction.model");
const generateId = require("../utils/idGenerator");

const openRD = async (customerId, data) => {
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

  if (account.balance < data.monthlyAmount) {
    throw new Error(
      "Insufficient balance for first installment"
    );
  }

  const startDate = new Date();
  const maturityDate = new Date(startDate);
  maturityDate.setMonth(
    maturityDate.getMonth() + data.tenureMonths
  );

  // Deduct first installment immediately
  const newBalance = account.balance - data.monthlyAmount;

  await Account.findOneAndUpdate(
    { accountNumber: data.accountNumber },
    { balance: newBalance }
  );

  // Create transaction record for first installment
  const txnCount = await Transaction.countDocuments();
  const txnId = generateId("TXN", txnCount + 1, 6);

  await Transaction.create({
    txnId,
    accountNumber: data.accountNumber,
    transactionCategory: "RD_INSTALLMENT",
    type: "DEBIT",
    amount: data.monthlyAmount,
    balanceAfterTxn: newBalance,
    description: `RD Installment 1`,
  });

  const count = await RecurringDeposit.countDocuments();
  const rdId = generateId("RD", count + 1);

  const rd = await RecurringDeposit.create({
    rdId,
    accountNumber: data.accountNumber,
    monthlyAmount: data.monthlyAmount,
    tenureMonths: data.tenureMonths,
    interestRate: data.interestRate,
    startDate,
    maturityDate,
    paidInstallments: 1,
    status: "ACTIVE",
  });

  return rd;
};

const getMyRDs = async (customerId) => {
  const accounts = await Account.find({ customerId });
  const accountNumbers = accounts.map((a) => a.accountNumber);
  const rds = await RecurringDeposit.find({
    accountNumber: { $in: accountNumbers },
  });
  return rds;
};

const payInstallment = async (rdId, customerId) => {
  const rd = await RecurringDeposit.findOne({ rdId });

  if (!rd) {
    throw new Error("RD not found");
  }

  if (rd.status !== "ACTIVE") {
    throw new Error("Only active RDs can receive installments");
  }

  const account = await Account.findOne({
    accountNumber: rd.accountNumber,
  });

  if (account.customerId !== customerId) {
    throw new Error("Unauthorized access to this RD");
  }

  if (rd.paidInstallments >= rd.tenureMonths) {
    throw new Error("All installments already paid");
  }

  if (account.balance < rd.monthlyAmount) {
    throw new Error("Insufficient balance for installment");
  }

  const newBalance = account.balance - rd.monthlyAmount;
  const newPaidInstallments = rd.paidInstallments + 1;

  await Account.findOneAndUpdate(
    { accountNumber: rd.accountNumber },
    { balance: newBalance }
  );

  // Create transaction record
  const txnCount = await Transaction.countDocuments();
  const txnId = generateId("TXN", txnCount + 1, 6);

  await Transaction.create({
    txnId,
    accountNumber: rd.accountNumber,
    transactionCategory: "RD_INSTALLMENT",
    type: "DEBIT",
    amount: rd.monthlyAmount,
    balanceAfterTxn: newBalance,
    description: `RD Installment ${newPaidInstallments}`,
  });

  // Check if all installments paid → MATURED
  const newStatus =
    newPaidInstallments >= rd.tenureMonths ? "MATURED" : "ACTIVE";

  // If matured credit back maturity amount
  if (newStatus === "MATURED") {
    const maturityAmount =
      rd.monthlyAmount * rd.tenureMonths +
      (rd.monthlyAmount *
        rd.tenureMonths *
        rd.interestRate *
        rd.tenureMonths) /
        (100 * 12);

    const maturedBalance = newBalance + maturityAmount;

    await Account.findOneAndUpdate(
      { accountNumber: rd.accountNumber },
      { balance: maturedBalance }
    );

    const maturityTxnCount = await Transaction.countDocuments();
    const maturityTxnId = generateId("TXN", maturityTxnCount + 1, 6);

    await Transaction.create({
      txnId: maturityTxnId,
      accountNumber: rd.accountNumber,
      transactionCategory: "RD_INSTALLMENT",
      type: "CREDIT",
      amount: Math.round(maturityAmount * 100) / 100,
      balanceAfterTxn: Math.round(maturedBalance * 100) / 100,
      description: `RD Maturity Credit — ${rdId}`,
    });
  }

  const updatedRD = await RecurringDeposit.findOneAndUpdate(
    { rdId },
    {
      paidInstallments: newPaidInstallments,
      status: newStatus,
    },
    { new: true }
  );

  return updatedRD;
};

module.exports = { openRD, getMyRDs, payInstallment };