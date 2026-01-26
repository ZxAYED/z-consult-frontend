/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api/client";
import {
  AppointmentResponse,
  AppointmentStatus,
  CreateAppointmentPayload,
  UpdateAppointmentPayload
} from "@/types/appointment";

export interface AppointmentFilters {
  page?: number;
  limit?: number;
  date?: string;
  staffId?: string;
  status?: AppointmentStatus;
  search?: string;
}

export const appointmentService = {
  getAll: async (filters: AppointmentFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.date) params.append("date", filters.date);
    if (filters.staffId) params.append("staffId", filters.staffId);
    if (filters.status) params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);

    return apiClient<AppointmentResponse>(`/appointments?${params.toString()}`);
  },

  create: async (data: CreateAppointmentPayload) => {
    return apiClient<{ success: boolean; message: string; data: any }>("/appointments", "POST", data);
  },

  update: async (id: string, data: UpdateAppointmentPayload) => {
    return apiClient<{ success: boolean; message: string; data: any }>(`/appointments/${id}`, "PATCH", data);
  },

  cancel: async (id: string) => {
    return apiClient<{ success: boolean; message: string }>(`/appointments/${id}/cancel`, "POST");
  },

  getEligibleStaff: async () => {
  
    return apiClient<{ success: boolean; data: any[] }>("/appointments/eligible-staff");
  }
}
