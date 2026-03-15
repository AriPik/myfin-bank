const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    loanId: {
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
    loanAmount: {
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
    emiAmount: {
      type: Number,
      required: true,
    },
    remainingBalance: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "PENDING",
        "APPROVED",
        "REJECTED",
        "ACTIVE",
        "CLOSED",
      ],
      default: "PENDING",
    },
    startDate: {
      type: Date,
      default: null,
    },
    approvedBy: {
      type: String,
      default: null,
    },
    approvedByName: {
      type: String,
      default: null,
    },
    rejectedBy: {
      type: String,
      default: null,
    },
    rejectedByName: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

loanSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Loan", loanSchema);
