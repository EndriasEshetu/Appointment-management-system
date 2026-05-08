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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Availability Management
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your weekly working hours
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-[#10b981] text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors"
          >
            + Add Slot
          </button>
        )}
      </div>

      {/* Success / Error messages  */}
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

      {/* Add / Edit Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-6 bg-[#1f2937] rounded-xl shadow-xl border border-gray-700"
        >
          <h2 className="text-lg font-semibold text-white tracking-wide mb-4">
            {editingId ? "Edit Slot" : "Add New Slot"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Day */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Day of Week
              </label>
              <select
                name="dayOfWeek"
                value={form.dayOfWeek}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#111827] border border-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981]"
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
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#111827] border border-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] [color-scheme:dark]"
              />
            </div>

            {/* End time */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#111827] border border-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#10b981] focus:border-[#10b981] [color-scheme:dark]"
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
                  className="w-4 h-4 text-[#10b981] bg-[#111827] border-gray-700 rounded focus:ring-[#10b981] focus:ring-offset-gray-900"
                />
                <span className="text-sm text-gray-300">Available</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={isMutating}
              className="px-5 py-2 bg-[#10b981] text-white text-sm font-medium rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition-colors shadow-lg shadow-emerald-900/20"
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
              className="px-5 py-2 bg-gray-700 text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Slots List */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading slots...</div>
      ) : isError ? (
        <div className="text-center py-12 text-red-400">
          Failed to load availability data.
        </div>
      ) : slots.length === 0 ? (
        <div className="text-center py-12 bg-[#1f2937] rounded-xl shadow-xl border border-gray-800">
          <p className="text-gray-300">No availability slots yet.</p>
          <p className="text-sm text-gray-500 mt-1">
            Click "Add Slot" to define your working hours.
          </p>
        </div>
      ) : (
        <div className="bg-[#1f2937] rounded-xl shadow-xl border border-gray-800 overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-[#111827] border-b border-gray-800">
                  <th className="px-6 py-4 font-semibold text-gray-300">Day</th>
                  <th className="px-6 py-4 font-semibold text-gray-300">Start Time</th>
                  <th className="px-6 py-4 font-semibold text-gray-300">End Time</th>
                  <th className="px-6 py-4 font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-4 text-right font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {slots.map((slot) => (
                  <tr key={slot._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{DAYS[slot.dayOfWeek]}</td>
                    <td className="px-6 py-4 text-gray-400">{slot.startTime}</td>
                    <td className="px-6 py-4 text-gray-400">{slot.endTime}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        slot.isAvailable ? "bg-emerald-500/10 text-emerald-400" : "bg-gray-800 text-gray-500"
                      }`}>
                        {slot.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toggleAvailability(slot)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 transition-all"
                        >
                          {slot.isAvailable ? "Disable" : "Enable"}
                        </button>
                        <button
                          onClick={() => startEdit(slot)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-800">
            {slots.map((slot) => (
              <div key={slot._id} className="p-4 space-y-3 hover:bg-white/5 transition-colors">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-white">{DAYS[slot.dayOfWeek]}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    slot.isAvailable ? "bg-emerald-500/10 text-emerald-400" : "bg-gray-800 text-gray-500"
                  }`}>
                    {slot.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-gray-400">
                  <p><span className="text-gray-500">From:</span> {slot.startTime}</p>
                  <p><span className="text-gray-500">To:</span> {slot.endTime}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => toggleAvailability(slot)}
                    className="flex-1 py-2 text-xs font-medium rounded-lg bg-gray-800 border border-gray-700 text-gray-300"
                  >
                    {slot.isAvailable ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => startEdit(slot)}
                    className="flex-1 py-2 text-xs font-medium rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      )}
    </div>
  );
};

export default AvailabilityManager;
