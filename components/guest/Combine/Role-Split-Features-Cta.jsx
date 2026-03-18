import Link from "next/link";
import {
  Smartphone,
  MapPin,
  FileText,
  Fuel,
  Tablet,
  Users,
  ChartColumn,
  Headphones,
  Bell,
  CircleCheckBig,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FEATURE_ICONS = {
  Smartphone,
  Tablet,
  Users,
  ChartColumn,
  Headphones,
  MapPin,
  FileText,
  Fuel,
  Bell,
};

function FeatureIcon({ name }) {
  const Icon = (name && FEATURE_ICONS[name]) || Smartphone;
  return <Icon className="size-6 text-primary" aria-hidden />;
}

export function RoleSplitFeaturesCta({ data }) {
  const { title, description, features = [], ctaBox } = data;
  const { title: ctaTitle, description: ctaDesc, points = [], button } = ctaBox || {};

  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 lg:items-start">
          {/* Left: title + features */}
          <div>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-muted-foreground sm:text-lg">
              {description}
            </p>
            <ul className="mt-10 space-y-8">
              {features.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <FeatureIcon name={item.icon} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: gradient CTA */}
          <div
            className={cn(
              "gradient rounded-2xl p-8 shadow-xl sm:p-10 lg:sticky lg:top-28"
            )}
          >
            <h3 className="text-2xl font-bold text-background sm:text-3xl">
              {ctaTitle}
            </h3>
            <p className="mt-3 text-background/80 sm:text-lg">{ctaDesc}</p>
            <ul className="mt-8 space-y-4">
              {points.map((point, i) => (
                <li key={i} className="flex gap-3 text-background">
                  <CircleCheckBig
                    className="mt-0.5 size-5 shrink-0 text-background"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span className="text-sm sm:text-base">{point}</span>
                </li>
              ))}
            </ul>
            {button?.label && button?.href && (
              <Button variant="secondary" size="lg" asChild className="mt-10 w-full">
                <Link href={button.href}>{button.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
