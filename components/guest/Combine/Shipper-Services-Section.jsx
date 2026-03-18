import { Truck, Package, Timer, Target, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  Truck,
  Package,
  Timer,
  Target,
};

function ServiceIcon({ name }) {
  const Icon = (name && ICON_MAP[name]) || Package;
  return <Icon className="size-6 text-primary" aria-hidden />;
}

/**
 * Shippers-only: comprehensive shipping services grid.
 *
 * @param {{ data: {
 *   title: string,
 *   description: string,
 *   services: { icon: string, title: string, description: string, points: string[] }[]
 * } }} props
 */
export function ShipperServicesSection({ data }) {
  const { title, description, services = [] } = data;

  return (
    <section className="bg-muted py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">{description}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {services.map((svc) => (
            <article
              key={svc.title}
              className={cn(
                "rounded-xl border border-border bg-background p-6 shadow-sm",
                "sm:p-8"
              )}
            >
              <div className="flex gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <ServiceIcon name={svc.icon} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-semibold text-foreground">
                    {svc.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                    {svc.description}
                  </p>
                  <ul className=" space-y-2.5 pt-6">
                    {(svc.points || []).map((point, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-foreground"
                      >
                        <ChevronRight
                          className="mt-0.5 size-4 shrink-0 text-primary"
                          aria-hidden
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
