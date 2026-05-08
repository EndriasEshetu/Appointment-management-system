import { useState, useMemo, useEffect } from "react";
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

  // Handle responsive view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCurrentView("day");
      } else {
        setCurrentView("week");
      }
    };
    handleResize(); // Set initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Generate calendar events from the recurring weekly availability slots
  const events = useMemo(() => {
    if (!slots || slots.length === 0) return [];

    const generatedEvents = [];
    const windowStart = new Date(currentDate);
    windowStart.setDate(windowStart.getDate() - 30);
    windowStart.setHours(0, 0, 0, 0);

    for (let i = 0; i < 90; i++) {
      const date = new Date(windowStart);
      date.setDate(windowStart.getDate() + i);
      const dayOfWeek = date.getDay();

      const daySlots = slots.filter((slot) => slot.dayOfWeek === dayOfWeek);

      daySlots.forEach((slot) => {
        const [startHour, startMin] = slot.startTime.split(":").map(Number);
        const [endHour, endMin] = slot.endTime.split(":").map(Number);

        const startDate = new Date(date);
        startDate.setHours(startHour, startMin, 0, 0);

        const endDate = new Date(date);
        endDate.setHours(endHour, endMin, 0, 0);

        if (startDate > new Date()) {
          generatedEvents.push({
            title: slot.businessId?.name || "Available",
            start: startDate,
            end: endDate,
            resource: slot,
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
    if (event.start < new Date()) {
      alert("This time slot is in the past. Please select a future time slot.");
      return;
    }

    const dateStr = format(event.start, "yyyy-MM-dd");
    setSelectedSlot(event.resource);
    setSelectedDate(dateStr);
  };

  const eventStyleGetter = (event) => {
    const isPast = event.start < new Date();
    return {
      style: {
        backgroundColor: isPast ? "#4B5563" : "#10B981",
        borderColor: isPast ? "#374151" : "#059669",
        color: "white",
        borderRadius: "8px",
        fontSize: "0.85rem",
      },
    };
  };

  return (
    <div className="flex flex-col h-full min-h-[600px]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-wide">
          Book an Appointment
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Browse available time slots and click to book.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-gray-400 bg-[#1f2937] rounded-xl border border-gray-800 shadow-xl">
          Loading available slots...
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-red-400 bg-[#1f2937] rounded-xl border border-gray-800 shadow-xl">
          Failed to load availability.
        </div>
      ) : (
        <div className="flex-1 bg-[#1f2937] p-2 md:p-4 rounded-2xl shadow-2xl border border-gray-800 text-gray-200 
          [&_.rbc-calendar]:text-gray-200 
          [&_.rbc-btn-group>button]:text-white 
          [&_.rbc-btn-group>button]:border-gray-700 
          [&_.rbc-btn-group>button:hover]:bg-gray-700 
          [&_.rbc-btn-group>.rbc-active]:bg-[#10b981] 
          [&_.rbc-btn-group>.rbc-active]:text-white 
          [&_.rbc-toolbar-label]:font-bold 
          [&_.rbc-toolbar-label]:text-white 
          [&_.rbc-toolbar]:flex-col md:[&_.rbc-toolbar]:flex-row [&_.rbc-toolbar]:gap-4
          [&_.rbc-header]:border-gray-700 [&_.rbc-header]:py-3 
          [&_.rbc-month-view]:border-gray-700 [&_.rbc-month-row]:border-gray-700 
          [&_.rbc-day-bg]:border-gray-700 [&_.rbc-off-range-bg]:bg-[#111827] 
          [&_.rbc-today]:bg-emerald-500/10 
          [&_.rbc-time-view]:border-gray-700 [&_.rbc-timeslot-group]:border-gray-700 
          [&_.rbc-time-content]:border-gray-700 [&_.rbc-time-header-content]:border-gray-700 
          [&_.rbc-day-slot_.rbc-time-slot]:border-gray-700/50">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 650 }}
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
            max={new Date(0, 0, 0, 21, 0, 0)}
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

