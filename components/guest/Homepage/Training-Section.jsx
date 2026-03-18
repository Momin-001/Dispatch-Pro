import Image from "next/image";
import { Truck, Crown, Headset, Package, Award, CircleCheckBig } from "lucide-react";
import { cn } from "@/lib/utils";

const CARDS = [
  {
    image: "/training-driver.jpg",
    icon: Truck,
    title: "Driver Training",
    subtitle: "DOT compliance & safety protocols",
  },
  {
    image: "/training-owner.jpg",
    icon: Crown,
    title: "Owner-Operator",
    subtitle: "Business & financial management",
  },
  {
    image: "/training-dispatcher.jpg",
    icon: Headset,
    title: "Dispatcher",
    subtitle: "Load negotiation & coordination",
  },
  {
    image: "/training-shipper.jpg",
    icon: Package,
    title: "Shipper",
    subtitle: "Supply chain optimization",
  },
];

const BENEFITS = [
  "Self-paced courses",
  "Expert instructors",
  "Certificate upon completion",
];

export function TrainingSection() {
  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <span
            className={cn(
              "inline-block rounded-lg bg-muted px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary",
              "sm:text-sm"
            )}
          >
            Professional Training
          </span>
          <h2 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Free Training Included With Membership
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground sm:text-lg">
            Get approved and unlock exclusive training programs designed for your role.
          </p>
        </div>

        {/* 4 cards */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {CARDS.map(({ image, icon: Icon, title, subtitle }) => (
            <article
              key={title}
              className="group relative aspect-square overflow-hidden rounded-xl"
            >
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
                <span className="mb-2 flex size-10 w-10 items-center justify-center rounded-lg bg-secondary text-background">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="text-lg font-bold text-background sm:text-xl">{title}</h3>
                <p className="mt-1 text-sm text-background/90">{subtitle}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom banner - gradient */}
        <div className="mt-12 rounded-xl gradient px-6 py-10 text-center sm:px-8 sm:py-12 lg:mt-16">
          <div className="mx-auto flex justify-center items-center gap-4">
            <span className="flex size-10 items-center justify-center rounded-full bg-background/20 text-background sm:size-14">
              <Award className="size-5 sm:size-7" aria-hidden />
            </span>
          
          <h3 className="text-2xl font-bold text-background sm:text-3xl">
            Training Access Included
          </h3>
          </div>
          <p className="mx-auto mt-2 max-w-3xl text-background/80 sm:text-lg">
            All approved members receive complimentary access to role-specific training programs.
          </p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            {BENEFITS.map((item) => (
              <li key={item} className="flex items-center gap-2 text-background/80">
                  <CircleCheckBig className="size-5" strokeWidth={3} />
                <span className="text-sm font-medium sm:text-base">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
