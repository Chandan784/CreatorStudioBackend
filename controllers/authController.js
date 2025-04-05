const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendMail");

exports.register = async (req, res) => {
  try {
    const { email, password, role, name, phoneNumber } = req.body;

    if (!email || !password || !role || !name || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const activationToken = jwt.sign(
      { name, email, password: hashedPassword, role, phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const activationLink = `${process.env.CLIENT_URL}/verify/${activationToken}`;
    await sendEmail(
      email,
      "Activate Your Account",
      `Click here to activate: ${activationLink}`
    );

    res
      .status(201)
      .json({ message: "Check your email for the activation link." });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ✅ Activate Account & Create Session
exports.activateAccount = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await User.findOne({ email: decoded.email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      name: decoded.name,
      email: decoded.email,
      password: decoded.password,
      role: decoded.role,
      phoneNumber: decoded.phoneNumber,
    });

    await user.save();

    // ✅ Create session
    req.session.userId = user._id;
    req.session.userRole = user.role;
    req.session.save();

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

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json({ message: "Invalid credentials" });
    }

    // ✅ Create session for authenticated user
    req.session.userId = user._id;
    req.session.userRole = user.role;
    req.session.save(); // Save session

    res.json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
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
      return res.status(200).json({ message: "New password is required" });
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
      return res.status(200).json({ message: "Invalid or expired token" });
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

exports.getUser = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(req.session.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "Logged out successfully" });
  });
};
