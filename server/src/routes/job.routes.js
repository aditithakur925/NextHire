import express from "express";

import protect from "../middleware/protect.js";

import {
  createJob,
  getAllJobs,
  getSingleJob,
  deleteJob,
} from "../controllers/job.controller.js";

const router = express.Router();

// Public Routes
router.get("/", getAllJobs);
router.get("/:id", getSingleJob);

// Protected Routes
router.post("/", protect, createJob);
router.delete("/:id", protect, deleteJob);

export default router;