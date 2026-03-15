const mongoose = require("mongoose");

const supportMessageSchema = new mongoose.Schema(
  {
    messageId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    ticketId: {
      type: String,
      required: true,
      ref: "SupportTicket",
    },
    senderType: {
      type: String,
      enum: ["CUSTOMER", "ADMIN"],
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

supportMessageSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("SupportMessage", supportMessageSchema);
