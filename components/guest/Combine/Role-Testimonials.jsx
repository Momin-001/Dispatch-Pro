import { Award } from "lucide-react";
import { cn } from "@/lib/utils";

const RATING_COUNT = 5;

function initialsFromName(name) {
  if (!name || typeof name !== "string") return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) {
    const w = parts[0];
    return w.length >= 2
      ? (w[0] + w[1]).toUpperCase()
      : w[0].toUpperCase();
  }
  return (
    parts[0][0] + parts[parts.length - 1][0]
  ).toUpperCase();
}

export function RoleTestimonials({ data }) {
  const { title, description, items = [] } = data;

  return (
    <section className="bg-muted py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">{description}</p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.name + item.quote.slice(0, 20)}
              className={cn(
                "flex flex-col rounded-xl border border-border bg-card p-6 shadow-md"
              )}
            >
              <div className="flex gap-1" aria-label="5 out of 5">
                {Array.from({ length: RATING_COUNT }).map((_, i) => (
                  <Award
                    key={i}
                    className="size-5 fill-amber-400 text-amber-500"
                    aria-hidden
                  />
                ))}
              </div>
              <blockquote className="mt-5 flex-1 text-foreground/70">
                <p className="text-sm italic leading-relaxed sm:text-base">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <div
                  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-dark text-sm font-bold text-background"
                  aria-hidden
                >
                  {initialsFromName(item.name)}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.roleLine}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
