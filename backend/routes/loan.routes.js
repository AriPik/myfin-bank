const express = require("express");
const router = express.Router();
const {
  applyLoanHandler,
  getMyLoansHandler,
  getAllLoansHandler,
  approveLoanHandler,
  rejectLoanHandler,
  getLoanPaymentsHandler,
  processEMIHandler,
} = require("../controllers/loan.controller");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// Customer routes
router.post(
  "/apply",
  protect,
  restrictTo("CUSTOMER"),
  applyLoanHandler
);

router.get(
  "/my-loans",
  protect,
  restrictTo("CUSTOMER"),
  getMyLoansHandler
);

router.get(
  "/:loanId/payments",
  protect,
  restrictTo("CUSTOMER"),
  getLoanPaymentsHandler
);

// Admin routes
router.get(
  "/all",
  protect,
  restrictTo("ADMIN"),
  getAllLoansHandler
);

router.patch(
  "/:loanId/approve",
  protect,
  restrictTo("ADMIN"),
  approveLoanHandler
);

router.patch(
  "/:loanId/reject",
  protect,
  restrictTo("ADMIN"),
  rejectLoanHandler
);

// EMI processing route (will be called by cron job)
router.post(
  "/:loanId/process-emi",
  protect,
  restrictTo("ADMIN"),
  processEMIHandler
);

module.exports = router;