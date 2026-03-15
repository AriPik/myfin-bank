const {
  applyLoan,
  getMyLoans,
  getAllLoans,
  approveLoan,
  rejectLoan,
  getLoanPayments,
  processEMI,
} = require("../services/loan.service");

const Admin = require("../models/admin.model");

const applyLoanHandler = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { accountNumber, loanAmount, interestRate, tenureMonths } =
      req.body;

    if (!accountNumber || !loanAmount || !interestRate || !tenureMonths) {
      return res.status(400).json({
        message:
          "Account number, loan amount, interest rate and tenure are required",
      });
    }

    if (loanAmount <= 0) {
      return res.status(400).json({
        message: "Loan amount must be greater than zero",
      });
    }

    if (interestRate <= 0) {
      return res.status(400).json({
        message: "Interest rate must be greater than zero",
      });
    }

    if (tenureMonths <= 0) {
      return res.status(400).json({
        message: "Tenure must be greater than zero",
      });
    }

    const loan = await applyLoan(customerId, req.body);
    res.status(201).json({
      message: "Loan application submitted successfully",
      loan,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyLoansHandler = async (req, res) => {
  try {
    const customerId = req.user.id;
    const loans = await getMyLoans(customerId);
    res.status(200).json({ loans });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllLoansHandler = async (req, res) => {
  try {
    const loans = await getAllLoans();
    res.status(200).json({ loans });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const approveLoanHandler = async (req, res) => {
  try {
    const { loanId } = req.params;
    const adminId = req.user.id;
    const admin = await Admin.findOne({ adminId });
    const loan = await approveLoan(loanId, adminId, admin.name);
    res.status(200).json({
      message: "Loan approved successfully",
      loan,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const rejectLoanHandler = async (req, res) => {
  try {
    const { loanId } = req.params;
    const adminId = req.user.id;
    const admin = await Admin.findOne({ adminId });
    const loan = await rejectLoan(loanId, adminId, admin.name);
    res.status(200).json({
      message: "Loan rejected",
      loan,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getLoanPaymentsHandler = async (req, res) => {
  try {
    const { loanId } = req.params;
    const customerId = req.user.id;
    const payments = await getLoanPayments(loanId, customerId);
    res.status(200).json({ payments });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const processEMIHandler = async (req, res) => {
  try {
    const { loanId } = req.params;
    const transaction = await processEMI(loanId);
    res.status(200).json({
      message: "EMI processed successfully",
      transaction,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  applyLoanHandler,
  getMyLoansHandler,
  getAllLoansHandler,
  approveLoanHandler,
  rejectLoanHandler,
  getLoanPaymentsHandler,
  processEMIHandler,
};