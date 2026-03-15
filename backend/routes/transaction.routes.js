const express = require("express");
const router = express.Router();
const {
  depositHandler,
  withdrawHandler,
  transferHandler,
  getPassbookHandler,
} = require("../controllers/transaction.controller");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post(
  "/deposit",
  protect,
  restrictTo("CUSTOMER"),
  depositHandler
);

router.post(
  "/withdraw",
  protect,
  restrictTo("CUSTOMER"),
  withdrawHandler
);

router.post(
  "/transfer",
  protect,
  restrictTo("CUSTOMER"),
  transferHandler
);

router.get(
  "/passbook/:accountNumber",
  protect,
  restrictTo("CUSTOMER"),
  getPassbookHandler
);

module.exports = router;