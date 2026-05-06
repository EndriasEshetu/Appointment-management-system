import express from "express";
import {
  getBusinessAppointments,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Business admin routes — require login + admin role
router.get("/business", protect, adminOnly, getBusinessAppointments);
router.put("/:id/status", protect, adminOnly, updateAppointmentStatus);

export default router;
