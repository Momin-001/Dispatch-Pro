import { cn } from "@/lib/utils";

export function AboutStat() {

    const data = [
        {
            value: "5+",
            label: "Years of Experience",
        },
        {
            value: "500+",
            label: "Active Partners",
        },
        {
            value: "98%",
            label: "On-Time Rate",
        },
        {
            value: "24/7",
            label: "Support Available",
        },
    ];
  return (
    <section className="relative z-20 mx-auto -mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data?.map((card) => (
          <article
            key={`${card.value}-${card.label}`}
            className={cn(
              "rounded-xl border border-border bg-card px-5 py-6 text-center shadow-lg",
              "transition-shadow hover:shadow-xl sm:px-6 sm:py-8"
            )}
          >
            <p className="text-3xl font-bold text-primary-dark sm:text-4xl">
              {card.value}
            </p>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              {card.label}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
