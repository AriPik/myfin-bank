const {
  openRD,
  getMyRDs,
  payInstallment,
} = require("../services/recurringDeposit.service");

const openRDHandler = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { accountNumber, monthlyAmount, tenureMonths, interestRate } =
      req.body;

    if (!accountNumber || !monthlyAmount || 
        !tenureMonths || !interestRate) {
      return res.status(400).json({
        message:
          "Account number, monthly amount, tenure and interest rate are required",
      });
    }

    if (monthlyAmount <= 0) {
      return res.status(400).json({
        message: "Monthly amount must be greater than zero",
      });
    }

    if (tenureMonths <= 0) {
      return res.status(400).json({
        message: "Tenure must be greater than zero",
      });
    }

    if (interestRate <= 0) {
      return res.status(400).json({
        message: "Interest rate must be greater than zero",
      });
    }

    const rd = await openRD(customerId, req.body);
    res.status(201).json({
      message: "Recurring deposit opened successfully",
      rd,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyRDsHandler = async (req, res) => {
  try {
    const customerId = req.user.id;
    const rds = await getMyRDs(customerId);
    res.status(200).json({ rds });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const payInstallmentHandler = async (req, res) => {
  try {
    const { rdId } = req.params;
    const customerId = req.user.id;
    const rd = await payInstallment(rdId, customerId);
    res.status(200).json({
      message: "Installment paid successfully",
      rd,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  openRDHandler,
  getMyRDsHandler,
  payInstallmentHandler,
};