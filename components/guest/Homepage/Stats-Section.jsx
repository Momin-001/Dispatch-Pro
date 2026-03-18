const STATS = [
  { value: "348k", label: "Loads Delivered" },
  { value: "499k", label: "Miles Driven" },
  { value: "150+", label: "Active Partners" },
  { value: "99%", label: "Client Satisfaction" },
];

const RED_DOTS_COUNT = 5;

export function StatsSection() {
  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Testimonial */}
        <blockquote className="mx-auto max-w-3xl text-center">
          <p className="text-lg italic text-muted-foreground sm:text-xl">
            &ldquo;Always reliable and on time! Their exceptional service is
            recommended by thousands of satisfied customers globally.&rdquo;
          </p>
        </blockquote>

        {/* 5 small red circles */}
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: RED_DOTS_COUNT }).map((_, i) => (
            <span
              key={i}
              className="size-2 rounded-full bg-secondary"
              aria-hidden
            />
          ))}
        </div>

        {/* Stats grid */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
                {value}
              </p>
              <p className="mt-2 text-sm font-medium capitalize text-muted-foreground sm:text-base">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
