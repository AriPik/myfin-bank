const express = require("express");
const router = express.Router();
const {
  getAllCustomersHandler,
  getCustomerByIdHandler,
  activateCustomerHandler,
  rejectCustomerHandler,
  getReportsSummaryHandler,
} = require("../controllers/admin.controller");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.get(
  "/customers/all",
  protect,
  restrictTo("ADMIN"),
  getAllCustomersHandler
);

router.get(
  "/customers/:customerId",
  protect,
  restrictTo("ADMIN"),
  getCustomerByIdHandler
);

router.patch(
  "/customers/:customerId/activate",
  protect,
  restrictTo("ADMIN"),
  activateCustomerHandler
);

router.patch(
  "/customers/:customerId/reject",
  protect,
  restrictTo("ADMIN"),
  rejectCustomerHandler
);

router.get(
  "/reports/summary",
  protect,
  restrictTo("ADMIN"),
  getReportsSummaryHandler
);

module.exports = router;