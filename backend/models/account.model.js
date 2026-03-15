const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    customerId: {
      type: String,
      required: true,
      ref: "Customer",
    },
    accountType: {
      type: String,
      enum: ["SAVINGS", "CURRENT"],
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    overdraftLimit: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: [
        "REQUESTED",
        "ACTIVE",
        "AT_RISK",
        "DEACTIVATED",
        "REJECTED",
      ],
      default: "REQUESTED",
    },
    deactivationType: {
      type: String,
      enum: ["AUTO", "MANUAL"],
      default: null,
    },
    atRiskSince: {
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

accountSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Account", accountSchema);
