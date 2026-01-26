import { apiClient } from "@/lib/api/client";
import {
  AuthResponse,
  LoginCredentials,
  RefreshTokenResponse,
  RegisterCredentials
} from "@/types/auth";
import { deleteCookie, setCookie } from "cookies-next";

export const authService = {
  register: async (data: RegisterCredentials) => {
    const response = await apiClient<AuthResponse>("/auth/register", "POST", data);
    if (response.success && response.data) {
        // Set cookies with appropriate options
        setCookie("ac_T", response.data.accessToken, { maxAge: 60 * 60 * 24 * 3 }); // 3 days
        setCookie("rf_T", response.data.refreshToken, { maxAge: 60 * 60 * 24 * 7 }); // 7 days
        setCookie("user_data", JSON.stringify(response.data.user), { maxAge: 60 * 60 * 24 * 7 });
    }
    return response;
  },

  login: async (data: LoginCredentials) => {
    const response = await apiClient<AuthResponse>("/auth/login", "POST", data);
    if (response.success && response.data) {
        setCookie("ac_T", response.data.accessToken, { maxAge: 60 * 60 * 24 * 3 }); 
        setCookie("rf_T", response.data.refreshToken, { maxAge: 60 * 60 * 24 * 7 });
        setCookie("user_data", JSON.stringify(response.data.user), { maxAge: 60 * 60 * 24 * 7 });
    }
    return response;
  },

  logout: () => {
      deleteCookie("ac_T");
      deleteCookie("rf_T");
      deleteCookie("user_data");
      window.location.href = "/login";
  },

  refreshToken: async (token: string) => {
    // Note: Refresh logic might be handled automatically by interceptors in a full implementation
    // For now, we expose the endpoint call
    return apiClient<RefreshTokenResponse>("/auth/refresh", "POST", {});
  }
};
