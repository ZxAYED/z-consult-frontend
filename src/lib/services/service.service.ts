import { apiClient } from "@/lib/api/client";
import { 
    ServiceResponse, 
    CreateServicePayload, 
    UpdateServicePayload 
} from "@/types/service";

export const serviceService = {
  getAll: async (page = 1, limit = 10) => {
    return apiClient<ServiceResponse>(`/services?page=${page}&limit=${limit}`);
  },

  create: async (data: CreateServicePayload) => {
    return apiClient<{ success: boolean; message: string }>("/services", "POST", data);
  },

  update: async (id: string, data: UpdateServicePayload) => {
    return apiClient<{ success: boolean; message: string }>(`/services/${id}`, "PATCH", data);
  },

  delete: async (id: string) => {
    return apiClient<{ success: boolean; message: string }>(`/services/${id}`, "DELETE");
  }
};
