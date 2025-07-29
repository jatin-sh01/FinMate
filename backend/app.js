import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";

import authenticateUser from "./middlewares/authenticateUser.js";
import { initializeCronJobs } from "./controllers/emailController.js";

// ⚠️ Note: Create your own .env file with required environment variables

// Load environment variables
dotenv.config();

// App Configuration
const PORT = process.env.PORT || 3000;
const app = express();
app.set("trust proxy", 1);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Configuration
const allowedOrigins = [
  "https://fin-mate-lac.vercel.app",
  "http://localhost:8080",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/incomes", authenticateUser, incomeRoutes);
app.use("/api/v1/expenses", authenticateUser, expenseRoutes);
app.use("/api/v1/emails", emailRoutes);

// Start Server
const startServer = async () => {
  try {
    await connectDB();

    // Initialize cron jobs for email notifications
    initializeCronJobs();

    app.listen(PORT, () => {
      console.log(`✅ Server started on PORT ${PORT}`);
      console.log(`📧 Email service initialized with cron jobs`);
    });
  } catch (error) {
    console.error(`❌ Error starting server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
