import {
  CircleCheckBig,
  DollarSign,
  Home,
  Shield,
  Truck,
  Clock,
  Eye,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  DollarSign,
  Home,
  Shield,
  Truck,
  Clock,
  Eye,
  Smartphone,
};

function CardIcon({ name }) {
  const Icon = (name && ICON_MAP[name]) || Shield;
  return <Icon className="size-6 text-primary-dark" aria-hidden />;
}

export function RoleWhyChoose({ data }) {
  const { title, description, cards = [] } = data;

  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">{description}</p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.title}
              className={cn(
                "flex flex-col rounded-xl border border-border bg-card p-6 shadow-md",
                "sm:p-8"
              )}
            >
              <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                <CardIcon name={card.icon} />
              </div>
              <h3 className="mt-5 text-xl font-bold text-foreground">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {card.description}
              </p>
              <ul className="mt-6 space-y-3">
                {(card.points || []).map((point, i) => (
                  <li key={i} className="flex gap-3 text-sm text-foreground">
                    <CircleCheckBig
                      className="mt-0.5 size-5 shrink-0 text-emerald-600"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
