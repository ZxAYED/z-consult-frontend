import { apiClient } from "@/lib/api/client";
import { 
    StaffResponse, 
    CreateStaffPayload, 
    UpdateStaffPayload 
} from "@/types/staff";

export const staffService = {
  getAll: async (page = 1, limit = 10) => {
    return apiClient<StaffResponse>(`/staff?page=${page}&limit=${limit}`);
  },

  create: async (data: CreateStaffPayload) => {
    return apiClient<{ success: boolean; message: string }>("/staff", "POST", data);
  },

  update: async (id: string, data: UpdateStaffPayload) => {
    return apiClient<{ success: boolean; message: string }>(`/staff/${id}`, "PATCH", data);
  },

  delete: async (id: string) => {
    return apiClient<{ success: boolean; message: string }>(`/staff/${id}`, "DELETE");
  }
};
