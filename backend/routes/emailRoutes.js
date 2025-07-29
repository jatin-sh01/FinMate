import express from "express";
import {
  triggerMonthlySummary,
  testEmail,
} from "../controllers/emailController.js";
import authenticateUser from "../middlewares/authenticateUser.js";

const router = express.Router();

// Test email endpoint
router.post("/test-email", testEmail);

// Trigger monthly summary (admin only - you might want to add admin middleware)
router.post(
  "/trigger-monthly-summary",
  authenticateUser,
  triggerMonthlySummary
);

export default router;
