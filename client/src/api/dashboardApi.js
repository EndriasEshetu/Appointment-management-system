import api from "./authApi";

export const getMyAvailability = async () => {
  const { data } = await api.get("/availability/me");
  return data;
};

export const createAvailability = async (slotData) => {
  const { data } = await api.post("/availability", slotData);
  return data;
};

export const updateAvailability = async ({ id, ...slotData }) => {
  const { data } = await api.put(`/availability/${id}`, slotData);
  return data;
};

export const getBusinessAppointments = async () => {
  const { data } = await api.get("/appointments/business");
  return data;
};

export const updateAppointmentStatus = async ({ id, status }) => {
  const { data } = await api.put(`/appointments/${id}/status`, { status });
  return data;
};
