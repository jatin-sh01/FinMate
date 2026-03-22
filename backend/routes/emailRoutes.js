import express from "express";
import {
  triggerMonthlySummary,
  testEmail,
} from "../controllers/emailController.js";
import authenticateUser from "../middlewares/authenticateUser.js";

const router = express.Router();
const allowTestEndpoints =
  process.env.NODE_ENV !== "production" ||
  process.env.ENABLE_TEST_EMAIL_ENDPOINTS === "true";

const blockInProduction = (req, res, next) => {
  if (!allowTestEndpoints) {
    return res.status(403).json({
      error: "This endpoint is disabled in production.",
    });
  }
  next();
};

// Test email endpoint
router.post("/test-email", authenticateUser, blockInProduction, testEmail);

// Trigger monthly summary (admin only - you might want to add admin middleware)
router.post(
  "/trigger-monthly-summary",
  authenticateUser,
  blockInProduction,
  triggerMonthlySummary,
);

export default router;
