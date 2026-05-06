import mongoose from "mongoose";
import dotenv from "dotenv";
import Appointment from "./models/Appointment.js";

dotenv.config();

/**
 * Migration Script: Combine old `date` and `time` into a single `appointmentDateTime`
 * Run this script ONCE using: node migrateAppointments.js
 */
const migrate = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected successfully.");

    // Find all appointments that still have the old 'date' and 'time' fields
    // but don't have the new 'appointmentDateTime' field yet
    const appointments = await Appointment.find({
      date: { $exists: true },
      time: { $exists: true },
      appointmentDateTime: { $exists: false }
    });

    console.log(`Found ${appointments.length} appointments to migrate.`);

    let successCount = 0;

    for (const appt of appointments) {
      // Create a new Date object from the old fields
      // `appt.date` is a Date object, `appt.time` is a "HH:mm" string
      const dateString = appt.date.toISOString().split('T')[0]; // Extract YYYY-MM-DD
      const dateTimeString = `${dateString}T${appt.time}:00`;
      
      const newDateTime = new Date(dateTimeString);

      // Set the new field
      appt.appointmentDateTime = newDateTime;

      // We explicitly bypass validation and save to avoid conflicts if needed,
      // but standard save is fine since the schema has been updated.
      await appt.save();
      successCount++;
    }

    console.log(`Successfully migrated ${successCount} appointments.`);

    // Optional: If you want to delete the old fields from the documents entirely:
    // await Appointment.updateMany({}, { $unset: { date: "", time: "" } });
    // console.log("Removed old date and time fields from all records.");

  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    mongoose.disconnect();
    console.log("Disconnected from MongoDB. Exiting.");
    process.exit(0);
  }
};

migrate();
