import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutCurrentUser,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  updateUserCurrency,
  resetPassword,
  sendOTP,
  verifyOTP,
  setup2FA,
  enable2FA,
  disable2FA,
  verify2FA,
  get2FAStatus,
} from "../controllers/userController.js";

import {
  validateEmailAddress,
  validateUsernameLength,
  validatePasswordLength,
  validateOTP,
} from "../utils/validations.js";

import validate from "../middlewares/validate.js";
import authenticateUser from "../middlewares/authenticateUser.js";

const router = Router();

// Route for user registration,updation and getting profile
router
  .route("/")
  .get(authenticateUser, getCurrentUserProfile)
  .post(
    validate({
      username: validateUsernameLength,
      email: validateEmailAddress,
      password: validatePasswordLength,
    }),
    registerUser
  )
  .put(authenticateUser, updateCurrentUserProfile);

// Route for user login
router.route("/login").post(
  validate({
    email: validateEmailAddress,
    password: validatePasswordLength,
  }),
  loginUser
);

// Route for user logout
router.delete("/logout", logoutCurrentUser);

// Route for user password reset
router.put("/reset-password", authenticateUser, resetPassword);

// Route for updating user currency
router.put("/currency", authenticateUser, updateUserCurrency);

// Route for sending and verifying otp
router.post("/send-otp", validate({ email: validateEmailAddress }), sendOTP);
router.post(
  "/verify-otp",
  validate({ email: validateEmailAddress, otp: validateOTP }),
  verifyOTP
);

// 2FA Routes
router.get("/2fa/status", authenticateUser, get2FAStatus);
router.post("/2fa/setup", authenticateUser, setup2FA);
router.post("/2fa/enable", authenticateUser, enable2FA);
router.post("/2fa/disable", authenticateUser, disable2FA);
router.post("/2fa/verify", verify2FA);

export default router;
