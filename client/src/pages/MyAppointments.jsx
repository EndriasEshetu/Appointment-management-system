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

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Split into upcoming and past
  const now = new Date();
  const upcoming = appointments.filter(
    (a) => new Date(a.date) >= now && a.status !== "cancelled"
  );
  const past = appointments.filter(
    (a) => new Date(a.date) < now || a.status === "cancelled"
  );

  return (
    <div>
      {/* ── Header ───────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>
        <p className="text-sm text-gray-500 mt-1">
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
        <div className="text-center py-16 text-gray-500">
          Loading your appointments...
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-red-500">
          Failed to load appointments.
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-lg">No appointments yet.</p>
          <p className="text-sm text-gray-400 mt-1">
            Go to "Book Appointment" to schedule one!
          </p>
        </div>
      ) : (
        <>
          {/* ── Upcoming appointments ─────────────── */}
          {upcoming.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Upcoming ({upcoming.length})
              </h2>
              <div className="space-y-3">
                {upcoming.map((appt) => (
                  <div
                    key={appt._id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    {/* Info */}
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {appt.businessId?.name || "Unknown Business"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(appt.date)} at{" "}
                        <span className="font-medium text-gray-700">
                          {appt.time}
                        </span>
                      </p>
                      {appt.notes && (
                        <p className="text-xs text-gray-400 italic">
                          "{appt.notes}"
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <StatusBadge status={appt.status} />

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setRescheduleTarget(appt)}
                        className="px-3 py-1.5 text-xs font-medium rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleCancel(appt._id)}
                        disabled={cancelMutation.isPending}
                        className="px-3 py-1.5 text-xs font-medium rounded-md bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 transition-colors"
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
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Past / Cancelled ({past.length})
              </h2>
              <div className="space-y-3">
                {past.map((appt) => (
                  <div
                    key={appt._id}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center gap-4 opacity-60"
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {appt.businessId?.name || "Unknown Business"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(appt.date)} at {appt.time}
                      </p>
                      {appt.notes && (
                        <p className="text-xs text-gray-400 italic">
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
