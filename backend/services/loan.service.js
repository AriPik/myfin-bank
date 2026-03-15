const Loan = require("../models/loan.model");
const LoanPayment = require("../models/loanPayment.model");
const Account = require("../models/account.model");
const Customer = require("../models/customer.model");
const Transaction = require("../models/transaction.model");
const generateId = require("../utils/idGenerator");
const { sendLoanSettledAlert } = require("../utils/mailer");

// EMI calculation using PMT formula
const calculateEMI = (principal, annualRate, tenureMonths) => {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / tenureMonths;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi * 100) / 100;
};

const applyLoan = async (customerId, data) => {
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

  // Check if customer already has a pending or active loan
  const existingLoan = await Loan.findOne({
    accountNumber: data.accountNumber,
    status: { $in: ["PENDING", "ACTIVE"] },
  });

  if (existingLoan) {
    throw new Error(
      "You already have a pending or active loan on this account"
    );
  }

  const emiAmount = calculateEMI(
    data.loanAmount,
    data.interestRate,
    data.tenureMonths
  );

  const count = await Loan.countDocuments();
  const loanId = generateId("LN", count + 1);

  const loan = await Loan.create({
    loanId,
    accountNumber: data.accountNumber,
    loanAmount: data.loanAmount,
    interestRate: data.interestRate,
    tenureMonths: data.tenureMonths,
    emiAmount,
    remainingBalance: data.loanAmount,
    status: "PENDING",
  });

  return loan;
};

const getMyLoans = async (customerId) => {
  const accounts = await Account.find({ customerId });
  const accountNumbers = accounts.map((a) => a.accountNumber);
  const loans = await Loan.find({
    accountNumber: { $in: accountNumbers },
  });
  return loans;
};

const getAllLoans = async () => {
  const loans = await Loan.find({});
  return loans;
};

const approveLoan = async (loanId, adminId, adminName) => {
  const loan = await Loan.findOne({ loanId });

  if (!loan) {
    throw new Error("Loan not found");
  }

  if (loan.status !== "PENDING") {
    throw new Error("Only pending loans can be approved");
  }

  const startDate = new Date();

  await Account.findOneAndUpdate(
    { accountNumber: loan.accountNumber },
    { $inc: { balance: loan.loanAmount } }
  );

  const txnCount = await Transaction.countDocuments();
  const txnId = generateId("TXN", txnCount + 1, 6);

  const account = await Account.findOne({
    accountNumber: loan.accountNumber,
  });

  await Transaction.create({
    txnId,
    accountNumber: loan.accountNumber,
    transactionCategory: "DEPOSIT",
    type: "CREDIT",
    amount: loan.loanAmount,
    balanceAfterTxn: account.balance,
    description: `Loan Disbursement — ${loanId}`,
  });

  for (let i = 1; i <= loan.tenureMonths; i++) {
    const payCount = await LoanPayment.countDocuments();
    const paymentId = generateId("PAY", payCount + 1);
    await LoanPayment.create({
      paymentId,
      loanId,
      emiNumber: i,
      amount: loan.emiAmount,
      status: "PENDING",
    });
  }

  const updatedLoan = await Loan.findOneAndUpdate(
    { loanId },
    {
      status: "ACTIVE",
      startDate,
      remainingBalance: loan.loanAmount,
      approvedBy: adminId,
      approvedByName: adminName,
    },
    { new: true }
  );

  return updatedLoan;
};

const rejectLoan = async (loanId, adminId, adminName) => {
  const loan = await Loan.findOne({ loanId });

  if (!loan) {
    throw new Error("Loan not found");
  }

  if (loan.status !== "PENDING") {
    throw new Error("Only pending loans can be rejected");
  }

  const updatedLoan = await Loan.findOneAndUpdate(
    { loanId },
    {
      status: "REJECTED",
      rejectedBy: adminId,
      rejectedByName: adminName,
    },
    { new: true }
  );

  return updatedLoan;
};


const getLoanPayments = async (loanId, customerId) => {
  const loan = await Loan.findOne({ loanId });

  if (!loan) {
    throw new Error("Loan not found");
  }

  const account = await Account.findOne({
    accountNumber: loan.accountNumber,
  });

  if (account.customerId !== customerId) {
    throw new Error("Unauthorized access to this loan");
  }

  const payments = await LoanPayment.find({ loanId }).sort({
    emiNumber: 1,
  });

  return payments;
};

const processEMI = async (loanId) => {
  const loan = await Loan.findOne({ loanId, status: "ACTIVE" });

  if (!loan) {
    throw new Error("Active loan not found");
  }

  // Find next pending EMI
  const nextEMI = await LoanPayment.findOne({
    loanId,
    status: "PENDING",
  }).sort({ emiNumber: 1 });

  if (!nextEMI) {
    throw new Error("No pending EMI found");
  }

  const account = await Account.findOne({
    accountNumber: loan.accountNumber,
  });

  if (account.balance < loan.emiAmount) {
    throw new Error("Insufficient balance for EMI deduction");
  }

  const newBalance = account.balance - loan.emiAmount;
  const newRemainingBalance =
    loan.remainingBalance - loan.emiAmount;

  // Deduct EMI from account
  await Account.findOneAndUpdate(
    { accountNumber: loan.accountNumber },
    { balance: newBalance }
  );

  // Create transaction record
  const txnCount = await Transaction.countDocuments();
  const txnId = generateId("TXN", txnCount + 1, 6);

  const transaction = await Transaction.create({
    txnId,
    accountNumber: loan.accountNumber,
    transactionCategory: "LOAN_EMI",
    type: "DEBIT",
    amount: loan.emiAmount,
    balanceAfterTxn: newBalance,
    description: `EMI Payment — ${loanId} — installment ${nextEMI.emiNumber}`,
  });

  // Update EMI payment record
  await LoanPayment.findOneAndUpdate(
    { paymentId: nextEMI.paymentId },
    {
      status: "PAID",
      paymentDate: new Date(),
      referenceId: txnId,
    }
  );

  // Update loan remaining balance
  await Loan.findOneAndUpdate(
    { loanId },
    { remainingBalance: newRemainingBalance }
  );

  // Auto close loan if all EMIs paid
  if (newRemainingBalance <= 0) {
    await Loan.findOneAndUpdate(
      { loanId },
      { status: "CLOSED" }
    );

    const customer = await Customer.findOne({
      customerId: account.customerId,
    });

    await sendLoanSettledAlert(
      customer.name,
      loanId,
      loan.accountNumber
    );
  }

  return transaction;
};

module.exports = {
  applyLoan,
  getMyLoans,
  getAllLoans,
  approveLoan,
  rejectLoan,
  getLoanPayments,
  processEMI,
};