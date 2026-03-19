import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const CONTACT_CARDS = [
  {
    icon: "Phone",
    title: "Phone",
    primary: "(555) 123-4567",
    secondary: "Mon-Fri 8am-8pm CST",
  },
  {
    icon: "Mail",
    title: "Email",
    primary: "info@dispatchpro.com",
    secondary: "We reply within 24 hours",
  },
  {
    icon: "MapPin",
    title: "Office",
    primary: "123 Logistics Ave",
    secondary: "Houston, TX 77001",
  },
  {
    icon: "Clock",
    title: "Support Hours",
    primary: "24/7 Availability",
    secondary: "Round-the-clock assistance",
  },
];

const ICON_MAP = {
  Phone,
  Mail,
  MapPin,
  Clock,
};

export function ContactDetailCards() {
  return (
    <section className="relative z-20 mx-auto -mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CONTACT_CARDS.map((card) => {
          const Icon = ICON_MAP[card.icon] || Phone;
          return (
            <article
              key={card.title}
              className={cn(
                "rounded-xl border border-border bg-card p-6 shadow-lg",
                "transition-shadow hover:shadow-xl"
              )}
            >
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/15">
                <Icon className="size-6 text-primary-dark" aria-hidden />
              </div>
              <h2 className="mt-4 text-md font-bold">
                {card.title}
              </h2>
              <p className="mt-2 text-sm font-bold text-foreground">
                {card.primary}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {card.secondary}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
