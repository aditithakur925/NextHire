import express from "express";

import protect from "../middleware/protect.js";

import {
  createProfile,
  getProfile,
} from "../controllers/candidate.controller.js";

const router = express.Router();

router.post("/profile", protect, createProfile);

router.get("/profile", protect, getProfile);

export default router;