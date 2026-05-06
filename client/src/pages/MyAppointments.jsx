import { useState } from "react";
import {
  useMyAppointments,
  useCancelAppointment,
} from "../hooks/useCustomer";
import StatusBadge from "../components/StatusBadge";
import RescheduleModal from "../components/RescheduleModal";

const MyAppointments = () => {
  const { data: appointments = [], isLoading, isError } = useMyAppointments();
  const cancelMutation = useCancelAppointment();

  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const flashSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleCancel = (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }
    cancelMutation.mutate(id, {
      onSuccess: () => flashSuccess("Appointment cancelled."),
    });
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Split into upcoming and past
  const now = new Date();
  const upcoming = appointments.filter(
    (a) => new Date(a.appointmentDateTime) >= now && a.status !== "cancelled"
  );
  const past = appointments.filter(
    (a) => new Date(a.appointmentDateTime) < now || a.status === "cancelled"
  );

  return (
    <div>
      {/* ── Header ───────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-wide">My Appointments</h1>
        <p className="text-sm text-gray-400 mt-1">
          View, reschedule, or cancel your appointments
        </p>
      </div>

      {/* ── Messages ─────────────────────────────── */}
      {successMsg && (
        <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded-lg">
          {successMsg}
        </div>
      )}
      {cancelMutation.isError && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
          {cancelMutation.error.response?.data?.message || "Cancel failed"}
        </div>
      )}

      {/* ── Loading / Error ──────────────────────── */}
      {isLoading ? (
        <div className="text-center py-16 text-gray-400">
          Loading your appointments...
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-red-400">
          Failed to load appointments.
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-16 bg-[#1f2937] rounded-xl shadow-xl border border-gray-800">
          <p className="text-gray-300 text-lg">No appointments yet.</p>
          <p className="text-sm text-gray-500 mt-1">
            Go to "Book Appointment" to schedule one!
          </p>
        </div>
      ) : (
        <>
          {/* ── Upcoming appointments ─────────────── */}
          {upcoming.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white tracking-wide mb-3">
                Upcoming ({upcoming.length})
              </h2>
              <div className="space-y-3">
                {upcoming.map((appt) => (
                  <div
                    key={appt._id}
                    className="bg-[#1f2937] rounded-xl shadow-xl border border-gray-800 p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-gray-700 transition-colors"
                  >
                    {/* Info */}
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold text-white">
                        {appt.businessId?.name || "Unknown Business"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatDateTime(appt.appointmentDateTime)}
                      </p>
                      {appt.notes && (
                        <p className="text-xs text-gray-500 italic mt-2 bg-[#111827] p-2 rounded-md">
                          "{appt.notes}"
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <StatusBadge status={appt.status} />

                    {/* Actions */}
                    <div className="flex gap-2 mt-4 sm:mt-0">
                      <button
                        onClick={() => setRescheduleTarget(appt)}
                        className="px-4 py-2 text-xs font-medium rounded-md bg-[#111827] text-blue-400 hover:bg-blue-900/30 border border-gray-700 hover:border-blue-800 transition-colors"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleCancel(appt._id)}
                        disabled={cancelMutation.isPending}
                        className="px-4 py-2 text-xs font-medium rounded-md bg-[#111827] text-red-400 hover:bg-red-900/30 border border-gray-700 hover:border-red-800 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Past / Cancelled appointments ────── */}
          {past.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-400 tracking-wide mb-3">
                Past / Cancelled ({past.length})
              </h2>
              <div className="space-y-3">
                {past.map((appt) => (
                  <div
                    key={appt._id}
                    className="bg-[#1f2937]/50 rounded-xl border border-gray-800/50 p-5 flex flex-col sm:flex-row sm:items-center gap-4 opacity-60"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold text-gray-300">
                        {appt.businessId?.name || "Unknown Business"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDateTime(appt.appointmentDateTime)}
                      </p>
                      {appt.notes && (
                        <p className="text-xs text-gray-600 italic">
                          "{appt.notes}"
                        </p>
                      )}
                    </div>
                    <StatusBadge status={appt.status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Reschedule modal ──────────────────────── */}
      {rescheduleTarget && (
        <RescheduleModal
          appointment={rescheduleTarget}
          onClose={() => setRescheduleTarget(null)}
        />
      )}
    </div>
  );
};

export default MyAppointments;
