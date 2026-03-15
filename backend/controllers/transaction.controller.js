const {
  deposit,
  withdraw,
  transfer,
  getPassbook,
} = require("../services/transaction.service");

const depositHandler = async (req, res) => {
  try {
    const { accountNumber, amount } = req.body;
    const customerId = req.user.id;

    if (!accountNumber || !amount) {
      return res.status(400).json({
        message: "Account number and amount are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than zero",
      });
    }

    const transaction = await deposit(
      accountNumber,
      amount,
      customerId
    );

    res.status(201).json({
      message: "Deposit successful",
      transaction,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const withdrawHandler = async (req, res) => {
  try {
    const { accountNumber, amount } = req.body;
    const customerId = req.user.id;

    if (!accountNumber || !amount) {
      return res.status(400).json({
        message: "Account number and amount are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than zero",
      });
    }

    const { transaction, newBalance } = await withdraw(
      accountNumber,
      amount,
      customerId
    );

    res.status(201).json({
      message: "Withdrawal successful",
      transaction,
      newBalance,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const transferHandler = async (req, res) => {
  try {
    const { senderAccountNumber, receiverAccountNumber, amount } =
      req.body;
    const customerId = req.user.id;

    if (!senderAccountNumber || !receiverAccountNumber || !amount) {
      return res.status(400).json({
        message:
          "Sender account, receiver account and amount are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than zero",
      });
    }

    const { debitTransaction, creditTransaction } = await transfer(
      senderAccountNumber,
      receiverAccountNumber,
      amount,
      customerId
    );

    res.status(201).json({
      message: "Transfer successful",
      debitTransaction,
      creditTransaction,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPassbookHandler = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const customerId = req.user.id;

    const transactions = await getPassbook(
      accountNumber,
      customerId
    );

    res.status(200).json({ transactions });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  depositHandler,
  withdrawHandler,
  transferHandler,
  getPassbookHandler,
};