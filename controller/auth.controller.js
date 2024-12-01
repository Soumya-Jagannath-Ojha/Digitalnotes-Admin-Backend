import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "../models/admin.model.js";
import { sendPasswordResetEmail } from "../lib/email.js";
import environment from "../SecureCode.js";

export const resetpasswordemail = async (req, res) => {
  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const hashedVerificationCode = await bcrypt.hash(verificationCode.toString(), 10);

    const emailresult = await sendPasswordResetEmail(verificationCode);

    res.cookie("verificationCode", hashedVerificationCode, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      secure: true,
      sameSite: "strict",
    });
    res.status(200).json({ message: "Code send successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const emailcodeverify = async (req, res) => {
  try {
    const { code } = req.body;
    const hashedCookieCode = req.cookies["verificationCode"];

    if (!hashedCookieCode) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    const isValid = await bcrypt.compare(code.toString(), hashedCookieCode);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    res.clearCookie("verificationCode");
    res
      .status(200)
      .json({ message: "Verification code verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetpassword = async (req, res) => {
  try {
    const { password, cpassword } = req.body;

    // Validate password exists
    if (!password || !cpassword) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (password !== cpassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const admin_email = environment.email.user;
    const admin = await Admin.findOne({ email: admin_email });

    // Check if admin exists
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin in database
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ email: admin.email }, environment.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("diginote-admin", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("diginote-admin");
  res.status(200).json({ message: "Logout successful" });
};

export const verify = async (req, res) => {
  try {
    const token = req.cookies["diginote-admin"];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, environment.JWT_SECRET);

    // Verify admin exists in database
    const admin = await Admin.findOne({ email: decoded.email });
    if (admin) {
      return res.status(200).json({ valid: true });
    }

    res.status(401).json({ message: "Invalid token" });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
