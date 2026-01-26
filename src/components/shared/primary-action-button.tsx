import { ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function PrimaryActionButton({
  className,
  children,
  onClick,
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.8 }}
      className={cn(
        "bg-primary flex items-center justify-center text-white rounded-lg px-6 py-2 cursor-pointer hover:bg-primary/90 ",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
