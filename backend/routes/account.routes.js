const express = require("express");
const router = express.Router();
const {
  requestAccountHandler,
  getMyAccountsHandler,
  getAllAccountsHandler,
  approveAccountHandler,
  rejectAccountHandler,
  activateAccountHandler,
  deactivateAccountHandler,
} = require("../controllers/account.controller");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// Customer routes
router.post(
  "/request",
  protect,
  restrictTo("CUSTOMER"),
  requestAccountHandler
);

router.get(
  "/my-accounts",
  protect,
  restrictTo("CUSTOMER"),
  getMyAccountsHandler
);

// Admin routes
router.get(
  "/all",
  protect,
  restrictTo("ADMIN"),
  getAllAccountsHandler
);

router.patch(
  "/:accountNumber/approve",
  protect,
  restrictTo("ADMIN"),
  approveAccountHandler
);

router.patch(
  "/:accountNumber/reject",
  protect,
  restrictTo("ADMIN"),
  rejectAccountHandler
);

router.patch(
  "/:accountNumber/activate",
  protect,
  restrictTo("ADMIN"),
  activateAccountHandler
);

router.patch(
  "/:accountNumber/deactivate",
  protect,
  restrictTo("ADMIN"),
  deactivateAccountHandler
);

module.exports = router;