import { apiServer } from "@/lib/api/server";
import { QueueResponse } from "@/types/queue";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import QueueClient from "./client";

async function getQueueData() {
  try {
    const res = await apiServer<QueueResponse>(
      "/queue",
      "GET",
      undefined,
      { cacheType: "no-store" }, // Queue data is highly dynamic
    );
    return res?.data;
  } catch (error) {
    console.error("Failed to fetch queue data:", error);
    return undefined;
  }
}

export default async function QueuePage() {
  const queueData = await getQueueData();

  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <QueueClient initialData={queueData} />
    </Suspense>
  );
}
