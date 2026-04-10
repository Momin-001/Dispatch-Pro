"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast } from "sonner";
import { User, Phone, Mail, Building2, ChartColumn, Truck, ChevronRight, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";

const shipperApplicationSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+1\d{10}$/u, "Enter a valid US phone number"),
  email: z.string().email("Enter a valid email address"),
  companyName: z
    .string()
    .min(2, "Company name is required"),
  monthlyLoads: z
    .string()
    .min(1, "Monthly loads is required")
    .regex(/^\d{1,8}$/u, "Enter up to 8 numeric digits for monthly loads"),
  equipmentType: z.string().min(1, "Equipment type is required"),
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

export function ShipperApplicationForm({ data }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(shipperApplicationSchema),
    defaultValues: {
      fullName: "",
      phone: "+1",
      email: "",
      companyName: "",
      monthlyLoads: "",
      equipmentType: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post("/api/auth/register", {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        role: "shipper",
        companyName: values.companyName,
        monthlyLoadEstimate: values.monthlyLoads,
        equipmentType: values.equipmentType,
      });
      toast.success(data.message);
      reset();
    } catch {
      /* axios interceptor handles error toasts */
    }
  };

  return (
    <div className="rounded-2xl bg-background p-6 shadow-xl sm:p-8">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-foreground">Shipper Application</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill out the form below to get started
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Full name */}
        <div>
          <FieldLabel icon={User} required>
            Full Name
          </FieldLabel>
          <Input
            placeholder="John Smith"
            autoComplete="name"
            aria-invalid={!!errors.fullName}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        {/* Phone + Email row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel icon={Phone} required>
              Phone Number
            </FieldLabel>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  international
                  defaultCountry="US"
                  countryCallingCodeEditable={false}
                  className={cn(
                    "phone-input-wrapper flex h-10 w-full items-center rounded-lg border border-input bg-transparent px-2 text-sm shadow-xs",
                    errors.phone && "border-destructive"
                  )}
                  inputComponent={Input}
                  {...field}
                />
              )}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>
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
        </div>

        {/* Company name */}
        <div>
          <FieldLabel icon={Building2} required>
            Company Name
          </FieldLabel>
          <Input
            placeholder="Enter your company name"
            aria-invalid={!!errors.companyName}
            {...register("companyName")}
          />
          {errors.companyName && (
            <p className="mt-1 text-xs text-destructive">{errors.companyName.message}</p>
          )}
        </div>

        {/* Years + equipment */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel icon={Truck} required>
              Equipment Type
            </FieldLabel>
            <Input
              placeholder="e.g. Dry Van, Reefer, Flatbed"
              aria-invalid={!!errors.equipmentType}
              {...register("equipmentType")}
            />
            {errors.equipmentType && (
              <p className="mt-1 text-xs text-destructive">
                {errors.equipmentType.message}
              </p>
            )}
          </div>
          <div>
            <FieldLabel icon={ChartColumn} required>
              Average Monthly Loads
            </FieldLabel>
            <Input
              inputMode="numeric"
              maxLength={8}
              placeholder="e.g. 5"
              aria-invalid={!!errors.monthlyLoads}
              {...register("monthlyLoads")}
            />
            {errors.monthlyLoads && (
              <p className="mt-1 text-xs text-destructive">
                {errors.monthlyLoads.message}
              </p>
            )}
          </div>

        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="gradient mt-2 flex h-12 w-full items-center justify-center gap-2 text-sm font-bold text-background"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Submitting...
            </>
          ) : (
            <>
              {data.label} <ChevronRight className="size-4" />
            </>
          )}
        </Button>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          By submitting this form, you agree to our{" "}
          <span className="font-medium">Terms of Service</span> and{" "}
          <span className="font-medium">Privacy Policy</span>.
        </p>
      </form>
    </div>
  );
}
