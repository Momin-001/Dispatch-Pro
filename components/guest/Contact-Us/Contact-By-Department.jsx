import { Headphones, MessagesSquare, FileText, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const DEPARTMENT_CONTACTS = [
  {
    icon: "Headphones",
    title: "Driver Support",
    description: "Questions about loads, routes, or daily operations",
    email: "drivers@dispatchpro.com",
    phone: "(555) 123-4567",
    phoneHref: "tel:+15551234567",
  },
  {
    icon: "MessagesSquare",
    title: "Shipper Inquiries",
    description: "Freight quotes and shipping solutions",
    email: "shippers@dispatchpro.com",
    phone: "(555) 123-4568",
    phoneHref: "tel:+15551234568",
  },
  {
    icon: "FileText",
    title: "Billing & Payments",
    description: "Invoice questions and payment processing",
    email: "billing@dispatchpro.com",
    phone: "(555) 123-4569",
    phoneHref: "tel:+15551234569",
  },
];

const ICON_MAP = {
  Headphones,
  MessagesSquare,
  FileText,
};

export function ContactByDepartment() {
  return (
    <section className="bg-muted/40 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <span
            className={cn(
              "inline-flex items-center rounded-full bg-primary/10 px-4 py-2",
              "text-xs font-bold uppercase tracking-wide text-primary sm:text-sm"
            )}
          >
            Specialized Support
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Contact by Department
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Get in touch with the right team for faster assistance
          </p>
        </header>

        <div className="mt-12 grid gap-6 md:grid-cols-3 md:gap-8">
          {DEPARTMENT_CONTACTS.map((dept) => {
            const Icon = ICON_MAP[dept.icon] || Headphones;
            return (
              <article
                key={dept.title}
                className={cn(
                  "rounded-xl border border-border bg-card p-6 shadow-lg",
                  "transition-shadow hover:shadow-xl"
                )}
              >
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-6 text-primary-dark" aria-hidden />
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">
                  {dept.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {dept.description}
                </p>

                <ul className="mt-6 space-y-3 text-sm">
                  <li>
                    <a
                      href={`mailto:${dept.email}`}
                      className="inline-flex items-center gap-2 font-medium text-primary-dark underline-offset-4 hover:underline"
                    >
                      <Mail className="size-4 shrink-0" aria-hidden />
                      {dept.email}
                    </a>
                  </li>
                  <li>
                    <a
                      href={dept.phoneHref}
                      className="inline-flex items-center gap-2 font-medium text-primary-dark underline-offset-4 hover:underline"
                    >
                      <Phone className="size-4 shrink-0" aria-hidden />
                      {dept.phone}
                    </a>
                  </li>
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
