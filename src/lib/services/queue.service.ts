import { apiClient } from "@/lib/api/client";
import { QueueResponse, AssignQueueResponse } from "@/types/queue";

export const queueService = {
  getQueue: async () => {
    return apiClient<QueueResponse>("/queue");
  },

  assignNext: async () => {
    return apiClient<AssignQueueResponse>("/queue/assign", "POST");
  }
};
