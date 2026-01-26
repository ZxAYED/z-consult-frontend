import { cn } from "@/lib/utils";
import React from "react";

interface WrapperProps {
  children: React.ReactNode;
  className?: string;
}

const Wrapper = ({ children, className }: WrapperProps) => {
  return (
    <div className={cn("max-w-7xl mx-auto px-6 md:px-0 w-full", className)}>
      {children}
    </div>
  );
};

export default Wrapper;
