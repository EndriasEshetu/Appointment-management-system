import { useState } from "react";
import { useRescheduleAppointment } from "../hooks/useCustomer";

const RescheduleModal = ({ appointment, onClose }) => {
  // Parse existing appointmentDateTime
  const existingDate = new Date(appointment.appointmentDateTime);
  
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const rescheduleMutation = useRescheduleAppointment();

  const handleReschedule = (e) => {
    e.preventDefault();
    
    // Combine date and time
    const dateTimeString = `${date}T${time}:00`;
    const appointmentDateTime = new Date(dateTimeString);

    rescheduleMutation.mutate(
      { id: appointment._id, appointmentDateTime },
      {
        onSuccess: () => {
          setTimeout(onClose, 1200);
        },
      }
    );
  };

  // Get tomorrow's date as minimum selectable date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-indigo-600">
          <h2 className="text-lg font-bold text-white">
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
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs text-gray-400 uppercase font-semibold mb-2">
              Current Appointment
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Business</span>
              <span className="font-medium text-gray-800">
                {appointment.businessId?.name || "Unknown"}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-500">Date & Time</span>
              <span className="font-medium text-gray-800">
                {existingDate.toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          </div>

          {/* New date */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              New Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={minDate}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* New time */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              New Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={
                rescheduleMutation.isPending || rescheduleMutation.isSuccess
              }
              className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {rescheduleMutation.isPending
                ? "Rescheduling..."
                : "Confirm Reschedule"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={rescheduleMutation.isPending}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
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
