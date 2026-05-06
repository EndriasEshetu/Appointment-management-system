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

  return (
    <div>
      {/* ── Header ───────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Appointment Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage and track all your customer appointments
        </p>
      </div>

      {/* ── Stats cards ──────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {["pending", "confirmed", "paid", "cancelled"].map((status) => {
          const count = appointments.filter((a) => a.status === status).length;
          const colors = {
            pending: "border-yellow-400 bg-yellow-50",
            confirmed: "border-blue-400 bg-blue-50",
            paid: "border-green-400 bg-green-50",
            cancelled: "border-red-400 bg-red-50",
          };
          return (
            <div
              key={status}
              className={`p-4 rounded-lg border-l-4 ${colors[status]}`}
            >
              <p className="text-2xl font-bold text-gray-800">{count}</p>
              <p className="text-sm text-gray-600 capitalize">{status}</p>
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
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="text-center py-12 text-gray-500">
          Loading appointments...
        </div>
      ) : isError ? (
        <div className="text-center py-12 text-red-500">
          Failed to load appointments.
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500">No appointments found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Customer
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Email
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Date
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Time
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-right px-6 py-3 font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((appt) => (
                <tr
                  key={appt._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {appt.customerId?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {appt.customerId?.email || "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(appt.date)}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{appt.time}</td>
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
                            className="px-3 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors disabled:opacity-50"
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
                            className="px-3 py-1 text-xs font-medium rounded-md bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50"
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
                          className="px-3 py-1 text-xs font-medium rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50"
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
