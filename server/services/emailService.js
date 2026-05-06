import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

// Make sure to add RESEND_API_KEY to your .env file
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends an appointment reminder email using Resend
 * 
 * @param {Object} params
 * @param {string} params.to - Customer email
 * @param {string} params.customerName - Customer name
 * @param {string} params.date - Formatted date of appointment
 * @param {string} params.time - Time of appointment
 * @param {string} params.businessName - Name of the business
 * @returns {Promise<Object>} Resend response
 */
export const sendReminderEmail = async ({
  to,
  customerName,
  date,
  time,
  businessName,
}) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Appointment Management <onboarding@resend.dev>", // Resend default test sender
      to: [to],
      subject: `Appointment Reminder - Upcoming Booking at ${businessName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #1e40af;">Appointment Reminder</h2>
          <p>Hello <strong>${customerName}</strong>,</p>
          <p>This is a friendly reminder that you have an upcoming appointment scheduled for tomorrow.</p>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #334155;">Appointment Details:</h3>
            <ul style="list-style-type: none; padding-left: 0;">
              <li style="margin-bottom: 10px;"><strong>Business:</strong> ${businessName}</li>
              <li style="margin-bottom: 10px;"><strong>Date:</strong> ${date}</li>
              <li style="margin-bottom: 10px;"><strong>Time:</strong> ${time}</li>
              <li style="margin-bottom: 10px;"><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">Confirmed</span></li>
            </ul>
          </div>
          
          <p>If you need to reschedule or cancel, please log in to your account.</p>
          <br/>
          <p>Thanks,<br/><strong>${businessName} Team</strong></p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log(`Reminder email sent successfully to ${to}`);
    return data;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};
