"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Control } from "react-hook-form";

interface InputProps {
  name: string;
  label: string;
  placeholder?: string;
  control: Control<any>;
  disabled?: boolean;
}

export const TextField = ({
  name,
  label,
  placeholder,
  control,
  disabled,
}: InputProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-foreground/80">{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              disabled={disabled}
              className="rounded-lg bg-white/50 border-muted focus:border-primary/50 focus:ring-primary/20 transition-all h-11"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const PasswordField = ({
  name,
  label,
  placeholder,
  control,
  disabled,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-foreground/80">{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                {...field}
                disabled={disabled}
                className="rounded-lg bg-white/50 border-muted focus:border-primary/50 focus:ring-primary/20 transition-all pr-10 h-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
