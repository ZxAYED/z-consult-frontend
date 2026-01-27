"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/providers/auth-provider";
import { Bell, Menu, X } from "lucide-react";
import { useState } from "react";

export const DashboardNavbar = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[90] w-full py-4 bg-white/70 backdrop-blur-md shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]">
      <div className="px-4 md:px-8 flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-foreground">Overview</h2>
          <p className="text-xs text-muted-foreground">
            Welcome back, {user?.name || "Admin"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden inline-flex items-center  justify-center gap-2 rounded-full bg-white/80 px-4 py-3 text-sm font-semibold text-foreground "
          >
            <Menu className="h-4 w-4" />
            Menu
          </button>

          <div className="hidden md:flex items-center gap-4">
            <button className="relative p-2 rounded-full bg-white/60 hover:bg-white/80 transition-colors text-muted-foreground hover:text-foreground shadow-[0_8px_20px_-14px_rgba(15,23,42,0.35)]">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 pl-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium leading-none">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.email || "user@example.com"}
                </p>
              </div>
              <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shadow-[0_8px_20px_-14px_rgba(15,23,42,0.35)]">
                {user?.name?.[0] || "U"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <DialogContent
          showCloseButton={false}
          className="md:hidden fixed !left-0 !top-0 !translate-x-0 !translate-y-0 h-dvh w-[280px] max-w-none rounded-none border-0 bg-transparent p-0 shadow-none"
        >
          <div className="relative h-full">
            <DialogClose asChild>
              <button className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-2 text-muted-foreground shadow-[0_6px_16px_-10px_rgba(15,23,42,0.4)]">
                <X className="h-4 w-4" />
              </button>
            </DialogClose>
            <Sidebar
              className="h-full"
              onNavigate={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};
