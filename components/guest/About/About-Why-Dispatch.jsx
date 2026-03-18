import { cn } from "@/lib/utils";
import { CheckCircle2, ShieldCheck, Clock, Route } from "lucide-react";
import Image from "next/image";

const POINTS = [
  {
    icon: CheckCircle2,
    title: "Premium Loads",
    description: "Access to high-paying freight opportunities",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock dispatch and customer service",
  },
  {
    icon: ShieldCheck,
    title: "Full Compliance",
    description: "Complete DOT and safety management",
  },
  {
    icon: Route,
    title: "Smart Routing",
    description: "AI-powered route and load optimization",
  },
];

export function AboutWhyDispatch() {
  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 lg:items-center">
          {/* Left: Image + bottom-right secondary badge */}
          <div className="relative">
            <div className="overflow-hidden aspect-4/3 rounded-2xl shadow-xl">
              <Image
                src="/about-why-dispatch.jpg"
                alt="About Why Dispatch Image"
                fill
                className="object-cover rounded-2xl"
                priority={false}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="absolute -bottom-8 -right-8 rounded-xl bg-secondary px-6 py-8 text-center shadow-lg">
              <p className="text-2xl text-left font-bold text-background">99.5%</p>
              <p className="mt-1 text-sm font-semibold text-background/90">
                Client Satisfaction Rate
              </p>
            </div>

          </div>

          {/* Right: badge + title + description + points */}
          <div>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary-dark sm:text-sm">
              WHY DISPATCHPRO
            </span>

            <h2 className="mt-5 text-3xl font-bold text-foreground sm:text-4xl">
              Your Success is Our Priority
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground/80 sm:text-base">
              We combine industry expertise, advanced technology, and
              personalized service to deliver exceptional results. Here&apos;s
              what sets us apart:
            </p>

            <div className="mt-8 space-y-4">
              {POINTS.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.title}
                    className="flex gap-4 rounded-xl bg-muted/60 p-5"
                  >
                    <div className="flex size-12 items-center justify-center rounded-lg bg-primary-dark text-background">
                      <Icon className="size-6" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-foreground">
                        {p.title}
                      </h3>
                      <p className="mt-1 text-sm text-foreground/80">
                        {p.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

