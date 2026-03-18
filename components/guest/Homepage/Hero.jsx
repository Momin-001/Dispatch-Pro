import Link from "next/link";
import { ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden sm:min-h-[90vh]">
      {/* Background image */}
      <Image
        className="absolute inset-0 object-cover bg-center bg-no-repeat"
        src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop"
        alt="Hero Background"
        fill
        aria-hidden
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary-dark/50" aria-hidden />
      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-4 pt-24 pb-32 sm:min-h-[90vh] sm:px-6 sm:pt-28 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold leading-tight text-background drop-shadow-sm sm:text-5xl md:text-6xl lg:text-7xl">
            Smarter Dispatch.
            <br />
            Safer Drivers.
            <br />
            Complete Visibility.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-background/95 sm:text-xl">
            We connect trucking professionals with high-paying loads, handle
            documentation, ensure compliance, and provide reliable operational
            support.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button variant="destructive" size="lg" asChild>
              <Link href="/signup" className="inline-flex items-center gap-2">
                Register Now
                <ChevronRight className="size-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-background/80 bg-transparent text-background hover:bg-background/10 hover:text-background"
            >
              <Play className="size-5" aria-hidden />
              Watch Video
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
