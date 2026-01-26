/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PrimaryButton } from "@/components/shared/buttons";
import { PasswordField, TextField } from "@/components/shared/inputs";
import { Form } from "@/components/ui/form";
import { authService } from "@/lib/services/auth.service";
import { useAuth } from "@/providers/auth-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterValues) => {
    setLoading(true);
    try {
      const response = await authService.register({
        email: data.email,
        password: data.password,
        name: data.fullName,
        confirmPassword: data.confirmPassword,
      });
      if (response.success) {
        toast.success("Registration successful");
        refreshUser();
        router.push("/dashboard");
      } else {
        toast.error(response.message || "Registration failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
          />
          <TextField
            control={form.control}
            name="email"
            label="Email Address"
            placeholder="john@example.com"
            disabled={loading}
          />
          <PasswordField
            control={form.control}
            name="password"
            label="Password"
            placeholder="••••••••"
            disabled={loading}
          />
          <PasswordField
            control={form.control}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        <div className="pt-2">
          <PrimaryButton
            type="submit"
            title="Create Account"
            className="w-full"
            icon={<UserPlus className="w-4 h-4" />}
            loading={loading}
          />
        </div>
      </form>
    </Form>
  );
};
