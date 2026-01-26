"use client";

import { useAuth } from "@/providers/auth-provider";
import { Bell } from "lucide-react";

export const DashboardNavbar = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 w-full py-4 bg-white/60 backdrop-blur-md border-b border-white/40">
      <div className="px-8 flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-foreground">Overview</h2>
          <p className="text-xs text-muted-foreground">
            Welcome back, {user?.name || "Admin"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-full hover:bg-white/50 transition-colors text-muted-foreground hover:text-foreground">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-border/20">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium leading-none">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.email || "user@example.com"}
              </p>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-white/50 shadow-sm">
              {user?.name?.[0] || "U"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
