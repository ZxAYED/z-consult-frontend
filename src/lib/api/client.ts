import { getCookie } from "cookies-next";

const API_URL =
  process.env.NEXT_PUBLIC_PRODUCTION === "true"
    ? process.env.NEXT_PUBLIC_PRODUCTION_API
    : process.env.NEXT_PUBLIC_LOCAL_API || process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ApiClientOptions {
  successMessage?: string;
  errorMessage?: string;
}

export async function apiClient<T = unknown>(
  url: string,
  method: string = "GET",
  data?: unknown,
  // options?: ApiClientOptions 
): Promise<T> {
  const isUrlEncoded = data instanceof URLSearchParams;
  const accessToken = getCookie("ac_T");
  const refreshToken = getCookie("rf_T");

  const headers: Record<string, string> = { Accept: "application/json" };
  if (!isUrlEncoded) headers["Content-Type"] = "application/json";
  if (isUrlEncoded) headers["Content-Type"] = "application/x-www-form-urlencoded";
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
  if (refreshToken) headers["refresh-token"] = `${refreshToken}`;

  try {
    const response = await fetch(`${API_URL}${url}`, {
      method,
      headers,
      body: isUrlEncoded
          ? data.toString()
          : data
            ? JSON.stringify(data)
            : undefined,
      credentials: "include",
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
        message =
          (obj.detail as string) ||
          (obj.message as string) ||
          (obj.error as string) ||
          JSON.stringify(obj);
          console.log(message)
      } else {
        message = String(resultJson);
        console.log(message)
      }

      throw new Error(message);
    }

    return resultJson as T;
  } catch (err: unknown) {
    const error = err as Error;
    const message = error?.message || "Network request failed.";
    throw new Error(message);
  }
}
