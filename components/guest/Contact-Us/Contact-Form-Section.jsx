"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
/** Full phone input + country select wired to RHF (uses Controller internally). */
import PhoneNumberInput from "react-phone-number-input/react-hook-form";
import "react-phone-number-input/style.css";
import { MapPinned, Send } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const contactFormSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+1\d{10}$/u, "Enter a valid US phone number"),
  companyName: z.string().max(200),
  iam: z
    .string()
    .min(1, "Please tell us who you are")
    .max(200, "Please keep this under 200 characters"),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject is too long"),
  message: z
    .string()
    .min(10, "Please enter at least 10 characters")
    .max(5000, "Message is too long"),
});

const OFFICE_HOURS = [
  { label: "Monday - Friday", hours: "8:00 AM - 8:00 PM" },
  { label: "Saturday", hours: "9:00 AM - 5:00 PM" },
  { label: "Sunday", hours: "Closed" },
];

function FieldLabel({ children, required }) {
  return (
    <label className="mb-1.5 block text-sm font-bold text-foreground">
      {children}
      {required ? (
        <span className="text-secondary" aria-hidden>
          {" "}
          *
        </span>
      ) : null}
    </label>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-sm text-destructive" role="alert">
      {message}
    </p>
  );
}

export function ContactFormSection() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "+1",
      companyName: "",
      iam: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = () => {
    toast.success("Thanks! We'll get back to you within 24 hours.");
    reset();
  };

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Left: form */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-lg sm:p-8 lg:p-10">
            <span
              className={cn(
                "inline-flex items-center rounded-full bg-primary/10 px-4 py-2",
                "text-xs font-bold uppercase tracking-wide text-primary-dark sm:text-sm"
              )}
            >
              Send us a message
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Let&apos;s Start a Conversation
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Fill out the form below and our team will get back to you within
              24 hours.
            </p>

            <form
              className="mt-8 space-y-5"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <FieldLabel required>Full Name</FieldLabel>
                  <Input
                    placeholder="John Smith"
                    aria-invalid={!!errors.fullName}
                    {...register("fullName")}
                  />
                  <FieldError message={errors.fullName?.message} />
                </div>
                <div className="sm:col-span-1">
                  <FieldLabel required>Email Address</FieldLabel>
                  <Input
                    type="email"
                    placeholder="john@company.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    {...register("email")}
                  />
                  <FieldError message={errors.email?.message} />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <FieldLabel required>Phone Number</FieldLabel>
                  <PhoneNumberInput
                    name="phone"
                    control={control}
                    international
                    defaultCountry="US"
                    countryCallingCodeEditable={false}
                    className={cn(
                      "phone-input-wrapper flex h-10 w-full items-center rounded-lg border border-input bg-transparent px-2 text-sm shadow-xs",
                      errors.phone && "border-destructive"
                    )}
                    inputComponent={Input}
                  />
                  <FieldError message={errors.phone?.message} />
                </div>
                <div>
                  <FieldLabel>Company Name</FieldLabel>
                  <Input
                    placeholder="Your Company"
                    aria-invalid={!!errors.companyName}
                    {...register("companyName")}
                  />
                  <FieldError message={errors.companyName?.message} />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <FieldLabel required>I am a...</FieldLabel>
                  <Input
                    placeholder="e.g. Driver, Dispatcher, Shipper"
                    autoComplete="organization-title"
                    aria-invalid={!!errors.iam}
                    {...register("iam")}
                  />
                  <FieldError message={errors.iam?.message} />
                </div>
                <div>
                  <FieldLabel required>Subject</FieldLabel>
                  <Input
                    placeholder="How can we help?"
                    aria-invalid={!!errors.subject}
                    {...register("subject")}
                  />
                  <FieldError message={errors.subject?.message} />
                </div>
              </div>

              <div>
                <FieldLabel required>Your Message</FieldLabel>
                <Textarea
                  className="min-h-32 px-3.5 py-3"
                  placeholder="Tell us how we can help you..."
                  aria-invalid={!!errors.message}
                  {...register("message")}
                />
                <FieldError message={errors.message?.message} />
              </div>

              <Button
                type="submit"
                variant="destructive"
                size="lg"
                disabled={isSubmitting}
                className="w-full gap-2"
              >
                <Send className="size-5 text-background" aria-hidden />
                Send Message
              </Button>
            </form>
          </div>

          {/* Right: map placeholder + office hours */}
          <div className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
              <div
                className="relative min-h-[340px] flex justify-center items-center bg-muted/40"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, var(--border) 1px, transparent 1px),
                    linear-gradient(to bottom, var(--border) 1px, transparent 1px)
                  `,
                  backgroundSize: "80px 80px",
                }}
              >
                <div className="relative z-10 flex flex-col justify-center items-center px-6 pb-10 pt-8 text-center">
                    <MapPinned
                      className="size-14 text-primary"
                      aria-hidden
                    />
                  
                  <h3 className="mt-4 text-lg font-bold text-foreground">
                    Visit Our Office
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    123 Logistics Ave
                    <br />
                    Houston, TX 77001
                  </p>
                  <div className="size-6 shadow-xl mt-4 rounded-full bg-secondary">
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-primary-dark p-6 text-background shadow-lg sm:p-8">
              <h3 className="text-xl font-bold sm:text-2xl">Office Hours</h3>
              <ul className="mt-6 divide-y divide-background/20">
                {OFFICE_HOURS.map((row) => (
                  <li
                    key={row.label}
                    className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0"
                  >
                    <span className="font-medium text-background/95">
                      {row.label}
                    </span>
                    <span className="text-sm text-background/90 sm:text-base">
                      {row.hours}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-background/20 pt-4 text-sm">
                <span className="font-bold text-background/90">
                  Emergency Support: {" "}
                </span>
                <span className="text-background/70">Available 24/7 for active drivers</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
