import express from "express";
import {
  getMyAvailability,
  createAvailability,
  updateAvailability,
} from "../controllers/availabilityController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require login + admin role
router.use(protect, adminOnly);

router.get("/me", getMyAvailability);
router.post("/", createAvailability);
router.put("/:id", updateAvailability);

export default router;
