import Link from "next/link";
import { CircleCheckBig, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * @param {{ data: {
 *   title: string,
 *   description: string,
 *   features: { title: string, description: string }[],
 *   ctaBox: {
 *     title: string,
 *     description: string,
 *     innerTitle: string,
 *     points: string[],
 *     button: { label: string, href: string }
 *   }
 * } }} props
 */
export function RoleSplitRequirementsTraining({ data }) {
  const { title, description, features = [], ctaBox } = data;
  const {
    title: ctaTitle,
    description: ctaDesc,
    innerTitle,
    points = [],
    button,
  } = ctaBox || {};

  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 lg:items-start">
          {/* Left: requirements checklist */}
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
                  <CircleCheckBig
                    className="mt-0.5 size-6 shrink-0 text-primary-dark"
                    
                    aria-hidden
                  />
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

          {/* Right: gradient + inner panel + CTA */}
          <div
            className={cn(
              "gradient flex flex-col rounded-2xl p-8 shadow-xl sm:p-10 lg:sticky lg:top-28"
            )}
          >
            <h3 className="text-2xl font-bold text-background sm:text-3xl">
              {ctaTitle}
            </h3>
            <p className="mt-3 text-background/90 sm:text-lg">{ctaDesc}</p>

            <div className="mt-8 rounded-xl bg-background/10 p-5 sm:p-6">
              <h4 className="font-bold text-background">{innerTitle}</h4>
              <ul className="mt-4 space-y-3">
                {points.map((point, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm text-background sm:text-base"
                  >
                    <ChevronRight
                      className="mt-0.5 size-4 shrink-0 text-background/70"
                      aria-hidden
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {button?.label && button?.href && (
              <Button
                variant="destructive"
                size="lg"
                asChild
                className="mt-8 w-full sm:w-auto"
              >
                <Link href={button.href}>{button.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
