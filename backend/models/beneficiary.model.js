const mongoose = require("mongoose");

const beneficiarySchema = new mongoose.Schema(
  {
    beneficiaryId: {
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
    beneficiaryName: {
      type: String,
      required: true,
      trim: true,
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

beneficiarySchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Beneficiary", beneficiarySchema);
