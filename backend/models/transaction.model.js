const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    txnId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    accountNumber: {
      type: String,
      required: true,
      ref: "Account",
    },
    referenceId: {
      type: String,
      default: null,
    },
    transactionCategory: {
      type: String,
      enum: [
        "DEPOSIT",
        "WITHDRAW",
        "TRANSFER",
        "FD_INVESTMENT",
        "RD_INSTALLMENT",
        "LOAN_EMI",
      ],
      required: true,
    },
    type: {
      type: String,
      enum: ["DEBIT", "CREDIT"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    balanceAfterTxn: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
