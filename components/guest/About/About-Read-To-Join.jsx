import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AboutReadToJoin() {
  return (
    <section className="bg-primary-dark/95 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold leading-tight text-background sm:text-5xl">
            Ready to Join Our Network?
          </h2>
          <p className="mt-4 text-base text-background/80 sm:text-lg">
            Experience the difference of working with a dispatch service that
            truly cares about your success.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button variant="destructive" size="lg" asChild>
              <Link href="/signup">Get Started Today</Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

