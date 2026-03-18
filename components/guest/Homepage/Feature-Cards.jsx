import { ShieldCheck, Clock, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Load Protection",
    description:
      "Full insurance coverage and cargo protection for every shipment",
  },
  {
    icon: Clock,
    title: "Fast Dispatch",
    description:
      "Quick load assignment and route optimization for maximum efficiency",
  },
  {
    icon: Target,
    title: "On-time Delivery",
    description:
      "98% on-time delivery rate with real-time tracking and updates",
  },
];

export function FeatureCards() {
  return (
    <section className="relative z-20 mx-auto -mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <article
            key={title}
            className={cn(
              "flex flex-col rounded-xl border border-border bg-card p-6 text-card-foreground shadow-lg",
              "transition-shadow hover:shadow-xl"
            )}
          >
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
              <Icon className="size-6 text-primary" aria-hidden />
            </div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
