const Customer = require("../models/customer.model");
const Transaction = require("../models/transaction.model");
const Account = require("../models/account.model");
const generateId = require("../utils/idGenerator");
const { sendZeroBalanceAlert, sendOverdraftAlert, sendAccountRecoveryAlert } = require("../utils/mailer");

const deposit = async (accountNumber, amount, customerId) => {
  const account = await Account.findOne({ accountNumber });

  if (!account) {
    throw new Error("Account not found");
  }

  if (account.customerId !== customerId) {
    throw new Error("Unauthorized access to this account");
  }

  if (account.status === "REJECTED") {
    throw new Error("Account is rejected");
  }

  if (
    account.status === "DEACTIVATED" &&
    account.deactivationType === "MANUAL"
  ) {
    throw new Error(
      "Account is deactivated. Please contact admin."
    );
  }

  const wasAtRisk =
    account.status === "AT_RISK" ||
    (account.status === "DEACTIVATED" &&
      account.deactivationType === "AUTO");

  const newBalance = account.balance + amount;

  await Account.findOneAndUpdate(
    { accountNumber },
    {
      balance: newBalance,
      ...(wasAtRisk
        ? {
          status: "ACTIVE",
          atRiskSince: null,
          deactivationType: null,
        }
        : {}),
    }
  );

  if (wasAtRisk) {
    const customer = await Customer.findOne({ customerId });
    await sendAccountRecoveryAlert(
      customer.name,
      accountNumber,
      customer.email
    );
  }

  const count = await Transaction.countDocuments();
  const txnId = generateId("TXN", count + 1, 6);

  const transaction = await Transaction.create({
    txnId,
    accountNumber,
    transactionCategory: "DEPOSIT",
    type: "CREDIT",
    amount,
    balanceAfterTxn: newBalance,
    description: "Cash Deposit",
  });

  return transaction;
};

const withdraw = async (accountNumber, amount, customerId) => {
  const account = await Account.findOne({ accountNumber });

  if (!account) {
    throw new Error("Account not found");
  }

  if (account.customerId !== customerId) {
    throw new Error("Unauthorized access to this account");
  }

  if (account.status !== "ACTIVE" &&
    account.status !== "AT_RISK") {
    throw new Error("Account is not active");
  }

  const newBalance = account.balance - amount;

  // SAVINGS account logic
  if (account.accountType === "SAVINGS") {
    if (newBalance < 0) {
      throw new Error("Insufficient balance");
    }
  }

  // CURRENT account logic
  if (account.accountType === "CURRENT") {
    if (newBalance < -account.overdraftLimit) {
      throw new Error(
        "Overdraft limit exceeded. Cannot withdraw further."
      );
    }
  }

  const updateFields = { balance: newBalance };

  // SAVINGS → AT_RISK when balance hits 0
  if (account.accountType === "SAVINGS" && newBalance === 0) {
    updateFields.status = "AT_RISK";
    updateFields.atRiskSince = new Date();
  }

  // CURRENT → AT_RISK when overdraft limit exactly reached
  if (
    account.accountType === "CURRENT" &&
    newBalance === -account.overdraftLimit
  ) {
    updateFields.status = "AT_RISK";
    updateFields.atRiskSince = new Date();
  }

  await Account.findOneAndUpdate(
    { accountNumber },
    updateFields
  );

  // Send appropriate email based on account type
  if (account.accountType === "SAVINGS" && newBalance === 0) {
    const customer = await Customer.findOne({ customerId });
    await sendZeroBalanceAlert(customer.name, accountNumber);
  }

  if (
    account.accountType === "CURRENT" &&
    newBalance === -account.overdraftLimit
  ) {
    const customer = await Customer.findOne({ customerId });
    await sendOverdraftAlert(
      customer.name,
      accountNumber,
      customer.email,
      account.overdraftLimit
    );
  }

  const count = await Transaction.countDocuments();
  const txnId = generateId("TXN", count + 1, 6);

  const transaction = await Transaction.create({
    txnId,
    accountNumber,
    transactionCategory: "WITHDRAW",
    type: "DEBIT",
    amount,
    balanceAfterTxn: newBalance,
    description: "Cash Withdrawal",
  });

  return { transaction, newBalance };
};

const transfer = async (
  senderAccountNumber,
  receiverAccountNumber,
  amount,
  customerId
) => {
  const senderAccount = await Account.findOne({
    accountNumber: senderAccountNumber,
  });

  if (!senderAccount) {
    throw new Error("Sender account not found");
  }

  if (senderAccount.customerId !== customerId) {
    throw new Error("Unauthorized access to this account");
  }

  if (senderAccount.status !== "ACTIVE") {
    throw new Error("Sender account is not active");
  }

  if (senderAccount.balance < amount) {
    throw new Error("Insufficient balance");
  }

  const receiverAccount = await Account.findOne({
    accountNumber: receiverAccountNumber,
  });

  if (!receiverAccount) {
    throw new Error("Receiver account not found");
  }

  if (receiverAccount.status !== "ACTIVE") {
    throw new Error("Receiver account is not active");
  }

  if (senderAccountNumber === receiverAccountNumber) {
    throw new Error(
      "Sender and receiver account cannot be same"
    );
  }

  const senderNewBalance = senderAccount.balance - amount;
  const receiverNewBalance = receiverAccount.balance + amount;

  await Account.findOneAndUpdate(
    { accountNumber: senderAccountNumber },
    { balance: senderNewBalance }
  );

  await Account.findOneAndUpdate(
    { accountNumber: receiverAccountNumber },
    { balance: receiverNewBalance }
  );

  const count = await Transaction.countDocuments();
  const referenceId = generateId("REF", count + 1, 6);

  const txnCount1 = await Transaction.countDocuments();
  const debitTxnId = generateId("TXN", txnCount1 + 1, 6);

  const debitTransaction = await Transaction.create({
    txnId: debitTxnId,
    accountNumber: senderAccountNumber,
    referenceId,
    transactionCategory: "TRANSFER",
    type: "DEBIT",
    amount,
    balanceAfterTxn: senderNewBalance,
    description: `Transfer to ${receiverAccountNumber}`,
  });

  const txnCount2 = await Transaction.countDocuments();
  const creditTxnId = generateId("TXN", txnCount2 + 1, 6);

  const creditTransaction = await Transaction.create({
    txnId: creditTxnId,
    accountNumber: receiverAccountNumber,
    referenceId,
    transactionCategory: "TRANSFER",
    type: "CREDIT",
    amount,
    balanceAfterTxn: receiverNewBalance,
    description: `Transfer from ${senderAccountNumber}`,
  });

  return { debitTransaction, creditTransaction };
};

const getPassbook = async (accountNumber, customerId) => {
  const account = await Account.findOne({ accountNumber });

  if (!account) {
    throw new Error("Account not found");
  }

  if (account.customerId !== customerId) {
    throw new Error("Unauthorized access to this account");
  }

  const transactions = await Transaction.find({ accountNumber })
    .sort({ date: -1 });

  return transactions;
};

module.exports = { deposit, withdraw, transfer, getPassbook };