import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0, // 0 = Sunday
      max: 6, // 6 = Saturday
    },
    startTime: {
      type: String, // format: "HH:mm" (e.g., "09:00")
      required: true,
    },
    endTime: {
      type: String, // format: "HH:mm" (e.g., "17:00")
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Availability = mongoose.model("Availability", availabilitySchema);

export default Availability;
