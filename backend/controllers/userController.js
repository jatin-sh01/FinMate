import bcrypt from "bcryptjs";

import User from "../models/userModel.js";
import OTP from "../models/otpModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

import {
  validateEmailAddress,
  validateUsernameLength,
  validatePasswordLength,
} from "../utils/validations.js";
import {
  getLastResendTime,
  updateLastResendTime,
} from "../utils/OTPs/OTPCooldown.js";

import generateHash from "../utils/generateHash.js";
import generateCookie from "../utils/generateCookie.js";
import sendOTPemail from "../utils/OTPs/sendOTPemail.js";
import {
  generateTwoFactorSecret,
  generateQRCode,
  verifyTwoFactorToken,
  generateBackupCodes,
  verifyBackupCode,
} from "../utils/twoFactor.js";
import { currencyConfig, getCurrencyFromCountry } from "../utils/currency.js";
import { sendEmail } from "../utils/emailService.js";

// Controller function to register a new user
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return res
      .status(400)
      .json({ error: "Email is already Registered. Please login instead!" });
  }

  const userNameExists = await User.findOne({ username });
  if (userNameExists) {
    return res.status(400).json({ error: "Username is already taken!" });
  }

  const hashedPassword = await generateHash(password);

  const newUser = new User({ username, email, password: hashedPassword });

  await newUser.save();

  // Send welcome email
  try {
    await sendEmail(email, "welcome", { username });
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send welcome email to ${email}:`, error);
    // Don't fail registration if email fails
  }

  await generateCookie(res, newUser._id);
  res.status(200).json({
    message: "User registered successfully. Please verify your email!",
    user: {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      verified: newUser.verified,
    },
  });
});

// Controller function to log in a user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(404).json({
      error: "Email is not registered. Please register!",
    });
  }

  if (!existingUser.verified) {
    return res.status(401).json({
      user: {
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        verified: existingUser.verified,
      },
      error:
        "Email is not verified. Please verify your email via otp to proceed.",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid user credentials!" });
  }

  // Check if 2FA is enabled
  if (existingUser.twoFactorEnabled) {
    return res.status(200).json({
      message: "Please enter your 2FA code to complete login.",
      requires2FA: true,
      email: existingUser.email,
      user: {
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        verified: existingUser.verified,
        currency: existingUser.currency,
        country: existingUser.country,
        twoFactorEnabled: existingUser.twoFactorEnabled,
      },
    });
  }

  await generateCookie(res, existingUser._id);
  return res.status(200).json({
    message: "Logged In Successfully!",
    user: {
      _id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      verified: existingUser.verified,
      currency: existingUser.currency,
      country: existingUser.country,
      twoFactorEnabled: existingUser.twoFactorEnabled,
    },
  });
});

// Controller function to logout a user
export const logoutCurrentUser = asyncHandler(async (req, res) => {
  // Clear the session cookie safely regardless of presence
  res.clearCookie("session", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None", // Required for cross-site cookies (e.g. Vercel frontend)
  });

  return res.status(200).json({ message: "Logged Out Successfully!" });
});

// Controller function to get current user profile details.
export const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    return res.status(200).json({
      message: "User details retrieved successfully!",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        verified: user.verified,
        currency: user.currency,
        country: user.country,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    });
  } else {
    return res.status(404).json({ error: "User Not Found!" });
  }
});

// Controller function to update the current user's profile
export const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ error: "User not found!" });
  }

  const { username, email } = req.body;

  if (!username && !email) {
    return res.status(400).json({
      error: "At least one field is required for update!",
    });
  }

  if (username === user.username && email === user.email) {
    return res.status(400).json({ error: "No changes detected!" });
  }

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error:
          "Email is already in use. Please choose a different email address!",
      });
    }
  }

  if (username) {
    const error = validateUsernameLength(username);
    if (error) {
      return res.status(400).json({ error: error });
    }
    user.username = username;
  }
  if (email) {
    const error = validateEmailAddress(email);
    if (error) {
      return res.status(400).json({ error: error });
    }
    user.email = email;
  }

  const updatedUser = await user.save();

  // Send profile update email notification
  try {
    const updatedFields = [];
    if (username && username !== user.username) updatedFields.push("Username");
    if (email && email !== user.email) updatedFields.push("Email Address");

    if (updatedFields.length > 0) {
      await sendEmail(updatedUser.email, "profileUpdate", {
        username: updatedUser.username,
        updatedFields,
      });
      console.log(`Profile update email sent to ${updatedUser.email}`);
    }
  } catch (error) {
    console.error(
      `Failed to send profile update email to ${updatedUser.email}:`,
      error
    );
    // Don't fail the update if email fails
  }

  return res.status(200).json({
    message: "Profile updated Successfully!",
    user: {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      verified: updatedUser.verified,
    },
  });
});

// Controller function to update user currency
export const updateUserCurrency = asyncHandler(async (req, res) => {
  console.log("updateUserCurrency called with:", req.body);

  const user = await User.findById(req.user._id);

  if (!user) {
    console.log("User not found:", req.user._id);
    return res.status(404).json({ error: "User not found!" });
  }

  const { currency, country } = req.body;
  console.log("Currency update request:", { currency, country });

  if (!currency) {
    console.log("Currency not provided");
    return res.status(400).json({ error: "Currency is required!" });
  }

  // Validate currency
  if (!currencyConfig[currency]) {
    console.log("Invalid currency:", currency);
    return res.status(400).json({ error: "Invalid currency code!" });
  }

  // Auto-detect currency from country if country is provided
  let finalCurrency = currency;
  if (country && !currency) {
    finalCurrency = getCurrencyFromCountry(country);
  }

  console.log("Setting currency:", finalCurrency, "for user:", user._id);

  const oldCurrency = user.currency || "USD";
  user.currency = finalCurrency;
  if (country) user.country = country;

  const updatedUser = await user.save();
  console.log(
    "User updated successfully:",
    updatedUser._id,
    "currency:",
    updatedUser.currency
  );

  // Send currency update email notification
  try {
    if (oldCurrency !== finalCurrency) {
      const currencySymbol = currencyConfig[finalCurrency]?.symbol || "$";
      await sendEmail(user.email, "currencyUpdate", {
        username: user.username,
        oldCurrency,
        newCurrency: finalCurrency,
        currencySymbol,
      });
      console.log(`Currency update email sent to ${user.email}`);
    }
  } catch (error) {
    console.error(
      `Failed to send currency update email to ${user.email}:`,
      error
    );
    // Don't fail the update if email fails
  }

  return res.status(200).json({
    message: "Currency updated successfully!",
    user: {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      verified: updatedUser.verified,
      currency: updatedUser.currency,
      country: updatedUser.country,
    },
  });
});

// Controller function to update the current user's password
export const resetPassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ error: "User not found!" });
  }

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      error: "Both fields are required for update!",
    });
  }
  const error = await validatePasswordLength(newPassword);
  if (error) {
    return res.status(400).json({ error: error });
  }
  if (oldPassword === newPassword) {
    return res
      .status(400)
      .json({ error: "New password cannot be same as old!" });
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid old password!" });
  }

  await user.updateOne({ password: await generateHash(newPassword) });

  // Send password reset notification email
  try {
    await sendEmail(user.email, "passwordReset", { username: user.username });
    console.log(`Password reset email sent to ${user.email}`);
  } catch (error) {
    console.error(
      `Failed to send password reset email to ${user.email}:`,
      error
    );
    // Don't fail the password reset if email fails
  }

  res.status(200).json({ message: "Password updated successfully!" });
});

// Controller function to send OTP
export const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return res.status(404).json({ error: "Email is not registered!" });
  }

  const userID = existingUser._id;

  const cooldownDuration = 60 * 1000; // 1 minute in milliseconds
  const lastResendTime = await getLastResendTime(userID);

  if (lastResendTime && Date.now() - lastResendTime < cooldownDuration) {
    return res.status(429).json({
      error: "Please wait for atleast 1 minute before requesting another OTP.",
    });
  }

  await OTP.deleteMany({ userID });
  await sendOTPemail({ _id: userID, email }, res);
  await updateLastResendTime(userID);
});

// Controller function to verify OTP
export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return res.status(404).json({ error: "User not found!" });
  }
  if (existingUser.verified) {
    return res.status(400).json({ error: "Email is already verified!" });
  }

  const userID = existingUser._id;

  const otpRecord = await OTP.findOne({ userID }).sort({ expiresAt: -1 });
  if (!otpRecord) {
    return res
      .status(400)
      .json({ error: "No valid OTP found. Please request a new OTP." });
  }

  if (otpRecord.expiresAt && otpRecord.expiresAt < Date.now()) {
    await OTP.deleteMany({ userID });
    return res.status(400).json({ error: "OTP has expired!" });
  }

  const validOTP = await bcrypt.compare(otp, otpRecord.otp);
  if (!validOTP) {
    return res
      .status(400)
      .json({ error: "Invalid OTP. Please check your inbox!" });
  }

  await User.updateOne({ _id: userID }, { verified: true });
  await OTP.deleteMany({ userID });

  const updatedUser = await User.findById(userID);

  res.status(200).json({
    user: {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      verified: updatedUser.verified,
    },
    message: "Email has been verified successfully!",
  });
});

// Setup 2FA - Generate QR code for user
export const setup2FA = asyncHandler(async (req, res) => {
  const userID = req.user._id;
  console.log("Setup 2FA request for user:", userID);

  const user = await User.findById(userID);

  if (!user) {
    return res.status(404).json({ error: "User not found!" });
  }

  if (user.twoFactorEnabled) {
    return res
      .status(400)
      .json({ error: "2FA is already enabled for this account!" });
  }

  console.log("Generating 2FA secret for user:", user.email);

  // Generate secret and QR code
  const { secret, otpauthUrl } = generateTwoFactorSecret(user.email);
  const qrCodeDataURL = await generateQRCode(otpauthUrl);

  // Store the secret temporarily (will be permanently saved when user confirms)
  await User.findByIdAndUpdate(userID, { twoFactorSecret: secret });

  console.log("2FA secret stored for user:", userID);

  res.status(200).json({
    message:
      "2FA setup initiated. Please scan the QR code with your authenticator app.",
    qrCode: qrCodeDataURL,
    secret: secret, // For manual entry if QR scan doesn't work
  });
});

// Enable 2FA - Verify token and enable 2FA
export const enable2FA = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const userID = req.user._id;

  console.log("Enable 2FA request:", {
    token: token ? "provided" : "missing",
    userID,
  });

  if (!token) {
    return res.status(400).json({ error: "2FA token is required!" });
  }

  const user = await User.findById(userID);
  if (!user) {
    return res.status(404).json({ error: "User not found!" });
  }

  console.log("User found:", {
    email: user.email,
    twoFactorSecret: user.twoFactorSecret ? "exists" : "missing",
    twoFactorEnabled: user.twoFactorEnabled,
  });

  if (!user.twoFactorSecret) {
    return res
      .status(400)
      .json({ error: "2FA setup not initiated. Please setup 2FA first!" });
  }

  // Verify the token
  const isValidToken = verifyTwoFactorToken(user.twoFactorSecret, token);
  console.log("Token verification result:", isValidToken);

  if (!isValidToken) {
    return res
      .status(400)
      .json({ error: "Invalid 2FA token. Please try again!" });
  }

  // Generate backup codes
  const backupCodes = generateBackupCodes();

  // Enable 2FA
  await User.findByIdAndUpdate(userID, {
    twoFactorEnabled: true,
    backupCodes: backupCodes,
  });

  // Send 2FA enabled email notification
  try {
    await sendEmail(user.email, "twoFactorEnabled", {
      username: user.username,
    });
    console.log(`2FA enabled email sent to ${user.email}`);
  } catch (error) {
    console.error(`Failed to send 2FA enabled email to ${user.email}:`, error);
    // Don't fail the 2FA enable if email fails
  }

  res.status(200).json({
    message: "2FA has been successfully enabled!",
    backupCodes: backupCodes,
    warning:
      "Please save these backup codes in a safe place. You won't be able to see them again!",
  });
});

// Disable 2FA
export const disable2FA = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const userID = req.user._id;

  if (!token || !password) {
    return res
      .status(400)
      .json({ error: "2FA token and password are required!" });
  }

  const user = await User.findById(userID);
  if (!user) {
    return res.status(404).json({ error: "User not found!" });
  }

  if (!user.twoFactorEnabled) {
    return res
      .status(400)
      .json({ error: "2FA is not enabled for this account!" });
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid password!" });
  }

  // Verify 2FA token
  const isValidToken = verifyTwoFactorToken(user.twoFactorSecret, token);
  if (!isValidToken) {
    return res.status(400).json({ error: "Invalid 2FA token!" });
  }

  // Disable 2FA
  await User.findByIdAndUpdate(userID, {
    twoFactorEnabled: false,
    twoFactorSecret: null,
    backupCodes: [],
  });

  res.status(200).json({
    message: "2FA has been successfully disabled!",
  });
});

// Verify 2FA during login
export const verify2FA = asyncHandler(async (req, res) => {
  const { email, token, isBackupCode } = req.body;

  if (!email || !token) {
    return res.status(400).json({ error: "Email and token are required!" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "User not found!" });
  }

  if (!user.twoFactorEnabled) {
    return res
      .status(400)
      .json({ error: "2FA is not enabled for this account!" });
  }

  let isValid = false;

  if (isBackupCode) {
    // Verify backup code
    const backupCodeIndex = verifyBackupCode(user.backupCodes, token);
    if (backupCodeIndex !== false) {
      // Remove used backup code
      const updatedBackupCodes = [...user.backupCodes];
      updatedBackupCodes.splice(backupCodeIndex, 1);
      await User.findByIdAndUpdate(user._id, {
        backupCodes: updatedBackupCodes,
      });
      isValid = true;
    }
  } else {
    // Verify TOTP token
    isValid = verifyTwoFactorToken(user.twoFactorSecret, token);
  }

  if (!isValid) {
    return res.status(400).json({
      error: isBackupCode ? "Invalid backup code!" : "Invalid 2FA token!",
    });
  }

  // Generate auth cookie
  await generateCookie(res, user._id);

  res.status(200).json({
    message: "2FA verification successful!",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      verified: user.verified,
      twoFactorEnabled: user.twoFactorEnabled,
    },
  });
});

// Get 2FA status
export const get2FAStatus = asyncHandler(async (req, res) => {
  const userID = req.user._id;
  const user = await User.findById(userID);

  if (!user) {
    return res.status(404).json({ error: "User not found!" });
  }

  res.status(200).json({
    twoFactorEnabled: user.twoFactorEnabled,
    hasBackupCodes: user.backupCodes && user.backupCodes.length > 0,
    remainingBackupCodes: user.backupCodes ? user.backupCodes.length : 0,
  });
});
