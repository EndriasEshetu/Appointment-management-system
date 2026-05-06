import { schedules } from "@trigger.dev/sdk/v3";
import Appointment from "../models/Appointment.js";
import { sendReminderEmail } from "../services/emailService.js";
import connectDB from "../config/db.js";

/**
 * Trigger.dev Scheduled Task: Appointment Reminder
 * Runs every hour to find appointments in the next 24 hours
 * and sends an email reminder using Resend.
 */
export const reminderJob = schedules.task({
  id: "appointment-reminder",
  // Run every hour at minute 0 (e.g. 10:00, 11:00, 12:00)
  cron: "0 * * * *",
  
  run: async (payload, { ctx }) => {
    console.log(`Starting reminder job at ${new Date().toISOString()}`);

    // Since Trigger.dev v3 runs tasks in a separate background worker,
    // we need to ensure the database connection is active.
    await connectDB();

    const now = new Date();
    // Calculate timestamp for 24 hours from now
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    try {
      // 1. Query for upcoming appointments
      const appointments = await Appointment.find({
        appointmentDateTime: {
          $gte: now,
          $lte: next24Hours,
        },
        status: { $in: ["confirmed", "paid"] },
        reminderSent: false, // Ensure we don't spam the user
      }).populate("customerId businessId", "name email");

      console.log(`Found ${appointments.length} appointments needing reminders.`);

      let successCount = 0;
      let failCount = 0;

      // 2. Process each matching appointment
      for (const appt of appointments) {
        try {
          await sendReminderEmail({
            to: appt.customerId.email,
            customerName: appt.customerId.name,
            date: new Date(appt.appointmentDateTime).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            time: new Date(appt.appointmentDateTime).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            }),
            businessName: appt.businessId.name,
          });

          // 3. Mark as sent to avoid duplicate emails
          appt.reminderSent = true;
          await appt.save();
          successCount++;
          
        } catch (emailError) {
          console.error(`Failed to send reminder for appointment ${appt._id}`, emailError);
          failCount++;
        }
      }

      console.log(`Reminder job complete. Success: ${successCount}, Failed: ${failCount}`);
      
      return {
        processed: appointments.length,
        success: successCount,
        failed: failCount
      };

    } catch (dbError) {
      console.error("Database query failed during reminder job:", dbError);
      throw dbError; // Throwing tells Trigger.dev the job failed so it can be retried/logged
    }
  },
});
