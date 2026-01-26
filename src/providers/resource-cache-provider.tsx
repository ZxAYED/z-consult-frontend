"use client";

import { serviceService } from "@/lib/services/service.service";
import { staffService } from "@/lib/services/staff.service";
import { Service } from "@/types/service";
import { Staff } from "@/types/staff";
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { toast } from "sonner";

interface ResourceCacheContextType {
  services: Service[];
  staff: Staff[];
  loadingServices: boolean;
  loadingStaff: boolean;
  refreshServices: () => Promise<void>;
  refreshStaff: () => Promise<void>;
}

const ResourceCacheContext = createContext<ResourceCacheContextType | undefined>(undefined);

export function ResourceCacheProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(false);

  // Use a large limit to simulate "fetch all" for dropdowns/cache
  const CACHE_LIMIT = 1000;

  const fetchServices = useCallback(async () => {
    setLoadingServices(true);
    try {
      const response = await serviceService.getAll(1, CACHE_LIMIT);
      if (response.success) {
        setServices(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch services for cache", error);
      // Optional: Don't toast here to avoid spamming if background fetch fails silently
    } finally {
      setLoadingServices(false);
    }
  }, []);

  const fetchStaff = useCallback(async () => {
    setLoadingStaff(true);
    try {
      const response = await staffService.getAll(1, CACHE_LIMIT);
      if (response.success) {
        setStaff(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch staff for cache", error);
    } finally {
      setLoadingStaff(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchServices();
    fetchStaff();
  }, [fetchServices, fetchStaff]);

  const refreshServices = useCallback(async () => {
    await fetchServices();
  }, [fetchServices]);

  const refreshStaff = useCallback(async () => {
    await fetchStaff();
  }, [fetchStaff]);

  return (
    <ResourceCacheContext.Provider
      value={{
        services,
        staff,
        loadingServices,
        loadingStaff,
        refreshServices,
        refreshStaff,
      }}
    >
      {children}
    </ResourceCacheContext.Provider>
  );
}

export function useResourceCache() {
  const context = useContext(ResourceCacheContext);
  if (context === undefined) {
    throw new Error("useResourceCache must be used within a ResourceCacheProvider");
  }
  return context;
}
