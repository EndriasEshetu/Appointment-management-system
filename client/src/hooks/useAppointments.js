import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBusinessAppointments,
  updateAppointmentStatus,
} from "../api/dashboardApi";

// ─── Fetch all business appointments ────────────────────────
export const useBusinessAppointments = () => {
  return useQuery({
    queryKey: ["businessAppointments"],
    queryFn: getBusinessAppointments,
  });
};

// ─── Update appointment status ──────────────────────────────
export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAppointmentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businessAppointments"] });
    },
  });
};
