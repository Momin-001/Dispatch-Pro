import Image from "next/image";
import { Target, Eye } from "lucide-react";

export function AboutMission() {
  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Left */}
        <div>
          <div className="flex gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary-dark text-background">
              <Target className="size-6" aria-hidden />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                Our Mission
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80 sm:text-base">
                To empower drivers and owner-operators with cutting-edge dispatch
                services that maximize earnings, ensure compliance, and provide
                peace of mind. We connect quality freight with professional
                carriers while delivering unparalleled service to shippers
                nationwide.
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-background">
              <Eye className="size-6" aria-hidden />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                Our Vision
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80 sm:text-base">
                To become the most trusted and innovative dispatch service in
                North America, setting new standards for operational excellence,
                driver satisfaction, and technological advancement in the
                logistics industry.
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="relative overflow-hidden rounded-2xl">
          <Image
            src="/about-mission.jpg"
            alt=""
            width={1200}
            height={900}
            className="h-auto w-full object-cover"
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}

