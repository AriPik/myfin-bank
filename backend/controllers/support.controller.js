const {
  createTicket,
  getMyTickets,
  getAllTickets,
  markInProgress,
  resolveTicket,
  sendMessage,
  getMessages,
} = require("../services/support.service");

const createTicketHandler = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { subject } = req.body;

    if (!subject) {
      return res.status(400).json({
        message: "Subject is required",
      });
    }

    const ticket = await createTicket(customerId, subject);
    res.status(201).json({
      message: "Support ticket created successfully",
      ticket,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyTicketsHandler = async (req, res) => {
  try {
    const customerId = req.user.id;
    const tickets = await getMyTickets(customerId);
    res.status(200).json({ tickets });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllTicketsHandler = async (req, res) => {
  try {
    const tickets = await getAllTickets();
    res.status(200).json({ tickets });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const markInProgressHandler = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await markInProgress(ticketId);
    res.status(200).json({
      message: "Ticket marked as in progress",
      ticket,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const resolveTicketHandler = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await resolveTicket(ticketId);
    res.status(200).json({
      message: "Ticket resolved successfully",
      ticket,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const sendMessageHandler = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const senderId = req.user.id;
    const senderType = req.user.role === "ADMIN" ? "ADMIN" : "CUSTOMER";
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Message cannot be empty",
      });
    }

    const newMessage = await sendMessage(
      ticketId,
      senderId,
      senderType,
      message
    );
    req.io.to(ticketId).emit("new_message", newMessage);
    res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMessagesHandler = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const messages = await getMessages(ticketId);
    res.status(200).json({ messages });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createTicketHandler,
  getMyTicketsHandler,
  getAllTicketsHandler,
  markInProgressHandler,
  resolveTicketHandler,
  sendMessageHandler,
  getMessagesHandler,
};