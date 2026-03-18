import Image from "next/image";
import { CircleCheckBig } from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    title: "Optimization",
    description: "Smart route planning and load optimization",
  },
  {
    title: "Reliability",
    description: "Consistent on-time performance and support",
  },
  {
    title: "Support",
    description: "24/7 dedicated dispatch team availability",
  },
];

// Add these 4 images to your public folder: why-choose-us-1.jpg, why-choose-us-2.jpg, why-choose-us-3.jpg, why-choose-us-4.jpg
const IMAGES = [
  "/why-choose-us-1.jpg", // top-left: warehouse
  "/why-choose-us-2.jpg", // top-right: port
  "/why-choose-us-3.jpg", // bottom-left: solar/trucks
  "/why-choose-us-4.jpg", // bottom-right: office
];

export function WhyChooseSection() {
  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">
          {/* Left: Badge, heading, description, feature points */}
          <div>
            <span
              className={cn(
                "inline-block rounded-lg bg-muted px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary",
                "sm:text-sm"
              )}
            >
              Why Choose Us
            </span>
            <h2 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Why Choose Us For Your Logistics Needs?
            </h2>
            <p className="mt-6 text-muted-foreground sm:text-lg">
              We provide comprehensive support and resources to help you
              succeed in the competitive logistics industry.
            </p>
            <ul className="mt-8 space-y-4">
              {FEATURES.map(({ title, description }) => (
                <li
                  key={title}
                  className="flex gap-4 rounded-xl bg-muted p-4 sm:p-5"
                >
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-background"
                    aria-hidden
                  >
                    <CircleCheckBig className="size-4" strokeWidth={3} />
                  </span>
                  <div>
                    <h3 className="font-bold text-foreground">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Staggered 2x2 image grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="relative aspect-4/3 overflow-hidden rounded-xl">
                <Image
                  src={IMAGES[0]}
                  alt="Warehouse and logistics"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative aspect-4/3 overflow-hidden rounded-xl">
                <Image
                  src={IMAGES[1]}
                  alt="Port and shipping"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </div>
            {/* Second row staggered to the right */}
            <div className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:gap-4">
              <div className="relative aspect-4/3 overflow-hidden rounded-xl">
                <Image
                  src={IMAGES[2]}
                  alt="Fleet and operations"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative aspect-4/3 overflow-hidden rounded-xl">
                <Image
                  src={IMAGES[3]}
                  alt="Office and support"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
