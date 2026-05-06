import { useState, useMemo } from "react";
import { useAvailableSlots } from "../hooks/useCustomer";
import BookingModal from "../components/BookingModal";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Get dates for a given week offset (0 = this week, 1 = next week, etc.)
const getWeekDates = (weekOffset) => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });
};

const BookingCalendar = () => {
  const { data: slots = [], isLoading, isError } = useAvailableSlots();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);

  // Group slots by dayOfWeek for quick lookup
  const slotsByDay = useMemo(() => {
    const map = {};
    slots.forEach((slot) => {
      if (!map[slot.dayOfWeek]) map[slot.dayOfWeek] = [];
      map[slot.dayOfWeek].push(slot);
    });
    return map;
  }, [slots]);

  const handleSlotClick = (slot, date) => {
    const dateStr = date.toISOString().split("T")[0]; // "YYYY-MM-DD"
    setSelectedSlot(slot);
    setSelectedDate(dateStr);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div>
      {/* ── Header ───────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Book an Appointment</h1>
        <p className="text-sm text-gray-500 mt-1">
          Browse available time slots and book your appointment
        </p>
      </div>

      {/* ── Week navigation ──────────────────────── */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <button
          onClick={() => setWeekOffset((w) => w - 1)}
          disabled={weekOffset <= 0}
          className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-40 transition-colors"
        >
          ← Previous Week
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-800">
            {weekDates[0].toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}{" "}
            –{" "}
            {weekDates[6].toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          {weekOffset === 0 && (
            <p className="text-xs text-blue-600 mt-0.5">This week</p>
          )}
        </div>
        <button
          onClick={() => setWeekOffset((w) => w + 1)}
          className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Next Week →
        </button>
      </div>

      {/* ── Calendar grid ────────────────────────── */}
      {isLoading ? (
        <div className="text-center py-16 text-gray-500">
          Loading available slots...
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-red-500">
          Failed to load availability. Please try again.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekDates.map((date, idx) => {
            const daySlots = slotsByDay[date.getDay()] || [];
            const isPast = date < today;

            return (
              <div
                key={idx}
                className={`bg-white rounded-lg shadow-sm border overflow-hidden ${
                  isPast
                    ? "border-gray-100 opacity-50"
                    : "border-gray-200"
                }`}
              >
                {/* Day header */}
                <div
                  className={`px-3 py-2 text-center border-b ${
                    date.toDateString() === new Date().toDateString()
                      ? "bg-blue-600 text-white"
                      : "bg-gray-50 text-gray-700"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase">
                    {DAYS[date.getDay()].slice(0, 3)}
                  </p>
                  <p className="text-lg font-bold">{date.getDate()}</p>
                </div>

                {/* Slots */}
                <div className="p-2 space-y-1.5 min-h-[100px]">
                  {daySlots.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">
                      No slots
                    </p>
                  ) : isPast ? (
                    <p className="text-xs text-gray-400 text-center py-4">
                      Past
                    </p>
                  ) : (
                    daySlots.map((slot) => (
                      <button
                        key={slot._id}
                        onClick={() => handleSlotClick(slot, date)}
                        className="w-full px-2 py-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-md hover:bg-green-100 transition-colors text-left"
                      >
                        <span className="block">
                          {slot.startTime} – {slot.endTime}
                        </span>
                        <span className="block text-[10px] text-green-500 truncate">
                          {slot.businessId?.name}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Booking modal ────────────────────────── */}
      {selectedSlot && (
        <BookingModal
          slot={selectedSlot}
          selectedDate={selectedDate}
          onClose={() => {
            setSelectedSlot(null);
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
};

export default BookingCalendar;
