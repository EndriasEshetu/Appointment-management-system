import { useState } from "react";
import { useBookAppointment } from "../hooks/useCustomer";

const BookingModal = ({ slot, selectedDate, onClose }) => {
  const [notes, setNotes] = useState("");
  const bookMutation = useBookAppointment();

  const handleBook = () => {
    // Combine date and time into a single Date object
    const dateTimeString = `${selectedDate}T${slot.startTime}:00`;
    const appointmentDateTime = new Date(dateTimeString);

    bookMutation.mutate(
      {
        businessId: slot.businessId._id,
        appointmentDateTime,
        notes,
      },
      {
        onSuccess: () => {
          // Close after a brief delay so user sees the success state
          setTimeout(onClose, 1200);
        },
      }
    );
  };

  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-blue-600">
          <h2 className="text-lg font-bold text-white">Book Appointment</h2>
        </div>

        <div className="p-6 space-y-4">
          {/* Success message */}
          {bookMutation.isSuccess && (
            <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg">
              ✅ Appointment booked successfully!
            </div>
          )}

          {/* Error message */}
          {bookMutation.isError && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
              {bookMutation.error.response?.data?.message || "Booking failed"}
            </div>
          )}

          {/* Appointment summary */}
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Business</span>
              <span className="font-medium text-gray-800">
                {slot.businessId?.name || "Unknown"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Day</span>
              <span className="font-medium text-gray-800">
                {DAYS[slot.dayOfWeek]}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Date</span>
              <span className="font-medium text-gray-800">{selectedDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Time</span>
              <span className="font-medium text-gray-800">
                {slot.startTime} – {slot.endTime}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Any special requests..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleBook}
              disabled={bookMutation.isPending || bookMutation.isSuccess}
              className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {bookMutation.isPending ? "Booking..." : "Confirm Booking"}
            </button>
            <button
              onClick={onClose}
              disabled={bookMutation.isPending}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
