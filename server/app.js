import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./src/routes/auth.routes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to NextHire API 🚀",
  });
});

// Auth Routes
app.use("/api/v1/auth", authRoutes);

export default app;