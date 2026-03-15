const express = require("express");
const router = express.Router();
const {
  login,
  seedSuperAdminHandler,
  seedFirstAdminHandler,
  registerAdminHandler,
  getAllAdminsHandler,
  deactivateAdminHandler,
  activateAdminHandler,
  forgotPasswordAdminHandler,
  resetPasswordAdminHandler,
} = require("../controllers/auth.admin.controller");
const {
  protect,
  restrictToSuperAdmin,
} = require("../middleware/authMiddleware");

// Public routes
router.post("/login", login);
router.post("/forgot-password", forgotPasswordAdminHandler);
router.post("/reset-password", resetPasswordAdminHandler);

// Seed routes (lock before GitHub push!)
router.post("/seed-super-admin", seedSuperAdminHandler);
router.post("/seed-first-admin", seedFirstAdminHandler);

// Super Admin only routes
router.post(
  "/register",
  protect,
  restrictToSuperAdmin,
  registerAdminHandler
);

router.get(
  "/all-admins",
  protect,
  restrictToSuperAdmin,
  getAllAdminsHandler
);

router.patch(
  "/:adminId/deactivate",
  protect,
  restrictToSuperAdmin,
  deactivateAdminHandler
);

router.patch(
  "/:adminId/activate",
  protect,
  restrictToSuperAdmin,
  activateAdminHandler
);

module.exports = router;
