const mongoose = require("mongoose");

const fixedDepositSchema = new mongoose.Schema(
  {
    fdId: {
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
    amount: {
      type: Number,
      required: true,
    },
    interestRate: {
      type: Number,
      required: true,
    },
    tenureMonths: {
      type: Number,
      required: true,
    },
    maturityAmount: {
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

fixedDepositSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("FixedDeposit", fixedDepositSchema);
