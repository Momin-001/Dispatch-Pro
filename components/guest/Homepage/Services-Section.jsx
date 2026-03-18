import { Package, FileText, MapPin, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const SERVICES = [
  {
    icon: Package,
    title: "Load Booking",
    description: "Access to premium loads with competitive rates",
  },
  {
    icon: FileText,
    title: "Documentation",
    description: "Fast paperwork processing and rate confirmations",
  },
  {
    icon: MapPin,
    title: "Route Planning",
    description: "Optimized routing for maximum efficiency",
  },
  {
    icon: Shield,
    title: "Compliance",
    description: "DOT compliance and safety management",
  },
];

export function ServicesSection() {
  return (
    <section className="bg-primary-dark py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <span
            className={cn(
              "inline-block rounded-lg bg-background/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-background/90",
              "sm:text-sm"
            )}
          >
            What We Offer
          </span>
          <h2 className="mt-4 text-3xl font-bold text-background sm:text-4xl lg:text-5xl">
            Our Services
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-background/80">
            Comprehensive dispatch solutions tailored to your needs.
          </p>
        </div>

        {/* Cards grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {SERVICES.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className={cn(
                "flex flex-col rounded-xl bg-background/10 p-6 shadow-lg",
                "border border-primary-dark/50"
              )}
            >
                <div className="mb-4 flex size-12 shrink-0 items-center justify-center rounded-lg border border-background/20 bg-primary">
                <Icon className="size-6 text-background" aria-hidden />
              </div>
              <h3 className="text-xl font-bold text-background">{title}</h3>
              <p className="mt-2 text-sm text-background/80">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
