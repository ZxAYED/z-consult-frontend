import { apiServer } from "@/lib/api/server";
import { AppointmentResponse } from "@/types/appointment";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import AppointmentsClient from "./client";

async function getAppointments(page = 1, limit = 10) {
  try {
    const res = await apiServer<AppointmentResponse>(
      `/appointments?page=${page}&limit=${limit}`,
      "GET",
      undefined,
      { cacheType: "no-store" },
    );
    return res;
  } catch (error) {
    // Log error but don't crash page; let client handle fallback/retry
    console.error("Failed to fetch initial appointments:", error);
    return undefined;
  }
}

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const appointmentsData = await getAppointments(page);

  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <AppointmentsClient initialData={appointmentsData} />
    </Suspense>
  );
}
