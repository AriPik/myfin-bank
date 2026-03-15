const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },

    // KYC fields
    govIdType: {
      type: String,
      enum: ["AADHAAR", "PAN"],
      required: true,
    },
    govIdNumber: {
      type: String,
      required: true,
      trim: true,
    },
    govIdDocumentPath: {
      type: String,
      default: null, // set by Multer after file upload
    },

    // Account status
    status: {
      type: String,
      enum: ["PENDING_VERIFICATION", "ACTIVE", "REJECTED"],
      default: "PENDING_VERIFICATION",
    },
  },
  {
    timestamps: true,
  }
);

// Hide sensitive fields from API response
customerSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Customer", customerSchema);
