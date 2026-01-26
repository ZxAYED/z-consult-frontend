import { apiClient } from "@/lib/api/client";
import { DashboardResponse } from "@/types/dashboard";

export const dashboardService = {
  getSummary: async (date: string) => {
    return apiClient<DashboardResponse>(`/dashboard/summary?date=${date}`);
  }
};
