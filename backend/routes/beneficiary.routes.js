const express = require("express");
const router = express.Router();
const {
  addBeneficiaryHandler,
  getMyBeneficiariesHandler,
  getAllBeneficiariesHandler,
  approveBeneficiaryHandler,
  rejectBeneficiaryHandler,
} = require("../controllers/beneficiary.controller");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// Customer routes
router.post(
  "/add",
  protect,
  restrictTo("CUSTOMER"),
  addBeneficiaryHandler
);

router.get(
  "/my-beneficiaries",
  protect,
  restrictTo("CUSTOMER"),
  getMyBeneficiariesHandler
);

// Admin routes
router.get(
  "/all",
  protect,
  restrictTo("ADMIN"),
  getAllBeneficiariesHandler
);

router.patch(
  "/:beneficiaryId/approve",
  protect,
  restrictTo("ADMIN"),
  approveBeneficiaryHandler
);

router.patch(
  "/:beneficiaryId/reject",
  protect,
  restrictTo("ADMIN"),
  rejectBeneficiaryHandler
);

module.exports = router;