import React from "react";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export const SectionTitle = ({
  title,
  subtitle,
  align = "left",
  className,
}: SectionTitleProps) => {
  return (
    <div
      className={cn(
        "space-y-1",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-sm leading-relaxed max-w-prose">
          {subtitle}
        </p>
      )}
    </div>
  );
};
