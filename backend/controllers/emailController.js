import cron from "node-cron";
import User from "../models/userModel.js";
import Income from "../models/incomeModel.js";
import Expense from "../models/expenseModel.js";
import { sendEmail } from "../utils/emailService.js";
import { getCurrencySymbol } from "../utils/currencyFormatter.js";

// Function to calculate monthly summary for a user
const calculateMonthlySummary = async (userId, month, year) => {
  try {
    // Get user details
    const user = await User.findById(userId);
    if (!user) return null;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Get income data for the month
    const incomes = await Income.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    });

    // Get expense data for the month
    const expenses = await Expense.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const balance = totalIncome - totalExpenses;

    // Find highest expense
    const highestExpense =
      expenses.length > 0 ? Math.max(...expenses.map((e) => e.amount)) : 0;

    // Find most used category
    const categoryCount = {};
    expenses.forEach((expense) => {
      categoryCount[expense.category] =
        (categoryCount[expense.category] || 0) + 1;
    });
    const topCategory =
      Object.keys(categoryCount).length > 0
        ? Object.keys(categoryCount).reduce((a, b) =>
            categoryCount[a] > categoryCount[b] ? a : b
          )
        : "None";

    const currencySymbol = getCurrencySymbol(user.currency);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return {
      username: user.username,
      email: user.email,
      month: monthNames[month - 1],
      year,
      totalIncome: totalIncome.toFixed(2),
      totalExpenses: totalExpenses.toFixed(2),
      balance: balance.toFixed(2),
      currencySymbol,
      transactionCount: incomes.length + expenses.length,
      highestExpense: highestExpense.toFixed(2),
      topCategory,
    };
  } catch (error) {
    console.error(
      `Error calculating monthly summary for user ${userId}:`,
      error
    );
    return null;
  }
};

// Function to send monthly summaries to all users
export const sendMonthlySummaries = async () => {
  try {
    console.log("Starting monthly summary email process...");

    const now = new Date();
    const lastMonth = now.getMonth(); // 0-based, so this is actually last month
    const year = lastMonth === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const month = lastMonth === 0 ? 12 : lastMonth;

    // Get all users
    const users = await User.find({ verified: true });
    console.log(`Found ${users.length} verified users`);

    let successCount = 0;
    let errorCount = 0;

    for (const user of users) {
      try {
        const summary = await calculateMonthlySummary(user._id, month, year);

        if (summary && summary.transactionCount > 0) {
          // Only send email if user had transactions
          const emailResult = await sendEmail(
            user.email,
            "monthlySummary",
            summary
          );

          if (emailResult.success) {
            successCount++;
            console.log(`Monthly summary sent to ${user.email}`);
          } else {
            errorCount++;
            console.error(
              `Failed to send monthly summary to ${user.email}:`,
              emailResult.error
            );
          }
        } else {
          console.log(`Skipping ${user.email} - no transactions this month`);
        }

        // Add delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        errorCount++;
        console.error(
          `Error processing monthly summary for ${user.email}:`,
          error
        );
      }
    }

    console.log(
      `Monthly summary process completed. Success: ${successCount}, Errors: ${errorCount}`
    );
  } catch (error) {
    console.error("Error in monthly summary process:", error);
  }
};

// Function to send security alerts
export const sendSecurityAlert = async (userId, alertType, details) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    await sendEmail(user.email, "securityAlert", {
      username: user.username,
      alertType,
      details,
    });

    console.log(`Security alert sent to ${user.email}: ${alertType}`);
  } catch (error) {
    console.error(`Failed to send security alert to user ${userId}:`, error);
  }
};

// Initialize cron jobs
export const initializeCronJobs = () => {
  // Send monthly summaries on the 1st of every month at 9:00 AM
  cron.schedule(
    "0 9 1 * *",
    async () => {
      console.log("Running monthly summary cron job...");
      await sendMonthlySummaries();
    },
    {
      timezone: "Asia/Kolkata",
    }
  );

  console.log("Cron jobs initialized successfully");
};

// Manual trigger for testing (can be called via API endpoint)
export const triggerMonthlySummary = async (req, res) => {
  try {
    await sendMonthlySummaries();
    res.status(200).json({
      message: "Monthly summary process triggered successfully",
    });
  } catch (error) {
    console.error("Error triggering monthly summary:", error);
    res.status(500).json({
      error: "Failed to trigger monthly summary process",
    });
  }
};

// Test email functionality
export const testEmail = async (req, res) => {
  try {
    const { email, type } = req.body;

    if (!email || !type) {
      return res.status(400).json({ error: "Email and type are required" });
    }

    const testData = {
      welcome: { username: "Test User" },
      currencyUpdate: {
        username: "Test User",
        oldCurrency: "USD",
        newCurrency: "INR",
        currencySymbol: "₹",
      },
      twoFactorEnabled: { username: "Test User" },
      passwordReset: { username: "Test User" },
      profileUpdate: {
        username: "Test User",
        updatedFields: ["Email Address", "Username"],
      },
      monthlySummary: {
        username: "Test User",
        month: "December",
        year: 2024,
        totalIncome: "5000.00",
        totalExpenses: "3500.00",
        balance: "1500.00",
        currencySymbol: "₹",
        transactionCount: 25,
        highestExpense: "500.00",
        topCategory: "Food",
      },
      securityAlert: {
        username: "Test User",
        alertType: "Suspicious Login Attempt",
        details:
          "Someone tried to access your account from an unrecognized device.",
      },
    };

    const result = await sendEmail(email, type, testData[type] || {});

    if (result.success) {
      res.status(200).json({
        message: `Test email sent successfully to ${email}`,
        messageId: result.messageId,
      });
    } else {
      res.status(500).json({
        error: "Failed to send test email",
        details: result.error,
      });
    }
  } catch (error) {
    console.error("Error sending test email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  sendMonthlySummaries,
  sendSecurityAlert,
  initializeCronJobs,
  triggerMonthlySummary,
  testEmail,
};
