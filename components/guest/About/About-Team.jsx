import Image from "next/image";
import { cn } from "@/lib/utils";

const TEAM_MEMBERS = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVyc29ufGVufDB8fDB8fHww",
    name: "Michael Rodriguez",
    role: "Chief Executive Officer",
    description: "20+ years in logistics and transportation management",
  },
  {
    id: "2",
    image: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8fDB8fHww",
    name: "Sarah Johnson",
    role: "Chief Operations Officer",
    description:
      "Expert in supply chain optimization and fleet management",
  },
  {
    id: "3",
    image: "https://plus.unsplash.com/premium_photo-1678197937465-bdbc4ed95815?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGVyc29ufGVufDB8fDB8fHww",
    name: "David Chen",
    role: "Director of Technology",
    description:
      "Leading innovation in dispatch automation and AI systems",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVyc29ufGVufDB8fDB8fHww",
    name: "Emily Martinez",
    role: "Head of Customer Success",
    description:
      "Dedicated to ensuring exceptional driver and shipper experiences",
  },
];

export function AboutTeam() {
  return (
    <section className="bg-muted py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span
            className={cn(
              "inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-primary",
              "sm:text-sm"
            )}
          >
            Leadership
          </span>
          <h2 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
            Meet Our Team
          </h2>
          <p className="mt-4 text-foreground/80 sm:text-lg">
            Industry veterans committed to your success
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM_MEMBERS.map((member) => (
            <article
              key={member.id}
              className="overflow-hidden rounded-xl border border-border bg-card text-left shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={member.image}
                  alt=""
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-foreground">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm font-semibold text-secondary">
                  {member.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {member.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
