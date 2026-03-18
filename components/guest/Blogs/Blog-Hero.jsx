import { cn } from "@/lib/utils";

export function BlogHero() {

  return (
    <section className="bg-primary-dark">
      <div className="mx-auto flex max-w-7xl flex-col px-4 pt-24 pb-16 sm:px-6 sm:pt-28 lg:px-8">
        <div className="max-w-3xl">
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-full bg-background/20 px-3 py-2 text-xs font-bold uppercase tracking-wide text-background sm:text-sm"
            )}
          >
            <span>INSIGHTS & UPDATES</span>
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-tight text-background drop-shadow-sm sm:text-5xl md:text-6xl lg:text-7xl">
            Industry Blogs
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-background/70 sm:text-xl">
          Stay informed with the latest news, tips, and insights from the trucking and logistics industry
          </p>
        </div>
      </div>
    </section>
  );
}
