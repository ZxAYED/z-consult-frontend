import { cn } from "@/lib/utils";
import React from "react";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: "strong" | "soft";
}

export const GlassPanel = ({
  children,
  className,
  variant = "soft",
}: GlassPanelProps) => {
  return (
    <div
      className={cn(
        "rounded-2xl border  shadow-sm transition-all duration-300",
        variant === "soft" && "bg-white/60 border-white/40",
        variant === "strong" && "bg-white/90 border-white/60 shadow-md",
        className,
      )}
    >
      {children}
    </div>
  );
};
