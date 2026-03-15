const express = require("express");
const router = express.Router();
const {
  openFDHandler,
  getMyFDsHandler,
  liquidateFDHandler,
} = require("../controllers/fixedDeposit.controller");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post(
  "/open",
  protect,
  restrictTo("CUSTOMER"),
  openFDHandler
);

router.get(
  "/my-fds",
  protect,
  restrictTo("CUSTOMER"),
  getMyFDsHandler
);

router.post(
  "/:fdId/liquidate",
  protect,
  restrictTo("CUSTOMER"),
  liquidateFDHandler
);

module.exports = router;