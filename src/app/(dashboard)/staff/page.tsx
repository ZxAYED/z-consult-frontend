import { apiServer } from "@/lib/api/server";
import { StaffResponse } from "@/types/staff";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import StaffClient from "./client";

async function getStaff(page = 1) {
  try {
    const res = await apiServer<StaffResponse>(
      `/staff?page=${page}`,
      "GET",
      undefined,
      { cacheType: "no-store" },
    );
    return res;
  } catch (error) {
    console.error("Failed to fetch staff:", error);
    return undefined;
  }
}

export default async function StaffPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const staffData = await getStaff(page);

  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <StaffClient initialData={staffData} />
    </Suspense>
  );
}
