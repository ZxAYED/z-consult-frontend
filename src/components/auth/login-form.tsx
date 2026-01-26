"use client";

import { GhostButton, PrimaryButton } from "@/components/shared/buttons";
import { PasswordField, TextField } from "@/components/shared/inputs";
import { Form } from "@/components/ui/form";
import { authService } from "@/lib/services/auth.service";
import { useAuth } from "@/providers/auth-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginValues) => {
    setLoading(true);
    try {
      const response = await authService.login(data);
      if (response.success) {
        toast.success("Login successful");
        refreshUser();
        router.push("/dashboard");
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    form.setValue("email", "admin@z.com");
    form.setValue("password", "123456");
    toast.info("Demo credentials filled");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
        <div className="space-y-4">
          <TextField
            control={form.control}
            name="email"
            label="Email Address"
            placeholder="admin@example.com"
            disabled={loading}
          />
          <PasswordField
            control={form.control}
            name="password"
            label="Password"
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <PrimaryButton
            type="submit"
            title="Sign In"
            className="w-full"
            icon={<ArrowRight className="w-4 h-4" />}
            loading={loading}
          />
          <GhostButton
            type="button"
            title="Use Demo Credentials"
            className="w-full"
            onClick={handleDemoLogin}
            icon={<Lock className="w-4 h-4" />}
            disabled={loading}
          />
        </div>
      </form>
    </Form>
  );
};
