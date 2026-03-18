import { Shield, Award, Users, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const VALUES = [
  {
    icon: "Shield",
    title: "Safety First",
    description:
      "Uncompromising commitment to driver safety and cargo security at every step",
  },
  {
    icon: "Award",
    title: "Excellence",
    description:
      "Delivering superior service quality that exceeds industry standards",
  },
  {
    icon: "Users",
    title: "Partnership",
    description:
      "Building lasting relationships based on trust and mutual success",
  },
  {
    icon: "TrendingUp",
    title: "Innovation",
    description:
      "Leveraging cutting-edge technology to optimize operations",
  },
];

const ICON_MAP = {
  Shield,
  Award,
  Users,
  TrendingUp,
};

export function AboutValues() {
  return (
    <section className="bg-muted py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span
            className={cn(
              "inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-primary",
              "sm:text-sm"
            )}
          >
            Our Values
          </span>
          <h2 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
          What Drives Us Forward
          </h2>
          <p className="mt-4 text-foreground/80 sm:text-lg">
          Our core values guide every decision we make and every relationship we build
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((item) => {
            const Icon = ICON_MAP[item.icon] || Shield;
            return (
              <article
                key={item.title}
                className="rounded-xl bg-card p-6 shadow-xl transition-shadow hover:shadow-md sm:p-7"
              >
                <div className="flex size-12 items-center justify-center rounded-lg gradient text-background">
                  <Icon className="size-6" aria-hidden />
                </div>
                <h3 className="mt-5 text-lg font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
