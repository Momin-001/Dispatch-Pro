"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const signInSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
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

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = () => {
    toast.success("Sign in successful");
  };

  return (
    <div className="rounded-2xl bg-background p-3">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-foreground">Sign In</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <FieldLabel icon={Mail} required>
            Email Address
          </FieldLabel>
          <Input
            type="email"
            placeholder="john@email.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div>
          <FieldLabel icon={Lock} required>
            Password
          </FieldLabel>
          <Input
            type="password"
            placeholder="********"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>
        <div className="flex justify-end">
          <Link href="/forget-password" className="font-semibold text-xs hover:underline text-primary-dark">
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="gradient mt-2 h-12 w-full text-sm font-bold text-background"
        >
          Sign in
        </Button>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          Don't have an account? <Link href="/register" className="font-bold hover:underline text-primary-dark">Create account</Link>
        </p>
        <p className="mt-2 border-t flex justify-center border-gray-200 pt-6">
          <Link href="/" className="flex text-xs hover:underline items-center gap-2 text-muted-foreground">
            <ArrowLeft className="size-3" />
            Back to Homepage
          </Link>
        </p>
      </form>
    </div>
  );
}
