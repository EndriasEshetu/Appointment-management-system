import { useState, useMemo } from "react";
import {
  useBusinessAppointments,
  useUpdateAppointmentStatus,
} from "../hooks/useAppointments";
import StatusBadge from "../components/StatusBadge";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { LayoutList, Calendar as CalendarIcon, Download, Search, Filter, Clock } from "lucide-react";

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

const AdminDashboard = () => {
  const { data: appointments = [], isLoading, isError } = useBusinessAppointments();
  const statusMutation = useUpdateAppointmentStatus();

  const [viewMode, setViewMode] = useState("list"); // "list" or "calendar"
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // ── Filtering ─────────────────────────────────
  const filtered = useMemo(() => {
    return appointments.filter((appt) => {
      const matchesStatus =
        filterStatus === "all" || appt.status === filterStatus;
      const customerName = appt.customerId?.name || "";
      const matchesSearch = customerName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [appointments, filterStatus, searchQuery]);

  // ── Calendar Events ───────────────────────────
  const events = useMemo(() => {
    return appointments.map((appt) => ({
      id: appt._id,
      title: `${appt.customerId?.name || "Unknown"} (${appt.status})`,
      start: new Date(appt.appointmentDateTime),
      end: new Date(new Date(appt.appointmentDateTime).getTime() + 60 * 60 * 1000), // 1 hour duration
      resource: appt,
    }));
  }, [appointments]);

  // ── Status update handler ─────────────────────
  const handleStatusChange = (id, status) => {
    statusMutation.mutate({ id, status });
  };

  const handleExport = () => {
    alert("Exporting report as CSV... (Mock functionality)");
  };

  // ── Format helpers ────────────────────────────
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const eventStyleGetter = (event) => {
    const status = event.resource.status;
    const colors = {
      pending: "#EAB308", // Yellow 500
      confirmed: "#3B82F6", // Blue 500
      paid: "#10B981", // Emerald 500
      cancelled: "#EF4444", // Red 500
    };
    return {
      style: {
        backgroundColor: colors[status] || "#6B7280",
        borderRadius: "4px",
        fontSize: "0.75rem",
        border: "none",
      },
    };
  };

  return (
    <div className="space-y-6">
      {/* ── Header ───────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Business Report & Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Analyze your appointments and manage future bookings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium rounded-lg border border-gray-700 transition-colors"
          >
            <Download size={16} />
            Export Report
          </button>
          <div className="flex bg-[#1f2937] p-1 rounded-lg border border-gray-700">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "list" ? "bg-[#10b981] text-white shadow-lg" : "text-gray-400 hover:text-gray-200"
              }`}
              title="List View"
            >
              <LayoutList size={18} />
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "calendar" ? "bg-[#10b981] text-white shadow-lg" : "text-gray-400 hover:text-gray-200"
              }`}
              title="Calendar View"
            >
              <CalendarIcon size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats Summary ────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {["pending", "confirmed", "paid", "cancelled"].map((status) => {
          const count = appointments.filter((a) => a.status === status).length;
          const colors = {
            pending: "border-yellow-500 bg-yellow-900/20 text-yellow-500",
            confirmed: "border-blue-500 bg-blue-900/20 text-blue-400",
            paid: "border-[#10b981] bg-[#10b981]/20 text-[#10b981]",
            cancelled: "border-red-500 bg-red-900/20 text-red-400",
          };
          return (
            <div
              key={status}
              className={`p-4 rounded-xl border-t-4 shadow-xl ${colors[status]}`}
            >
              <p className="text-xs uppercase tracking-wider font-semibold opacity-70 mb-1">{status}</p>
              <p className="text-3xl font-bold">{count}</p>
            </div>
          );
        })}
      </div>

      {/* ── Content ──────────────────────────────── */}
      {isLoading ? (
        <div className="text-center py-20 text-gray-400 bg-[#1f2937] rounded-xl border border-gray-800">
          Loading report data...
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-red-400 bg-[#1f2937] rounded-xl border border-gray-800">
          Failed to load dashboard.
        </div>
      ) : (
        <div className="space-y-4">
          {viewMode === "list" ? (
            <>
              {/* Filters for List View */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    placeholder="Search by customer name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#1f2937] border border-gray-700 text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981]"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="pl-10 pr-8 py-2 bg-[#1f2937] border border-gray-700 text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] appearance-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Responsive List/Table */}
              <div className="bg-[#1f2937] rounded-xl shadow-xl border border-gray-800 overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-[#111827] border-b border-gray-800">
                        <th className="px-6 py-4 font-semibold text-gray-300">Customer</th>
                        <th className="px-6 py-4 font-semibold text-gray-300">DateTime</th>
                        <th className="px-6 py-4 font-semibold text-gray-300">Status</th>
                        <th className="px-6 py-4 text-right font-semibold text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                            No appointments found.
                          </td>
                        </tr>
                      ) : (
                        filtered.map((appt) => (
                          <tr key={appt._id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-medium text-white">{appt.customerId?.name || "Unknown"}</p>
                              <p className="text-xs text-gray-500">{appt.customerId?.email}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-gray-300">{formatDate(appt.appointmentDateTime)}</p>
                              <p className="text-xs text-gray-500">{formatTime(appt.appointmentDateTime)}</p>
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge status={appt.status} />
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                {appt.status === "pending" && (
                                  <button
                                    onClick={() => handleStatusChange(appt._id, "confirmed")}
                                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                                  >
                                    Confirm
                                  </button>
                                )}
                                {appt.status !== "paid" && appt.status !== "cancelled" && (
                                  <button
                                    onClick={() => handleStatusChange(appt._id, "paid")}
                                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                                  >
                                    Mark Paid
                                  </button>
                                )}
                                {appt.status !== "cancelled" && (
                                  <button
                                    onClick={() => handleStatusChange(appt._id, "cancelled")}
                                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile/Tablet Card View */}
                <div className="lg:hidden divide-y divide-gray-800">
                  {filtered.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No appointments found.</div>
                  ) : (
                    filtered.map((appt) => (
                      <div key={appt._id} className="p-4 space-y-4 hover:bg-white/5 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-white">{appt.customerId?.name || "Unknown"}</p>
                            <p className="text-xs text-gray-500">{appt.customerId?.email}</p>
                          </div>
                          <StatusBadge status={appt.status} />
                        </div>
                        <div className="flex gap-4 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <CalendarIcon size={12} />
                            {formatDate(appt.appointmentDateTime)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={12} />
                            {formatTime(appt.appointmentDateTime)}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-800">
                          {appt.status === "pending" && (
                            <button
                              onClick={() => handleStatusChange(appt._id, "confirmed")}
                              className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            >
                              Confirm
                            </button>
                          )}
                          {appt.status !== "paid" && appt.status !== "cancelled" && (
                            <button
                              onClick={() => handleStatusChange(appt._id, "paid")}
                              className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            >
                              Mark Paid
                            </button>
                          )}
                          {appt.status !== "cancelled" && (
                            <button
                              onClick={() => handleStatusChange(appt._id, "cancelled")}
                              className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-red-500/10 text-red-400 border border-red-500/20"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </>
          ) : (
            /* Calendar View */
            <div className="bg-[#1f2937] p-4 rounded-xl shadow-xl border border-gray-800 text-gray-200 [&_.rbc-calendar]:text-gray-200 [&_.rbc-btn-group>button]:text-gray-400 [&_.rbc-btn-group>button]:border-gray-700 [&_.rbc-btn-group>button:hover]:bg-gray-800 [&_.rbc-btn-group>.rbc-active]:bg-[#10b981] [&_.rbc-btn-group>.rbc-active]:text-white [&_.rbc-toolbar-label]:font-semibold [&_.rbc-toolbar-label]:text-white [&_.rbc-header]:border-gray-700 [&_.rbc-header]:py-2 [&_.rbc-month-view]:border-gray-700 [&_.rbc-month-row]:border-gray-700 [&_.rbc-day-bg]:border-gray-700 [&_.rbc-off-range-bg]:bg-[#111827] [&_.rbc-today]:bg-blue-900/10 [&_.rbc-time-view]:border-gray-700 [&_.rbc-timeslot-group]:border-gray-700 [&_.rbc-time-content]:border-gray-700 [&_.rbc-time-header-content]:border-gray-700 [&_.rbc-day-slot_.rbc-time-slot]:border-gray-700/50">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                eventPropGetter={eventStyleGetter}
                views={["month", "week", "day"]}
                defaultView="month"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

