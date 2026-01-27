"use client";

import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { motion } from "framer-motion";
import {
  Briefcase,
  Calendar,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Appointments",
    icon: Calendar,
    href: "/appointments",
  },
  {
    label: "Queue",
    icon: ListOrdered,
    href: "/queue",
  },
  {
    label: "Staff",
    icon: Users,
    href: "/staff",
  },
  {
    label: "Services",
    icon: Briefcase,
    href: "/services",
  },
];

interface SidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export function Sidebar({ onNavigate, className }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div
      className={cn(
        "space-y-4 py-4 flex flex-col h-full bg-white backdrop-blur-md shadow-[0_20px_50px_-40px_rgba(15,23,42,0.3)]",
        className,
      )}
    >
      <div className="px-6 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center mb-10">
          <Logo />
        </Link>
        <div className="space-y-4 pt-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center p-3 w-full justify-start font-medium cursor-pointer rounded-xl transition-all duration-200 relative overflow-hidden",
                pathname === route.href
                  ? "text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/60",
              )}
            >
              {pathname === route.href && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 bg-primary  z-0"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className="flex items-center flex-1 relative z-10">
                <route.icon
                  className={cn(
                    "h-5 w-5 mr-3 transition-transform group-hover:scale-110",
                    pathname === route.href
                      ? "text-white"
                      : "text-muted-foreground group-hover:text-primary",
                  )}
                />
                <span
                  className={cn(pathname === route.href ? "text-white" : "")}
                >
                  {route.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-6 py-2">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.8 }}
          onClick={() => {
            logout();
            onNavigate?.();
          }}
          className="flex items-center p-3 w-full justify-start font-medium cursor-pointer rounded-xl  text-destructive bg-destructive/10 transition-all duration-200"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </motion.button>
      </div>
    </div>
  );
}
