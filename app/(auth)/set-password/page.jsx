"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";

const setPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function FieldLabel({ icon: Icon, children, required }) {
  return (
    <div className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
      {Icon && <Icon className="size-4 text-primary" aria-hidden />}
      <span>{children}</span>
      {required && <span className="text-secondary">*</span>}
    </div>
  );
}

export default function SetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (values) => {
    if (!token) {
      toast.error("Invalid link. No token found.");
      return;
    }
    try {
      const { data } = await api.post("/api/auth/set-password", {
        token,
        password: values.password,
      });
      toast.success(data.message);
      setDone(true);
      setTimeout(() => router.push("/signin"), 2000);
    } catch {
      /* axios interceptor handles error toasts */
    }
  };

  if (!token) {
    return (
      <div className="rounded-2xl bg-background p-3">
        <h3 className="text-2xl font-bold text-foreground">Invalid Link</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This link is invalid or has expired. Please request a new one.
        </p>
        <Link
          href="/forget-password"
          className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary-dark hover:underline"
        >
          <ArrowLeft className="size-3" /> Request new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-background p-3">
        <h3 className="text-2xl font-bold text-foreground">Password Set!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Redirecting you to sign in...
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-background p-3">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-foreground">Set Your Password</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a secure password for your account
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <FieldLabel icon={Lock} required>
            New Password
          </FieldLabel>
          <Input
            type="password"
            placeholder="********"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <FieldLabel icon={Lock} required>
            Confirm Password
          </FieldLabel>
          <Input
            type="password"
            placeholder="********"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="gradient mt-2 h-12 w-full text-sm font-bold text-background"
        >
          Set Password
        </Button>

        <p className="mt-2 flex justify-center border-t border-gray-200 pt-6">
          <Link
            href="/signin"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:underline"
          >
            <ArrowLeft className="size-3" />
            Back to Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
