import express from "express";
import {
  getMyAvailability,
  createAvailability,
  updateAvailability,
  getPublicAvailability,
} from "../controllers/availabilityController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route — any authenticated user can see available slots
router.get("/", protect, getPublicAvailability);

// Admin-only routes below
router.get("/me", protect, adminOnly, getMyAvailability);
router.post("/", protect, adminOnly, createAvailability);
router.put("/:id", protect, adminOnly, updateAvailability);

export default router;
