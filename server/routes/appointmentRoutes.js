import express from "express";
import {
  getBusinessAppointments,
  updateAppointmentStatus,
  createAppointment,
  getMyAppointments,
  rescheduleAppointment,
  cancelAppointment,
} from "../controllers/appointmentController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ── Customer routes ─────────────────────────────────
router.post("/", protect, createAppointment);
router.get("/me", protect, getMyAppointments);
router.put("/:id/reschedule", protect, rescheduleAppointment);
router.put("/:id/cancel", protect, cancelAppointment);

// ── Business admin routes ───────────────────────────
router.get("/business", protect, adminOnly, getBusinessAppointments);
router.put("/:id/status", protect, adminOnly, updateAppointmentStatus);

export default router;
