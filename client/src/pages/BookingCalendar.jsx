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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("week");

  // Generate calendar events from the recurring weekly availability slots
  // We generate 60 days of slots around the currently viewed date
  const events = useMemo(() => {
    if (!slots || slots.length === 0) return [];

    const generatedEvents = [];
    const windowStart = new Date(currentDate);
    windowStart.setDate(windowStart.getDate() - 30); // 30 days before current view
    windowStart.setHours(0, 0, 0, 0);

    // Generate slots for 90 days total around the current view
    for (let i = 0; i < 90; i++) {
      const date = new Date(windowStart);
      date.setDate(windowStart.getDate() + i);
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
  }, [slots, currentDate]);

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleView = (newView) => {
    setCurrentView(newView);
  };

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
    
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-wide">Book an Appointment</h1>
        <p className="text-sm text-gray-400 mt-1">
          Browse available time slots on the calendar and click to book.
        </p>
      </div>

  
      {isLoading ? (
        <div className="text-center py-16 text-gray-400 bg-[#1f2937] rounded-xl border border-gray-800 shadow-xl">
          Loading available slots...
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-red-400 bg-[#1f2937] rounded-xl border border-gray-800 shadow-xl">
          Failed to load availability. Please try again.
        </div>
      ) : (
        <div className="flex-1 bg-[#1f2937] p-4 rounded-xl shadow-xl border border-gray-800 text-gray-200 [&_.rbc-calendar]:text-gray-200 [&_.rbc-btn-group>button]:text-gray-300 [&_.rbc-btn-group>button]:border-gray-700 [&_.rbc-btn-group>button:hover]:bg-gray-800 [&_.rbc-btn-group>.rbc-active]:bg-[#111827] [&_.rbc-btn-group>.rbc-active]:text-white [&_.rbc-toolbar-label]:font-semibold [&_.rbc-toolbar-label]:text-white [&_.rbc-header]:border-gray-700 [&_.rbc-header]:py-2 [&_.rbc-month-view]:border-gray-700 [&_.rbc-month-row]:border-gray-700 [&_.rbc-day-bg]:border-gray-700 [&_.rbc-off-range-bg]:bg-[#111827] [&_.rbc-today]:bg-blue-900/10 [&_.rbc-time-view]:border-gray-700 [&_.rbc-timeslot-group]:border-gray-700 [&_.rbc-time-content]:border-gray-700 [&_.rbc-time-header-content]:border-gray-700 [&_.rbc-day-slot_.rbc-time-slot]:border-gray-700/50">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            date={currentDate}
            onNavigate={handleNavigate}
            view={currentView}
            onView={handleView}
            views={["month", "week", "day"]}
            step={30}
            timeslots={2}
            min={new Date(0, 0, 0, 8, 0, 0)} 
            max={new Date(0, 0, 0, 20, 0, 0)}
          />
        </div>
      )}
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
