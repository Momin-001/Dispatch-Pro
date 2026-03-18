import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function FAQHero() {
  return (
    <section className="bg-primary-dark">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 pt-24 pb-16 text-center sm:px-6 sm:pt-28 lg:px-8">
        <span className="inline-flex items-center rounded-full bg-background/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-background sm:text-sm">
          Help Center
        </span>

        <h1 className="mt-6 text-4xl font-bold leading-tight text-background sm:text-5xl md:text-6xl">
          Frequently Asked
          <br />
          Questions
        </h1>

        <p className="mt-6 max-w-2xl text-base text-background/80 sm:text-lg">
          Find answers to common questions about our services and operations
        </p>

        <div className="mt-10 w-full max-w-2xl">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              placeholder="Search for answers..."
              className="h-14 bg-background pl-12"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

