import Availability from "../models/Availability.js";

// Helper: validate "HH:mm" format and that end > start
const isValidTimeRange = (startTime, endTime) => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) return false;
  return startTime < endTime; // string comparison works for "HH:mm"
};

// @desc    Get all availability slots for the logged-in business admin
// @route   GET /api/availability/me
// @access  Private / Admin
export const getMyAvailability = async (req, res) => {
  try {
    const slots = await Availability.find({ businessId: req.user._id }).sort({
      dayOfWeek: 1,
      startTime: 1,
    });
    res.json(slots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a new availability slot
// @route   POST /api/availability
// @access  Private / Admin
export const createAvailability = async (req, res) => {
  try {
    const { dayOfWeek, startTime, endTime, isAvailable } = req.body;

    // --- validation ---
    if (dayOfWeek === undefined || !startTime || !endTime) {
      return res
        .status(400)
        .json({ message: "dayOfWeek, startTime and endTime are required" });
    }

    if (dayOfWeek < 0 || dayOfWeek > 6) {
      return res
        .status(400)
        .json({ message: "dayOfWeek must be between 0 (Sun) and 6 (Sat)" });
    }

    if (!isValidTimeRange(startTime, endTime)) {
      return res.status(400).json({
        message:
          "Invalid time range. Use HH:mm format and endTime must be after startTime",
      });
    }

    const slot = await Availability.create({
      businessId: req.user._id,
      dayOfWeek,
      startTime,
      endTime,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
    });

    res.status(201).json(slot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update an availability slot
// @route   PUT /api/availability/:id
// @access  Private / Admin
export const updateAvailability = async (req, res) => {
  try {
    const slot = await Availability.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: "Availability slot not found" });
    }

    // Make sure the slot belongs to this business admin
    if (slot.businessId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this slot" });
    }

    const { dayOfWeek, startTime, endTime, isAvailable } = req.body;

    // If times are being changed, validate them
    const newStart = startTime || slot.startTime;
    const newEnd = endTime || slot.endTime;

    if (!isValidTimeRange(newStart, newEnd)) {
      return res.status(400).json({
        message:
          "Invalid time range. Use HH:mm format and endTime must be after startTime",
      });
    }

    slot.dayOfWeek = dayOfWeek !== undefined ? dayOfWeek : slot.dayOfWeek;
    slot.startTime = newStart;
    slot.endTime = newEnd;
    slot.isAvailable = isAvailable !== undefined ? isAvailable : slot.isAvailable;

    const updated = await slot.save();
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all available slots (for customers to browse)
// @route   GET /api/availability
// @access  Private (any authenticated user)
export const getPublicAvailability = async (req, res) => {
  try {
    const slots = await Availability.find({ isAvailable: true })
      .populate("businessId", "name email")
      .sort({ dayOfWeek: 1, startTime: 1 });

    res.json(slots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
