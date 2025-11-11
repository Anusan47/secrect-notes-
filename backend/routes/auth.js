import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { registerValidator, loginValidator } from "../middleware/validators.js";
import User from "../models/User.js";
import sendMail from "../utils/mailer.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

const COOKIE_NAME = process.env.COOKIE_NAME || "auth_token";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// ✅ Register
router.post("/register", registerValidator, async (req, res) => {
  try {
    const { email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashed });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(201).json({ email: user.email, id: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Login
router.post("/login", loginValidator, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.json({ email: user.email, id: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Logout
router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ message: "Logged out" });
});

// ✅ Forgot Password
router.post("/forgot", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.json({
        message: "If that email exists, a reset link will be sent",
      });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires =
      Date.now() +
      Number(process.env.RESET_TOKEN_EXPIRES_MIN || 60) * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_ORIGIN}/reset/${token}`;
    const html = `<p>Click to reset password: <a href="${resetUrl}">${resetUrl}</a></p>`;

    try {
      await sendMail(user.email, "Password reset", html);
    } catch (mailErr) {
      console.error("Mail error:", mailErr);
    }

    console.log("Password reset link (dev):", resetUrl);
    res.json({
      message: "If that email exists, a reset link will be sent",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Reset Password
router.post("/reset/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 8)
    return res
      .status(400)
      .json({ message: "Password must be 8+ characters long" });

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.cookie(COOKIE_NAME, jwtToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Protected Profile Route
router.get("/profile", verifyToken, async (req, res) => {
  try {
    res.json({
      id: req.user.id,
      email: req.user.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
