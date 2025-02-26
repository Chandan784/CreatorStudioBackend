const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendMail");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const activationLink = `${process.env.CLIENT_URL}/verify/${token}`;
    await sendEmail(
      email,
      "Activate Your Account",
      `Click here to activate: ${activationLink}`
    );

    await user.save();
    res.status(201).json({
      message: "Registration successful! Check your email to activate.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.activateAccount = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findOne({ email: decoded.email });
    if (!user)
      return res.status(400).json({ message: "Invalid activation link" });

    user.isActive = true;
    await user.save();
    res.json({ message: "Account activated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Invalid or expired token" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (!user.isActive)
      return res.status(400).json({ message: "Activate your account first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendEmail(
      email,
      "Reset Password",
      `Click here to reset password: ${resetLink}`
    );

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findOne({ email: decoded.email });
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = "";
    user.resetTokenExpires = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Invalid or expired token" });
  }
};
