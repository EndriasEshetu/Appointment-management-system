import Appointment from "../models/Appointment.js";

// @desc    Get all appointments for the logged-in business admin
// @route   GET /api/appointments/business
// @access  Private / Admin
export const getBusinessAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      businessId: req.user._id,
    })
      .populate("customerId", "name email") // populate customer info
      .sort({ date: 1, time: 1 }); // upcoming first

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
