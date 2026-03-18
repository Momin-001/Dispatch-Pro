import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Truck, BriefcaseBusiness, CircleCheckBig, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function RoleDetailHero({ data }) {

  const {
    badge,
    title,
    description,
    cta,
    aside,
    backgroundImage,
  } = data;

  const ICON_MAP = {
    Truck,
    BriefcaseBusiness,
    User,
    CircleCheckBig,
  };

  function CardIcon({ name }) {
    const Icon = (name && ICON_MAP[name]) || Shield;
    return <Icon className="size-5 text-background" aria-hidden />;
  }

  const bgSrc = backgroundImage ?? "/role-hero-driver.jpg";

  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden sm:min-h-[90vh]">
      <Image
        className="absolute inset-0 object-cover"
        src={bgSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        aria-hidden
      />
      <div className="absolute inset-0 bg-primary-dark/50" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-4 pt-24 pb-36 sm:min-h-[90vh] sm:px-6 sm:pt-28 sm:pb-40 lg:px-8">
        <div className="max-w-3xl">
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-xs font-bold uppercase tracking-wide text-background sm:text-sm"
            )}
          >
            <CardIcon name={badge?.icon} />
            <span>{badge?.text}</span>
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-tight text-background drop-shadow-sm sm:text-5xl md:text-6xl lg:text-7xl">
            {title?.line1}
            <br />
            {title?.line2}
            <br />
            {title?.line3}
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-background/80 sm:text-xl">
            {description}
          </p>

          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-center">
            <Button variant="destructive" size="lg" asChild>
              <Link href={cta.href} className="inline-flex items-center gap-2">
                {cta.label}
                <ChevronRight className="size-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2 text-background">
              <CardIcon name={aside?.icon} />
              <span className="text-base font-semibold sm:text-lg">
                {aside.text}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
