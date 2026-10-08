import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

import connectDB from "./config/db.js";
import { seedDatabase } from "./config/seed.js";

import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = Number(process.env.PORT) || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error("PORT must be a valid TCP port.");
}

if (NODE_ENV === "production" && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be configured in production.");
}

// Middleware configuration.
app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);

app.use(cookieParser());

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests such as curl/Postman.
    if (!origin) {
      return callback(null, true);
    }

    if (origin === FRONTEND_URL) {
      return callback(null, true);
    }

    const error = new Error("Origin is not allowed.");
    error.code = "CORS_NOT_ALLOWED";

    return callback(error);
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Serve uploaded files statically.
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"), {
    index: false,
  }),
);

// Health check API.
app.get("/api/health", (req, res) => {
  return res.status(200).json({
    status: "OK",
    message: "Job Portal API is running successfully.",
    environment: NODE_ENV,
  });
});

// Mount API endpoints.
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/application", applicationRoutes);

// API 404 handler.
app.use(notFoundHandler);

// Global error handler.
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    // Seed only development databases.
    if (NODE_ENV !== "production") {
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(
        `Server successfully started on port ${PORT} in ${NODE_ENV} mode`,
      );
    });
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);

    process.exit(1);
  }
};

startServer();
