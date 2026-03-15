const SupportTicket = require("../models/supportTicket.model");
const SupportMessage = require("../models/supportMessage.model");
const Customer = require("../models/customer.model");
const generateId = require("../utils/idGenerator");
const {
  sendTicketAcknowledgement,
  sendAdminReplyNotification,
  sendTicketResolvedNotification,
} = require("../utils/mailer");

const createTicket = async (customerId, subject) => {
  const count = await SupportTicket.countDocuments();
  const ticketId = generateId("TKT", count + 1);

  const ticket = await SupportTicket.create({
    ticketId,
    customerId,
    subject,
    status: "OPEN",
  });
  const customer = await Customer.findOne({ customerId });

  await sendTicketAcknowledgement(
    customer.name,
    customer.email,
    ticketId,
    subject
  );
  return ticket;
};

const getMyTickets = async (customerId) => {
  const tickets = await SupportTicket.find({ customerId }).sort({
    createdAt: -1,
  });
  return tickets;
};

const getAllTickets = async () => {
  const tickets = await SupportTicket.find({}).sort({
    createdAt: -1,
  });
  return tickets;
};

const markInProgress = async (ticketId) => {
  const ticket = await SupportTicket.findOne({ ticketId });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  if (ticket.status === "RESOLVED") {
    throw new Error("Resolved ticket cannot be reopened");
  }

  const updated = await SupportTicket.findOneAndUpdate(
    { ticketId },
    { status: "IN_PROGRESS" },
    { new: true }
  );

  return updated;
};

const resolveTicket = async (ticketId) => {
  const ticket = await SupportTicket.findOne({ ticketId });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  if (ticket.status === "RESOLVED") {
    throw new Error("Ticket is already resolved");
  }

  const updated = await SupportTicket.findOneAndUpdate(
    { ticketId },
    { status: "RESOLVED" },
    { new: true }
  );
  const customer = await Customer.findOne({
    customerId: ticket.customerId,
  });

  await sendTicketResolvedNotification(
    customer.name,
    customer.email,
    ticketId,
    ticket.subject
  );
  return updated;
};

const sendMessage = async (ticketId, senderId, senderType, message) => {
  const ticket = await SupportTicket.findOne({ ticketId });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  if (ticket.status === "RESOLVED") {
    throw new Error(
      "Cannot send message on a resolved ticket"
    );
  }

  const count = await SupportMessage.countDocuments();
  const messageId = generateId("MSG", count + 1);

  const newMessage = await SupportMessage.create({
    messageId,
    ticketId,
    senderType,
    senderId,
    message,
    timestamp: new Date(),
  });
  if (senderType === "ADMIN") {
    const customer = await Customer.findOne({
      customerId: ticket.customerId,
    });

    await sendAdminReplyNotification(
      customer.name,
      customer.email,
      ticketId,
      message
    );
  }
  return newMessage;
};

const getMessages = async (ticketId) => {
  const ticket = await SupportTicket.findOne({ ticketId });

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  const messages = await SupportMessage.find({ ticketId }).sort({
    timestamp: 1,
  });

  return messages;
};

module.exports = {
  createTicket,
  getMyTickets,
  getAllTickets,
  markInProgress,
  resolveTicket,
  sendMessage,
  getMessages,
};