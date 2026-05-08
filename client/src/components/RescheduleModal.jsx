import { useState } from "react";
import { useRescheduleAppointment } from "../hooks/useCustomer";

const RescheduleModal = ({ appointment, onClose }) => {
  // Parse existing appointmentDateTime
  const existingDate = new Date(appointment.appointmentDateTime);
  
  // Pre-fill with existing values
  const existingDateStr = existingDate.toISOString().split("T")[0];
  const existingTimeStr = existingDate.toTimeString().slice(0, 5);

  const [date, setDate] = useState(existingDateStr);
  const [time, setTime] = useState(existingTimeStr);
  const rescheduleMutation = useRescheduleAppointment();

  const handleReschedule = (e) => {
    e.preventDefault();
    
    // Create Date object from local date and time inputs
    const [year, month, day] = date.split("-").map(Number);
    const [hours, minutes] = time.split(":").map(Number);
    const appointmentDateTime = new Date(year, month - 1, day, hours, minutes);

    if (appointmentDateTime < new Date()) {
      alert("Cannot reschedule to a past date/time.");
      return;
    }

    rescheduleMutation.mutate(
      { id: appointment._id, appointmentDateTime },
      {
        onSuccess: () => {
          setTimeout(onClose, 1200);
        },
      }
    );
  };

  // Get today's date as minimum selectable date
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1f2937] rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="px-6 py-4 bg-[#10b981]">
          <h2 className="text-lg font-bold text-white tracking-wide">
            Reschedule Appointment
          </h2>
        </div>

        <form onSubmit={handleReschedule} className="p-6 space-y-4">
          {/* Success */}
          {rescheduleMutation.isSuccess && (
            <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg">
              ✅ Appointment rescheduled successfully!
            </div>
          )}

          {/* Error */}
          {rescheduleMutation.isError && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
              {rescheduleMutation.error.response?.data?.message ||
                "Reschedule failed"}
            </div>
          )}

          {/* Current info */}
          <div className="bg-[#111827] p-4 rounded-lg border border-gray-800">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-2 tracking-wider">
              Current Appointment
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Business</span>
              <span className="font-medium text-white">
                {appointment.businessId?.name || "Unknown"}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-400">Date & Time</span>
              <span className="font-medium text-white">
                {existingDate.toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          </div>

          {/* New date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              New Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={minDate}
              required
              className="w-full px-3 py-2 bg-[#111827] border border-gray-700 text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] [color-scheme:dark]"
            />
          </div>

          {/* New time */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              New Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#111827] border border-gray-700 text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] [color-scheme:dark]"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={
                rescheduleMutation.isPending || rescheduleMutation.isSuccess
              }
              className="flex-1 px-4 py-2 bg-[#10b981] text-white text-sm font-medium rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition-colors shadow-lg shadow-emerald-900/20"
            >
              {rescheduleMutation.isPending
                ? "Rescheduling..."
                : "Confirm Reschedule"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={rescheduleMutation.isPending}
              className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RescheduleModal;
