import { apiServer } from "@/lib/api/server";
import { DashboardResponse } from "@/types/dashboard";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import DashboardClient from "./client";

async function getDashboardSummary() {
  const today = format(new Date(), "yyyy-MM-dd");
  try {
    const res = await apiServer<DashboardResponse>(
      `/dashboard/summary?date=${today}`,
      "GET",
      undefined,
      { cacheType: "no-store" }, // Dashboard needs real-time data
    );
    return res?.data;
  } catch (error) {
    console.error("Failed to fetch dashboard summary:", error);
    return undefined;
  }
}

export default async function DashboardPage() {
  const dashboardData = await getDashboardSummary();

  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <DashboardClient data={dashboardData} />
    </Suspense>
  );
}
