import { apiServer } from "@/lib/api/server";
import { ServiceResponse } from "@/types/service";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import ServicesClient from "./client";

async function getServices(page = 1, limit = 10) {
  const res = await apiServer<ServiceResponse>(
    `/services?page=${page}&limit=${limit}`,
    "GET",
    undefined,
    { cacheType: "no-store" },
  );
  return res;
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const servicesData = await getServices(page);

  if (!servicesData || !servicesData.success) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold text-red-500">
          Failed to load services
        </h2>
        <p className="text-muted-foreground">Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <ServicesClient initialData={servicesData} />
    </Suspense>
  );
}
