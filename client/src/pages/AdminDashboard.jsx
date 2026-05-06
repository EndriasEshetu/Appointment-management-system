import { useState } from "react";
import {
  useBusinessAppointments,
  useUpdateAppointmentStatus,
} from "../hooks/useAppointments";
import StatusBadge from "../components/StatusBadge";

const AdminDashboard = () => {
  const { data: appointments = [], isLoading, isError } = useBusinessAppointments();
  const statusMutation = useUpdateAppointmentStatus();

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // ── Filtering ─────────────────────────────────
  const filtered = appointments.filter((appt) => {
    const matchesStatus =
      filterStatus === "all" || appt.status === filterStatus;
    const customerName = appt.customerId?.name || "";
    const matchesSearch = customerName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // ── Status update handler ─────────────────────
  const handleStatusChange = (id, status) => {
    statusMutation.mutate({ id, status });
  };

  // ── Format date for display ───────────────────
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

  return (
    <div>
      {/* ── Header ───────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-wide">
          Appointment Dashboard
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage and track all your customer appointments
        </p>
      </div>

      {/* ── Stats cards ──────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
              className={`p-4 rounded-xl border-l-4 ${colors[status]}`}
            >
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-sm capitalize opacity-80">{status}</p>
            </div>
          );
        })}
      </div>

      {/* ── Filters ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by customer name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 bg-[#1f2937] border border-gray-700 text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981]"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-[#1f2937] border border-gray-700 text-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981]"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* ── Mutation error ───────────────────────── */}
      {statusMutation.isError && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
          {statusMutation.error.response?.data?.message ||
            "Failed to update status"}
        </div>
      )}

      {/* ── Table ────────────────────────────────── */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">
          Loading appointments...
        </div>
      ) : isError ? (
        <div className="text-center py-12 text-red-400">
          Failed to load appointments.
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-[#1f2937] rounded-xl shadow-xl border border-gray-800">
          <p className="text-gray-400">No appointments found.</p>
        </div>
      ) : (
        <div className="bg-[#1f2937] rounded-xl shadow-xl border border-gray-800 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#111827] border-b border-gray-800">
                <th className="text-left px-6 py-4 font-semibold text-gray-300">
                  Customer
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-300">
                  Email
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-300">
                  Date
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-300">
                  Time
                </th>
                <th className="text-left px-6 py-4 font-semibold text-gray-300">
                  Status
                </th>
                <th className="text-right px-6 py-4 font-semibold text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((appt) => (
                <tr
                  key={appt._id}
                  className="border-b border-gray-800 hover:bg-[#374151]/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-white">
                    {appt.customerId?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {appt.customerId?.email || "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {formatDate(appt.appointmentDateTime)}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {formatTime(appt.appointmentDateTime)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={appt.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 flex-wrap">
                      {appt.status !== "confirmed" &&
                        appt.status !== "cancelled" && (
                          <button
                            onClick={() =>
                              handleStatusChange(appt._id, "confirmed")
                            }
                            disabled={statusMutation.isPending}
                            className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 border border-transparent hover:border-blue-800 transition-colors disabled:opacity-50"
                          >
                            Confirm
                          </button>
                        )}
                      {appt.status !== "paid" &&
                        appt.status !== "cancelled" && (
                          <button
                            onClick={() =>
                              handleStatusChange(appt._id, "paid")
                            }
                            disabled={statusMutation.isPending}
                            className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#10b981]/20 text-[#10b981] hover:bg-[#10b981]/30 border border-transparent hover:border-[#10b981]/50 transition-colors disabled:opacity-50"
                          >
                            Mark Paid
                          </button>
                        )}
                      {appt.status !== "cancelled" && (
                        <button
                          onClick={() =>
                            handleStatusChange(appt._id, "cancelled")
                          }
                          disabled={statusMutation.isPending}
                          className="px-3 py-1.5 text-xs font-medium rounded-md bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-transparent hover:border-red-800 transition-colors disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
