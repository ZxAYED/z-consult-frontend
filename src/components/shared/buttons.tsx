"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface ButtonProps {
  title: string;
  onClick?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const buttonVariants = {
  tap: { scale: 0.98 },
  hover: { scale: 1.01 },
};

export const PrimaryButton = ({
  title,
  onClick,
  icon,
  disabled,
  loading,
  className,
  type = "button",
}: ButtonProps) => {
  return (
    <motion.button
      type={type}
      variants={buttonVariants}
      whileTap="tap"
      whileHover={!disabled && !loading ? "hover" : undefined}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "bg-primary hover:bg-primary/90 text-white  shadow-sm hover:shadow-md transition-all px-6 cursor-pointer py-3 flex justify-center items-center font-medium rounded-lg",
        className,
      )}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {title}
    </motion.button>
  );
};

export const GhostButton = ({
  title,
  onClick,
  icon,
  disabled,
  loading,
  className,
  type = "button",
}: ButtonProps) => {
  return (
    <motion.button
      type={type}
      variants={buttonVariants}
      whileTap="tap"
      whileHover={!disabled && !loading ? "hover" : undefined}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "text-muted-foreground cursor-pointer flex justify-center items-center hover:text-foreground hover:bg-muted/50 rounded-lg px-6 py-3 border border-transparent hover:border-primary/50 shadow-[0_0_10px_rgba(118,186,75,0.2)] transition-all duration-300",
        className,
      )}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {title}
    </motion.button>
  );
};

export const DangerButton = ({
  title,
  onClick,
  icon,
  disabled,
  loading,
  className,
  type = "button",
}: ButtonProps) => {
  return (
    <motion.button
      type={type}
      variants={buttonVariants}
      whileTap="tap"
      whileHover={!disabled && !loading ? "hover" : undefined}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg shadow-sm px-6 py-3",
        className,
      )}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {title}
    </motion.button>
  );
};
