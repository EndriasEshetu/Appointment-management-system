import api from "./authApi";

// ─── Customer Availability API ──────────────────────────────
export const getAvailableSlots = async () => {
  const { data } = await api.get("/availability");
  return data;
};

// ─── Customer Appointment API ───────────────────────────────
export const bookAppointment = async (appointmentData) => {
  const { data } = await api.post("/appointments", appointmentData);
  return data;
};

export const getMyAppointments = async () => {
  const { data } = await api.get("/appointments/me");
  return data;
};

export const rescheduleAppointment = async ({ id, appointmentDateTime }) => {
  const { data } = await api.put(`/appointments/${id}/reschedule`, {
    appointmentDateTime,
  });
  return data;
};

export const cancelAppointment = async (id) => {
  const { data } = await api.put(`/appointments/${id}/cancel`);
  return data;
};
