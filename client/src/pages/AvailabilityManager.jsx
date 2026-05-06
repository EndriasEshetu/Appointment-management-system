import { useState } from "react";
import {
  useMyAvailability,
  useCreateAvailability,
  useUpdateAvailability,
} from "../hooks/useAvailability";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const emptyForm = {
  dayOfWeek: 1,
  startTime: "09:00",
  endTime: "17:00",
  isAvailable: true,
};

const AvailabilityManager = () => {
  const { data: slots = [], isLoading, isError } = useMyAvailability();
  const createMutation = useCreateAvailability();
  const updateMutation = useUpdateAvailability();

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Flash a success message for 3 seconds
  const flashSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "dayOfWeek" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      updateMutation.mutate(
        { id: editingId, ...form },
        {
          onSuccess: () => {
            flashSuccess("Slot updated successfully!");
            resetForm();
          },
        }
      );
    } else {
      createMutation.mutate(form, {
        onSuccess: () => {
          flashSuccess("Slot created successfully!");
          resetForm();
        },
      });
    }
  };

  const startEdit = (slot) => {
    setForm({
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
      isAvailable: slot.isAvailable,
    });
    setEditingId(slot._id);
    setShowForm(true);
  };

  const toggleAvailability = (slot) => {
    updateMutation.mutate({
      id: slot._id,
      isAvailable: !slot.isAvailable,
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;
  const mutationError = createMutation.error || updateMutation.error;

  return (
    <div>
      {/* ── Header ───────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Availability Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your weekly working hours
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Slot
          </button>
        )}
      </div>

      {/* ── Success / Error messages ─────────────── */}
      {successMsg && (
        <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded-lg">
          {successMsg}
        </div>
      )}
      {mutationError && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
          {mutationError.response?.data?.message || "Something went wrong"}
        </div>
      )}

      {/* ── Add / Edit Form ──────────────────────── */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            {editingId ? "Edit Slot" : "Add New Slot"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Day */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Day of Week
              </label>
              <select
                name="dayOfWeek"
                value={form.dayOfWeek}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {DAYS.map((day, i) => (
                  <option key={i} value={i}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            {/* Start time */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* End time */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Available */}
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={form.isAvailable}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Available</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              type="submit"
              disabled={isMutating}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isMutating
                ? "Saving..."
                : editingId
                ? "Update Slot"
                : "Create Slot"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── Slots List ───────────────────────────── */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading slots...</div>
      ) : isError ? (
        <div className="text-center py-12 text-red-500">
          Failed to load availability data.
        </div>
      ) : slots.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500">No availability slots yet.</p>
          <p className="text-sm text-gray-400 mt-1">
            Click "Add Slot" to define your working hours.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Day
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  Start Time
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">
                  End Time
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
              {slots.map((slot) => (
                <tr
                  key={slot._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {DAYS[slot.dayOfWeek]}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{slot.startTime}</td>
                  <td className="px-6 py-4 text-gray-600">{slot.endTime}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        slot.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {slot.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => toggleAvailability(slot)}
                      className="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {slot.isAvailable ? "Disable" : "Enable"}
                    </button>
                    <button
                      onClick={() => startEdit(slot)}
                      className="px-3 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                    >
                      Edit
                    </button>
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

export default AvailabilityManager;
