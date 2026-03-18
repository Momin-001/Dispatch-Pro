import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Dummy data — replace with CMS / API when admin blog is wired */
const DUMMY_NEWS = [
  {
    id: "1",
    slug: "optimizing-dispatch-operations",
    image:
      "/news-1.jpg",
    date: "February 20, 2026",
    title: "Optimizing Dispatch Operations for Maximum Efficiency",
    description:
      "Learn the latest strategies for improving load management and driver coordination.",
  },
  {
    id: "2",
    slug: "future-of-modern-logistics",
    image:
      "/news-2.jpg",
    date: "February 18, 2026",
    title: "The Future of Modern Logistics: Technology Trends",
    description:
      "Discover how technology is revolutionizing the transportation industry.",
  },
  {
    id: "3",
    slug: "safety-and-driver-rewards",
    image:
      "/news-3.jpg",
    date: "February 15, 2026",
    title: "Why Safety And Driver Rewards Matter",
    description:
      "Understanding the importance of safety protocols and driver incentive programs.",
  },
];

export function NewsSection() {
  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <span
          className={cn(
            "inline-block rounded-lg bg-muted px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary",
            "sm:text-sm"
          )}
        >
          Latest News
        </span>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            News May Help You
          </h2>
          <Link
            href="/blogs"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline sm:text-base"
          >
            View All
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {DUMMY_NEWS.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              <Link
                href={`/blogs/${item.slug}`}
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </Link>
              <div className="p-5">
                <time
                  dateTime={item.date}
                  className="text-sm text-muted-foreground"
                >
                  {item.date}
                </time>
                <h3 className="mt-2 text-lg font-bold text-foreground">
                  <Link
                    href={`/blogs/${item.slug}`}
                    className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {item.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                  {item.description}
                </p>
                <Link
                  href={`/blogs/${item.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                >
                  Read More
                  <ChevronRight className="size-4" aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
