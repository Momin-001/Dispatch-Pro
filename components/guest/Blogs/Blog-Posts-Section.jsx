"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ChevronRight, Loader2, Search } from "lucide-react";
import { useDebounce } from "use-debounce";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";

function BlogCard({ item }) {
  const categoryLabel = (item.categoryName || "Uncategorized").trim();
  const dateLabel =
    item.createdAt != null
      ? format(new Date(item.createdAt), "MMM d, yyyy")
      : "";
  const dateTimeAttr =
    item.createdAt != null ? new Date(item.createdAt).toISOString() : undefined;

  return (
    <article className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={`/blogs/${item.slug}`}
        className="block shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <span className="absolute left-4 top-4 rounded-lg bg-secondary px-4 py-1.5 text-xs font-semibold uppercase text-background">
          {categoryLabel}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="shrink-0 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span
              aria-hidden
              className="inline-block size-1 rounded-full bg-muted-foreground/50"
            />
            {item.author}
          </span>
          <span aria-hidden className="text-muted-foreground/60">
            —
          </span>
          <time dateTime={dateTimeAttr} className="text-sm text-muted-foreground">
            {dateLabel}
          </time>
        </div>
        <h3 className="mt-3 line-clamp-2 min-h-0 shrink-0 text-lg font-bold leading-snug text-foreground">
          <Link
            href={`/blogs/${item.slug}`}
            className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {item.title}
          </Link>
        </h3>
        <p className="mt-2 min-h-0 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {item.description}
        </p>
        <Link
          href={`/blogs/${item.slug}`}
          className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-secondary hover:underline"
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
  const [debouncedSearch] = useDebounce(query, 400);
  /** `null` = All Posts; otherwise active category id */
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data: res } = await api.get("/api/blogs/categories");
        if (active) setCategories(res.data.categories || []);
      } catch {
        /* axios interceptor */
      } finally {
        if (active) setCategoriesLoaded(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
      if (selectedCategoryId != null) {
        params.set("categoryId", String(selectedCategoryId));
      }
      const { data: res } = await api.get(
        `/api/blogs?${params.toString()}`
      );
      setPosts(res.data.blogs || []);
    } catch {
      /* axios interceptor */
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCategoryId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const featured = useMemo(
    () => posts.filter((p) => p.isFeatured),
    [posts]
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
            <button
              type="button"
              onClick={() => setSelectedCategoryId(null)}
              className={cn(
                "rounded-lg px-4 py-3 text-sm font-semibold transition-colors",
                selectedCategoryId === null
                  ? "bg-primary text-background"
                  : "bg-muted text-foreground hover:bg-muted/70"
              )}
            >
              All Posts
            </button>
            {categoriesLoaded &&
              categories.map((cat) => {
                const active = selectedCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={cn(
                      "rounded-lg px-4 py-3 text-sm font-semibold transition-colors",
                      active
                        ? "bg-primary text-background"
                        : "bg-muted text-foreground hover:bg-muted/70"
                    )}
                  >
                    {cat.name}
                  </button>
                );
              })}
          </div>
        </div>

        {loading && posts.length === 0 ? (
          <div className="mt-14 flex min-h-[200px] items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
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
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                  Latest Articles
                </h2>
                {loading && posts.length > 0 && (
                  <Loader2
                    className="size-5 shrink-0 animate-spin text-muted-foreground"
                    aria-label="Loading"
                  />
                )}
              </div>
              {posts.length === 0 ? (
                <p className="mt-8 text-center text-sm text-muted-foreground">
                  No articles match your filters.
                </p>
              ) : (
                <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {posts.map((item) => (
                    <BlogCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
