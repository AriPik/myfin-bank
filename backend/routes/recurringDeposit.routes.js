const express = require("express");
const router = express.Router();
const {
  openRDHandler,
  getMyRDsHandler,
  payInstallmentHandler,
} = require("../controllers/recurringDeposit.controller");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post(
  "/open",
  protect,
  restrictTo("CUSTOMER"),
  openRDHandler
);

router.get(
  "/my-rds",
  protect,
  restrictTo("CUSTOMER"),
  getMyRDsHandler
);

router.post(
  "/:rdId/pay-installment",
  protect,
  restrictTo("CUSTOMER"),
  payInstallmentHandler
);

module.exports = router;