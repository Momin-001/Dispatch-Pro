import { cn } from "@/lib/utils";

export function RoleDetailStatCards({ data = [] }) {

  return (
    <section className="relative z-20 mx-auto -mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data?.map((card) => (
          <article
            key={`${card.value}-${card.label}`}
            className={cn(
              "rounded-xl border border-border bg-card px-5 py-6 text-center shadow-lg",
              "transition-shadow hover:shadow-xl sm:px-6 sm:py-8"
            )}
          >
            <p className="text-2xl font-bold text-primary-dark sm:text-3xl">
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
