import Link from "next/link";
import Image from "next/image";
import { ChevronRight, CircleCheckBig } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FEATURES = [
  "Experienced Dispatch Professionals",
  "24/7 Support & Communication",
  "Nationwide Load Coverage",
];

export function AboutSection() {
  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">
          {/* Left: Image with overlay card */}
          <div className="relative">
            <div className="relative aspect-4/3 overflow-hidden rounded-xl sm:aspect-16/10">
              <Image
                src="/about.jpg"
                alt="Logistics warehouse interior"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Overlay card - bottom right of image */}
            <div
              className={cn(
                "absolute bottom-4 right-4 rounded-xl border-t-4 border-secondary bg-card px-6 py-5 shadow-lg",
                "sm:-bottom-6 sm:-right-6 sm:px-8 sm:py-6"
              )}
            >
              <p className="text-3xl font-bold text-primary-dark sm:text-4xl">
                250+
              </p>
              <p className="mt-1 text-sm font-medium text-primary-dark sm:text-base">
                Active Drivers
              </p>
            </div>
          </div>

          {/* Right: Copy + list + CTA */}
          <div>
            <span
              className={cn(
                "inline-block rounded-lg bg-muted px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary",
                "sm:text-sm"
              )}
            >
              About Us
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
              We Drive Your Business Towards Destination
            </h2>
            <p className="mt-6 text-muted-foreground sm:text-lg">
              In the logistics industry, we provide comprehensive dispatch
              services that help drivers and owner-operators maximize their
              earning potential while ensuring compliance and operational
              excellence.
            </p>
            <ul className="mt-8 space-y-4">
              {FEATURES.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-background"
                    aria-hidden
                  >
                    <CircleCheckBig className="size-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Button variant="destructive" size="lg" asChild>
                <Link href="/contact" className="inline-flex items-center gap-2">
                  Learn More
                  <ChevronRight className="size-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
