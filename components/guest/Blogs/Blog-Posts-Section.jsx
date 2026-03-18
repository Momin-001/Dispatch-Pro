"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

/** Dummy data — replace with DB / API later */
const DUMMY_POSTS = [
  {
    id: "1",
    slug: "new-owner-operator-tips-2026",
    image: "https://plus.unsplash.com/premium_photo-1770141558666-b91192f6e116?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8VHJ1Y2tzJTIwYW5kJTIwbG9naXN0aWNzfGVufDB8fDB8fHww",
    date: "Feb 20, 2026",
    author: "John Martinez",
    category: "Driver Tips",
    isFeatured: true,
    title: "10 Essential Tips for New Owner-Operators in 2026",
    description:
      "Starting your journey as an owner-operator? Learn the key strategies to maximize profitability and build a sustainable trucking business.",
  },
  {
    id: "2",
    slug: "eld-mandate-updates",
    image: "https://plus.unsplash.com/premium_photo-1770146771112-50f69a94c522?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8VHJ1Y2tzJTIwYW5kJTIwbG9naXN0aWNzfGVufDB8fDB8fHww",
    date: "Feb 18, 2026",
    author: "Sarah Johnson",
    category: "Regulations",
    isFeatured: true,
    title: "Understanding the Latest ELD Mandate Updates",
    description:
      "Stay compliant with the newest electronic logging device regulations. Everything you need to know about the 2026 updates.",
  },
  {
    id: "3",
    slug: "ai-in-freight-dispatching",
    image: "https://images.unsplash.com/photo-1771308136615-3cded1ed5cc0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fFRydWNrcyUyMGFuZCUyMGxvZ2lzdGljc3xlbnwwfHwwfHx8MA%3D%3D",
    date: "Feb 15, 2026",
    author: "Michael Chen",
    category: "Technology",
    isFeatured: false,
    title: "How AI is Transforming Freight Dispatching",
    description:
      "Discover how artificial intelligence and machine learning are revolutionizing load matching and route optimization in the trucking industry.",
  },
  {
    id: "4",
    slug: "winter-driving-safety",
    image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bG9naXN0aWNzfGVufDB8fDB8fHww",
    date: "Feb 12, 2026",
    author: "David Thompson",
    category: "Safety",
    isFeatured: false,
    title: "Winter Driving Safety: Expert Guidelines",
    description:
      "Essential safety protocols and best practices for navigating challenging winter weather conditions on long-haul routes.",
  },
  {
    id: "5",
    slug: "state-of-trucking-industry-2026",
    image: "https://plus.unsplash.com/premium_photo-1661932036915-4fd90bec6e8a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bG9naXN0aWNzfGVufDB8fDB8fHww",
    date: "Feb 10, 2026",
    author: "Emily Rodriguez",
    category: "Industry News",
    isFeatured: false,
    title: "The State of the Trucking Industry Report 2026",
    description:
      "Comprehensive analysis of current market trends, freight rates, and what they mean for drivers and operators.",
  },
  {
    id: "6",
    slug: "fuel-efficiency-best-practices",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bG9naXN0aWNzfGVufDB8fDB8fHww",
    date: "Feb 8, 2026",
    author: "Robert Wilson",
    category: "Driver Tips",
    isFeatured: false,
    title: "Maximizing Fuel Efficiency: Driver Best Practices",
    description:
      "Proven techniques to reduce fuel consumption and increase your bottom line without compromising delivery schedules.",
  },
];

function normalize(s) {
  return (s ?? "").toString().trim().toLowerCase();
}

function BlogCard({ item }) {
  return (
    <article
      key={item.id}
      className="overflow-hidden relative rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
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
        <span className="absolute top-4 left-4 rounded-lg px-4 py-1.5 text-xs font-semibold uppercase text-background bg-secondary">
          {item.category}
        </span>
      </Link>
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span aria-hidden className="inline-block size-1 rounded-full bg-muted-foreground/50" />
            {item.author}
          </span>
          <span aria-hidden className="text-muted-foreground/60">
            —
          </span>
          <time dateTime={item.date} className="text-sm text-muted-foreground">
            {item.date}
          </time>
        </div>
        <h3 className="mt-3 text-lg font-bold text-foreground">
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
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:underline"
        >
          Read More
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

export function BlogPostsSection() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Posts");

  const categories = useMemo(() => {
    const set = new Set(DUMMY_POSTS.map((p) => p.category).filter(Boolean));
    return ["All Posts", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return DUMMY_POSTS.filter((p) => {
      const catOk =
        selectedCategory === "All Posts" || p.category === selectedCategory;
      if (!catOk) return false;
      if (!q) return true;
      return (
        normalize(p.title).includes(q) || normalize(p.description).includes(q)
      );
    });
  }, [query, selectedCategory]);

  const featured = useMemo(
    () => filtered.filter((p) => p.isFeatured),
    [filtered]
  );

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Search + categories */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="pl-11"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = cat === selectedCategory;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "rounded-lg px-4 py-3 text-sm font-semibold transition-colors",
                    active
                      ? "bg-primary text-background"
                      : "bg-muted text-foreground hover:bg-muted/70"
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured */}
        {featured.length > 0 && (
          <div className="mt-14">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Featured Articles
            </h2>
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              {featured.slice(0, 2).map((item) => (
                <BlogCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Latest */}
        <div className={cn("mt-14", featured.length > 0 && "lg:mt-16")}>
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Latest Articles
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <BlogCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

