const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgotPasswordHandler,
  resetPasswordHandler,
} = require("../controllers/auth.customer.controller");
const upload = require("../middleware/uploadMiddleware");

router.post(
  "/register",
  upload.single("govIdDocument"),
  register
);
router.post("/login", login);
router.post("/forgot-password", forgotPasswordHandler);
router.post("/reset-password", resetPasswordHandler);

module.exports = router;