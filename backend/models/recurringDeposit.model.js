const mongoose = require("mongoose");

const recurringDepositSchema = new mongoose.Schema(
  {
    rdId: {
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
    monthlyAmount: {
      type: Number,
      required: true,
    },
    tenureMonths: {
      type: Number,
      required: true,
    },
    interestRate: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    maturityDate: {
      type: Date,
      required: true,
    },
    paidInstallments: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "MATURED", "BROKEN"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

recurringDepositSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("RecurringDeposit", recurringDepositSchema);
