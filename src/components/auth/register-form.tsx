"use client";

import { PrimaryButton } from "@/components/shared/buttons";
import { PasswordField, TextField } from "@/components/shared/inputs";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterValues) => {
    // UI Only: Mock submit
    console.log("Register submitted:", data);
    toast.success("UI only: Register submitted successfully");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
        <div className="space-y-4">
          <TextField
            control={form.control}
            name="fullName"
            label="Full Name"
            placeholder="Dr. John Doe"
          />
          <TextField
            control={form.control}
            name="email"
            label="Email Address"
            placeholder="john@example.com"
          />
          <PasswordField
            control={form.control}
            name="password"
            label="Password"
            placeholder="••••••••"
          />
          <PasswordField
            control={form.control}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="••••••••"
          />
        </div>

        <div className="pt-2">
          <PrimaryButton
            type="submit"
            title="Create Account"
            className="w-full"
            icon={<UserPlus className="w-4 h-4" />}
          />
        </div>
      </form>
    </Form>
  );
};
