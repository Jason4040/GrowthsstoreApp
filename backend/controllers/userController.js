import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";
import sendEmail from "../utils/sendEmail.js";
import { getCookieOptions } from "../utils/cookieConfig.js";
import crypto from "crypto";
import { otpEmailHtml } from "../utils/emailTemplates.js";

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the inputs.");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    if (userExists.isVerified) {
      res.status(400);
      throw new Error("User already exists");
    } else {
      await User.deleteOne({ _id: userExists._id });
    }
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const otp = generateOtp();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    isVerified: false,
    otp,
    otpExpires,
  });

  try {
    await newUser.save();
  } catch (error) {
    res.status(400);
    throw new Error("Invalid user data");
  }

  try {
    await sendEmail({
      to: newUser.email,
      subject: "Verify Your Account - Growth Shop OTP",
      html: otpEmailHtml(
        newUser.username,
        otp,
        "Account Verification",
        "Growth Shop OTP Verification"
      ),
    });
  } catch (error) {
    await User.deleteOne({ _id: newUser._id });
    console.error("OTP email sending failed:", error);
    res.status(500);
    throw new Error("Failed to send verification email. Please try again.");
  }

  res.status(201).json({
    message: "Verification OTP code sent to your email.",
    email: newUser.email,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPasswordValid) {
      if (existingUser.isVerified === false) {
        existingUser.isVerified = true;
        await existingUser.save();
      }

      createToken(res, existingUser._id);

      res.status(201).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      });
      return;
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400);
    throw new Error("Please provide email and verification code.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("User already verified.");
  }

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    res.status(400);
    throw new Error("Invalid or expired verification code.");
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  sendEmail({
    to: user.email,
    subject: "Welcome to Growth Shop!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #1a202c;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #dd6b20; font-size: 28px; margin: 0;">Elevate Your Style</h2>
          <p style="font-size: 14px; color: #718096; margin-top: 4px;">Welcome to Growth Shop</p>
        </div>
        <div style="font-size: 16px; line-height: 1.6; margin-bottom: 24px; color: #4a5568;">
          <p>Hello <strong>${user.username}</strong>,</p>
          <p>Thank you for creating and verifying your account with us! We are thrilled to welcome you to our community. Explore our latest products, exclusive offers, and elevate your personal style starting today.</p>
        </div>
        <div style="text-align: center; margin-bottom: 24px;">
          <a href="https://growthsstore.com" style="display: inline-block; background-color: #dd6b20; color: #ffffff; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 6px;">Start Shopping</a>
        </div>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #a0aec0; text-align: center;">
          <p>© ${new Date().getFullYear()} Growth Shop. All rights reserved.</p>
        </div>
      </div>
    `
  }).catch((err) => console.error("Welcome email sending failed:", err));

  createToken(res, user._id);

  res.status(200).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Please provide your email address.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("No registration found for this email.");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("This account is already verified. Please login.");
  }

  const otp = generateOtp();
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Verify Your Account - Growth Shop OTP",
    html: otpEmailHtml(
      user.username,
      otp,
      "Account Verification",
      "Growth Shop OTP Verification"
    ),
  });

  res.status(200).json({
    message: "A new verification code has been sent to your email.",
    email: user.email,
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Please provide your email address.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(200).json({
      message: "If an account exists with this email, a reset code has been sent.",
    });
    return;
  }

  if (!user.isVerified) {
    res.status(400);
    throw new Error("Please verify your email first before resetting your password.");
  }

  const resetOtp = generateOtp();
  user.resetOtp = resetOtp;
  user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Reset Your Password - Growth Shop",
    html: otpEmailHtml(
      user.username,
      resetOtp,
      "Password Reset",
      "Growth Shop Password Reset"
    ),
  });

  res.status(200).json({
    message: "If an account exists with this email, a reset code has been sent.",
    email: user.email,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;

  if (!email || !otp || !password) {
    res.status(400);
    throw new Error("Please provide email, reset code, and new password.");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  if (!user.resetOtp || user.resetOtp !== otp || user.resetOtpExpires < Date.now()) {
    res.status(400);
    throw new Error("Invalid or expired reset code.");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.resetOtp = undefined;
  user.resetOtpExpires = undefined;
  await user.save();

  res.status(200).json({
    message: "Password reset successful. You can now login with your new password.",
  });
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  const cookieOptions = getCookieOptions(req, true);

  res.cookie("jwt", "", cookieOptions);
  res.status(200).json({ message: "Logged out successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }

    await User.deleteOne({ _id: user._id });
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
};
