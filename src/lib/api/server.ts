/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import "server-only";

const API_URL =
  process.env.NEXT_PUBLIC_PRODUCTION === "true"
    ? process.env.NEXT_PUBLIC_PRODUCTION_API
    : process.env.NEXT_PUBLIC_LOCAL_API || process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ApiClientOptions {
  successMessage?: string;
  errorMessage?: string;

  // NEW CACHE OPTIONS 
  cacheType?: "no-store" | "force-cache" | "default";
  revalidate?: number | false;
}

export type ApiServerOptions = ApiClientOptions;

export async function apiServer<T = unknown>(
  url: string,
  method: string = "GET",
  data?: unknown,
  options?: ApiServerOptions,
): Promise<T | undefined> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("ac_T")?.value;
  const refreshToken = cookieStore.get("rf_T")?.value;

  const headers: Record<string, string> = { Accept: "application/json" };
  headers["Content-Type"] = "application/json";
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
  if (refreshToken) headers["refresh-token"] = `${refreshToken}`;


  const cacheMode =
    options?.cacheType === "force-cache"
      ? "force-cache"
      : options?.cacheType === "no-store"
        ? "no-store"
        : "default";

  const nextOptions = {
    revalidate:
      typeof options?.revalidate === "number"
        ? options.revalidate
        : options?.revalidate === false
          ? 0
          : undefined,
    ...(options as any)?.tags ? { tags: (options as any).tags } : {},
  };

  try {
    const response = await fetch(`${API_URL}${url}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",

      // Dynamically apply caching 
      cache: cacheMode,
      next: nextOptions,
    });

    const resultText = await response.text();

    let resultJson: unknown;
    try {
      resultJson = resultText ? JSON.parse(resultText) : {};
    } catch {
      resultJson = resultText;
    }

    // Handle API errors 
    if (!response.ok) {
      let message = "";

      if (Array.isArray(resultJson)) {
        message = resultJson
          .map((item: unknown) => {
            if (typeof item === "object" && item !== null) {
              const obj = item as Record<string, unknown>;
              return (
                (obj.message as string) ||
                (obj.detail as string) ||
                JSON.stringify(obj) ||
                "Unknown error"
              );
            }
            return String(item);
          })
          .join("\n");
      } else if (typeof resultJson === "object" && resultJson !== null) {
        const obj = resultJson as Record<string, unknown>;
        
        if (Array.isArray(obj.message)) {
          message = obj.message.join("\n");
        } else if (typeof obj.message === "string") {
          message = obj.message;
        } else {
          message =
            (obj.detail as string) ||
            (obj.error as string) ||
            JSON.stringify(obj);
        }
      } else {
        message = String(resultJson);
      }
      
      console.error("SERVER API ERROR:", message);
      throw new Error(message);
    }

    return resultJson as T;
  } catch (err: unknown) {
    const error = err as Error;
    console.error("SERVER NETWORK ERROR:", error.message);
    console.error(options?.errorMessage || error.message);
    // Rethrow to handle it in the caller if needed
    throw error;
  }
}
