const express = require("express");
const router = express.Router();
const {
  createTicketHandler,
  getMyTicketsHandler,
  getAllTicketsHandler,
  markInProgressHandler,
  resolveTicketHandler,
  sendMessageHandler,
  getMessagesHandler,
} = require("../controllers/support.controller");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// Customer routes
router.post(
  "/tickets/create",
  protect,
  restrictTo("CUSTOMER"),
  createTicketHandler
);

router.get(
  "/tickets/my-tickets",
  protect,
  restrictTo("CUSTOMER"),
  getMyTicketsHandler
);

// Shared routes — both customer and admin
router.post(
  "/tickets/:ticketId/messages/send",
  protect,
  sendMessageHandler
);

router.get(
  "/tickets/:ticketId/messages",
  protect,
  getMessagesHandler
);

// Admin routes
router.get(
  "/tickets/all",
  protect,
  restrictTo("ADMIN"),
  getAllTicketsHandler
);

router.patch(
  "/tickets/:ticketId/in-progress",
  protect,
  restrictTo("ADMIN"),
  markInProgressHandler
);

router.patch(
  "/tickets/:ticketId/resolve",
  protect,
  restrictTo("ADMIN"),
  resolveTicketHandler
);

module.exports = router;