import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import { sendReminderEmail } from "../services/emailService.js";

// @desc    Get all appointments for the logged-in business admin
// @route   GET /api/appointments/business
// @access  Private / Admin
export const getBusinessAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      businessId: req.user._id,
    })
      .populate("customerId", "name email") // populate customer info
      .sort({ appointmentDateTime: 1 }); // upcoming first

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update the status of an appointment
// @route   PUT /api/appointments/:id/status
// @access  Private / Admin
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["pending", "confirmed", "paid", "cancelled"];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Make sure this appointment belongs to the logged-in business
    if (appointment.businessId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this appointment" });
    }

    appointment.status = status;
    const updated = await appointment.save();

    // Re-populate customer info before sending back
    await updated.populate("customerId", "name email");

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ════════════════════════════════════════════════════════════
//  CUSTOMER CONTROLLERS
// ════════════════════════════════════════════════════════════

// @desc    Create a new appointment (customer books a slot)
// @route   POST /api/appointments
// @access  Private (customer)
export const createAppointment = async (req, res) => {
  try {
    const { businessId, appointmentDateTime, notes } = req.body;

    if (!businessId || !appointmentDateTime) {
      return res
        .status(400)
        .json({ message: "businessId and appointmentDateTime are required" });
    }

    const parsedDateTime = new Date(appointmentDateTime);
    if (isNaN(parsedDateTime.getTime())) {
      return res.status(400).json({ message: "Invalid appointmentDateTime" });
    }

    // Prevent double-booking: check if same business already has
    // an appointment at the exact same DateTime that is NOT cancelled
    const conflict = await Appointment.findOne({
      businessId,
      appointmentDateTime: parsedDateTime,
      status: { $ne: "cancelled" },
    });

    if (conflict) {
      return res
        .status(409)
        .json({ message: "This time slot is already booked" });
    }

    const appointment = await Appointment.create({
      customerId: req.user._id,
      businessId,
      appointmentDateTime: parsedDateTime,
      status: "pending",
      notes: notes || "",
    });

    await appointment.populate("businessId", "name email");

    res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all appointments for logged-in customer
// @route   GET /api/appointments/me
// @access  Private (customer)
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      customerId: req.user._id,
    })
      .populate("businessId", "name email")
      .sort({ appointmentDateTime: 1 });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Reschedule an appointment (change date/time)
// @route   PUT /api/appointments/:id/reschedule
// @access  Private (customer, owner only)
export const rescheduleAppointment = async (req, res) => {
  try {
    const { appointmentDateTime } = req.body;

    if (!appointmentDateTime) {
      return res
        .status(400)
        .json({ message: "New appointmentDateTime is required" });
    }

    const parsedDateTime = new Date(appointmentDateTime);
    if (isNaN(parsedDateTime.getTime())) {
      return res.status(400).json({ message: "Invalid appointmentDateTime" });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Only the customer who owns it can reschedule
    if (appointment.customerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to reschedule this appointment" });
    }

    // Cannot reschedule a cancelled appointment
    if (appointment.status === "cancelled") {
      return res
        .status(400)
        .json({ message: "Cannot reschedule a cancelled appointment" });
    }

    // Check for conflicts at the new time
    const conflict = await Appointment.findOne({
      businessId: appointment.businessId,
      appointmentDateTime: parsedDateTime,
      status: { $ne: "cancelled" },
      _id: { $ne: appointment._id },
    });

    if (conflict) {
      return res
        .status(409)
        .json({ message: "The new time slot is already booked" });
    }

    appointment.appointmentDateTime = parsedDateTime;
    appointment.status = "pending"; // reset to pending after reschedule
    appointment.reminderSent = false; // reset so a new reminder is sent for the new time
    const updated = await appointment.save();

    await updated.populate("businessId", "name email");
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Cancel an appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private (customer, owner only)
export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.customerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this appointment" });
    }

    if (appointment.status === "cancelled") {
      return res
        .status(400)
        .json({ message: "Appointment is already cancelled" });
    }

    appointment.status = "cancelled";
    const updated = await appointment.save();

    await updated.populate("businessId", "name email");
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
