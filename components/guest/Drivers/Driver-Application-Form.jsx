"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast } from "sonner";
import { User, Phone, Mail, IdCard, Clock, Truck, FileText, ChevronRight, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";

const driverApplicationSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+1\d{10}$/u, "Enter a valid US phone number"),
  email: z.string().email("Enter a valid email address"),
  cdlNumber: z
    .string()
    .min(1, "CDL number is required")
    .regex(/^\d+$/, "CDL number must contain digits only"),
  yearsExperience: z
    .string()
    .min(1, "Years of experience is required")
    .regex(/^\d{1,2}$/u, "Enter up to 2 digits for years of experience"),
  equipmentType: z.string().min(1, "Equipment type is required"),
  cdlFile: z
    .any()
    .refine((fileList) => fileList instanceof FileList && fileList.length === 1, {
      message: "Please upload your CDL document",
    })
    .refine((fileList) => {
      if (!(fileList instanceof FileList) || fileList.length !== 1) return false;
      const file = fileList[0];
      const allowed = ["application/pdf", "image/jpeg", "image/png"];
      return allowed.includes(file.type);
    }, "File must be PDF, JPG, or PNG")
    .refine((fileList) => {
      if (!(fileList instanceof FileList) || fileList.length !== 1) return false;
      const file = fileList[0];
      return file.size <= 5 * 1024 * 1024;
    }, "File must be 5MB or smaller"),
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

export function DriverApplicationForm() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(driverApplicationSchema),
    defaultValues: {
      fullName: "",
      phone: "+1",
      email: "",
      cdlNumber: "",
      yearsExperience: "",
      equipmentType: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const fd = new FormData();
      fd.append("fullName", values.fullName);
      fd.append("email", values.email);
      fd.append("phone", values.phone);
      fd.append("role", "driver");
      fd.append(
        "meta",
        JSON.stringify({
          cdlNumber: values.cdlNumber,
          yearsExperience: values.yearsExperience,
          equipmentType: values.equipmentType,
        })
      );
      if (values.cdlFile?.[0]) {
        fd.append("file", values.cdlFile[0]);
      }

      const { data } = await api.post("/api/auth/register", fd);
      toast.success(data.message);
      reset();
    } catch {
      /* axios interceptor handles error toasts */
    }
  };

  return (
    <div className="rounded-2xl bg-background p-6 shadow-xl sm:p-8">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-foreground">Driver Application</h3>
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

        {/* CDL number */}
        <div>
          <FieldLabel icon={IdCard} required>
            CDL Number
          </FieldLabel>
          <Input
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter your CDL number"
            aria-invalid={!!errors.cdlNumber}
            {...register("cdlNumber")}
          />
          {errors.cdlNumber && (
            <p className="mt-1 text-xs text-destructive">{errors.cdlNumber.message}</p>
          )}
        </div>

        {/* Years + equipment */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel icon={Clock} required>
              Years of Experience
            </FieldLabel>
            <Input
              inputMode="numeric"
              maxLength={2}
              placeholder="e.g. 5"
              aria-invalid={!!errors.yearsExperience}
              {...register("yearsExperience")}
            />
            {errors.yearsExperience && (
              <p className="mt-1 text-xs text-destructive">
                {errors.yearsExperience.message}
              </p>
            )}
          </div>
          <div>
            <FieldLabel icon={Truck} required>
              Equipment Type
            </FieldLabel>
            <Input
              placeholder="e.g. Dry van, Reefer"
              aria-invalid={!!errors.equipmentType}
              {...register("equipmentType")}
            />
            {errors.equipmentType && (
              <p className="mt-1 text-xs text-destructive">
                {errors.equipmentType.message}
              </p>
            )}
          </div>
        </div>

        {/* Upload CDL */}
        <div>
          <FieldLabel icon={FileText} required>
            Upload CDL
          </FieldLabel>
          <Input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            aria-invalid={!!errors.cdlFile}
            {...register("cdlFile")}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            PDF, JPG, or PNG • Max 5MB
          </p>
          {errors.cdlFile && (
            <p className="mt-1 text-xs text-destructive">
              {errors.cdlFile.message?.toString?.() ?? "Invalid file"}
            </p>
          )}
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
              Submit Application <ChevronRight className="size-4" />
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
