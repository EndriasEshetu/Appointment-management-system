import { useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { useAvailableSlots } from "../hooks/useCustomer";
import BookingModal from "../components/BookingModal";

// Setup the localizer for react-big-calendar
const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const BookingCalendar = () => {
  const { data: slots = [], isLoading, isError } = useAvailableSlots();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Generate calendar events from the recurring weekly availability slots
  const events = useMemo(() => {
    if (!slots || slots.length === 0) return [];

    const generatedEvents = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfCurrentWeek = startOfWeek(today);

    // Generate slots for 4 weeks (28 days) starting from the beginning of the week
    for (let i = 0; i < 28; i++) {
      const date = new Date(startOfCurrentWeek);
      date.setDate(startOfCurrentWeek.getDate() + i);
      const dayOfWeek = date.getDay();

      // Find templates for this day of the week
      const daySlots = slots.filter((slot) => slot.dayOfWeek === dayOfWeek);

      daySlots.forEach((slot) => {
        const [startHour, startMin] = slot.startTime.split(":").map(Number);
        const [endHour, endMin] = slot.endTime.split(":").map(Number);

        const startDate = new Date(date);
        startDate.setHours(startHour, startMin, 0, 0);

        const endDate = new Date(date);
        endDate.setHours(endHour, endMin, 0, 0);

        // Only show future slots
        if (startDate > new Date()) {
          generatedEvents.push({
            title: slot.businessId?.name || "Available",
            start: startDate,
            end: endDate,
            resource: slot, // Keep the original slot reference
          });
        }
      });
    }

    return generatedEvents;
  }, [slots]);

  const handleSelectEvent = (event) => {
    // Prevent booking past slots
    if (event.start < new Date()) {
      alert("This time slot is in the past. Please select a future time slot.");
      return;
    }

    // Fix date mismatch: format local date instead of using toISOString()
    const dateStr = format(event.start, "yyyy-MM-dd");
    setSelectedSlot(event.resource);
    setSelectedDate(dateStr);
  };

  // Custom event styling
  const eventStyleGetter = (event) => {
    const isPast = event.start < new Date();
    return {
      style: {
        backgroundColor: isPast ? "#9CA3AF" : "#10B981", // Gray 400 if past, Emerald 500 if future
        borderColor: isPast ? "#6B7280" : "#059669",
        color: "white",
        borderRadius: "4px",
      },
    };
  };

  return (
    <div className="flex flex-col h-full min-h-[600px]">
      {/* ── Header ───────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Book an Appointment</h1>
        <p className="text-sm text-gray-500 mt-1">
          Browse available time slots on the calendar and click to book.
        </p>
      </div>

      {/* ── Calendar ────────────────────────── */}
      {isLoading ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-lg border border-gray-200">
          Loading available slots...
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-red-500 bg-white rounded-lg border border-gray-200">
          Failed to load availability. Please try again.
        </div>
      ) : (
        <div className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            defaultView="week"
            views={["month", "week", "day"]}
            step={30}
            timeslots={2}
            min={new Date(0, 0, 0, 8, 0, 0)} // Start day at 8 AM
            max={new Date(0, 0, 0, 20, 0, 0)} // End day at 8 PM
          />
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
