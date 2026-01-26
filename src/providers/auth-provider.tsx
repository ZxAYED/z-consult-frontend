"use client";

import { User } from "@/types/auth";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(() => {
    const userData = getCookie("user_data");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData as string);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user data", e);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const logout = () => {
    deleteCookie("ac_T");
    deleteCookie("rf_T");
    deleteCookie("user_data");
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
