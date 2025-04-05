const express = require("express");
const {
  register,
  activateAccount,
  login,
  forgotPassword,
  resetPassword,
  logout,
  getUser,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.get("/me", getUser);
router.post("/logout", logout);
router.get("/activate/:token", activateAccount);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
