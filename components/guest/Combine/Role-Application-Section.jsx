import { cn } from "@/lib/utils";
import { CircleCheckBig, Phone } from "lucide-react";

export function RoleApplicationSection({ data, children }) {
  const { badge, title, description, features = [], contactBox } = data;

  return (
    <section className="gradient py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
          {/* Left column */}
          <div>
            <div className="inline-flex items-center rounded-full bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-background sm:text-sm">
              {badge.text}
            </div>
            <h2 className="mt-4 text-3xl font-bold text-background sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            <p className="mt-4 max-w-xl text-sm text-background/90 sm:text-base">
              {description}
            </p>

            <ul className="mt-8 space-y-6">
              {features.map((feature) => {
                return (
                  <li key={feature.title} className="flex gap-4">
                    <div className="mt-1 flex size-9 items-center justify-center rounded-lg bg-background/20">
                      <CircleCheckBig className="size-5 text-background" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-background">
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-sm text-background/80">
                        {feature.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div
              className={cn(
                "mt-10 rounded-2xl bg-background/10 p-5 border border-background/20 text-background sm:p-6"
              )}
            >
              <div className="flex items-center gap-2 text-sm font-semibold sm:text-base">
                <Phone className="size-4" aria-hidden />
                <span>{contactBox.heading}</span>
              </div>
              <p className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                {contactBox.phone}
              </p>
              <p className="mt-2 text-xs text-background/80 sm:text-sm">
                {contactBox.hours}
              </p>
            </div>
          </div>

          {/* Right column – page-specific form */}
          <div className="lg:pl-4">{children}</div>
        </div>
      </div>
    </section>
  );
}
