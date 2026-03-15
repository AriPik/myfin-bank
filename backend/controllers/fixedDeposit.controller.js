const {
  openFD,
  getMyFDs,
  liquidateFD,
} = require("../services/fixedDeposit.service");

const openFDHandler = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { accountNumber, amount, interestRate, tenureMonths } =
      req.body;

    if (!accountNumber || !amount || !interestRate || !tenureMonths) {
      return res.status(400).json({
        message:
          "Account number, amount, interest rate and tenure are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than zero",
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

    const fd = await openFD(customerId, req.body);
    res.status(201).json({
      message: "Fixed deposit opened successfully",
      fd,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyFDsHandler = async (req, res) => {
  try {
    const customerId = req.user.id;
    const fds = await getMyFDs(customerId);
    res.status(200).json({ fds });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const liquidateFDHandler = async (req, res) => {
  try {
    const { fdId } = req.params;
    const customerId = req.user.id;
    const { updatedFD, creditAmount } = await liquidateFD(
      fdId,
      customerId
    );
    res.status(200).json({
      message: "FD liquidated successfully",
      creditAmount,
      fd: updatedFD,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  openFDHandler,
  getMyFDsHandler,
  liquidateFDHandler,
};