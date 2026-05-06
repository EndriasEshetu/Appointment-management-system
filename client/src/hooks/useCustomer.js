import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAvailableSlots,
  bookAppointment,
  getMyAppointments,
  rescheduleAppointment,
  cancelAppointment,
} from "../api/customerApi";

// ─── Fetch available slots for calendar ─────────────────────
export const useAvailableSlots = () => {
  return useQuery({
    queryKey: ["availableSlots"],
    queryFn: getAvailableSlots,
  });
};

// ─── Book an appointment ────────────────────────────────────
export const useBookAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["availableSlots"] });
    },
  });
};

// ─── Fetch customer's own appointments ──────────────────────
export const useMyAppointments = () => {
  return useQuery({
    queryKey: ["myAppointments"],
    queryFn: getMyAppointments,
  });
};

// ─── Reschedule ─────────────────────────────────────────────
export const useRescheduleAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rescheduleAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAppointments"] });
    },
  });
};

// ─── Cancel ─────────────────────────────────────────────────
export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAppointments"] });
    },
  });
};
