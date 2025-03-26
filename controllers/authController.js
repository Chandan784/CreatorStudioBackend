const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendMail");

// 🔹 Register User with Activation Email
exports.register = async (req, res) => {
  try {
    const { email, password, role, name, phoneNumber } = req.body; // Add name to the request body

    // ✅ Trim inputs to remove spaces
    if (!email || !password || !role || !name || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Hash the password before saving
    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    // ✅ Generate activation token
    const activationToken = jwt.sign(
      { name, email, password: hashedPassword, role, phoneNumber }, // Include name in the payload
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Send activation email
    const activationLink = `${process.env.CLIENT_URL}/verify/${activationToken}`;
    await sendEmail(
      email,
      "Activate Your Account",
      `Click here to activate your account: ${activationLink}`
    );

    res.status(201).json({
      message: "Check your email for the activation link.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// 🔹 Activate Account (After Email Verification)
exports.activateAccount = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Check if user already exists
    let user = await User.findOne({ email: decoded.email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Create and save the user
    user = new User({
      name: decoded.name, // Add name to the user
      email: decoded.email,
      password: decoded.password, // Already hashed during registration
      role: decoded.role,
      phoneNumber: decoded.phoneNumber,
    });
    await user.save();

    res.json({ message: "Account activated successfully" });
  } catch (error) {
    console.error("Activation error:", error);
    res.status(500).json({ message: "Invalid or expired token" });
  }
};

// 🔹 Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate inputs
    if (!email || !password) {
      return res
        .status(200)
        .json({ message: "Email and password are required" });
    }

    // ✅ Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: "User not found" });
    }

    // ✅ Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json({ message: "Invalid credentials" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "7d" } // Token expiration
    );

    // ✅ Send token in response
    res.json({ success: true, message: "Login successful", token }); // Fix spelling
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server error during login" });
  }
};

// 🔹 Forgot Password - Send Reset Link
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(200).json({ message: "Email is required" });
    }

    // ✅ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: "User not found" });
    }

    // ✅ Generate reset token
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    // ✅ Save reset token in database
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // ✅ Send reset email
    const resetLink = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;
    await sendEmail(
      email,
      "Reset Password",
      `Click here to reset your password: ${resetLink}`
    );

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error during forgot password" });
  }
};

// 🔹 Reset Password - Update in Database
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Find user with reset token and check expiration
    let user = await User.findOne({
      email: decoded.email,
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // ✅ Hash new password and update
    user.password = await bcrypt.hash(newPassword.trim(), 10);
    user.resetToken = "";
    user.resetTokenExpires = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Invalid or expired token" });
  }
};
