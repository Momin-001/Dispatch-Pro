"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Loader2, Tag, User } from "lucide-react";

import api from "@/lib/axios";
import { ShareButtons } from "@/components/guest/Blogs/ShareButtons";

export function BlogDetail({ slug }) {
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const { data: res } = await api.get(
          `/api/blogs/${encodeURIComponent(slug)}`
        );
        if (active) setBlog(res.data.blog);
      } catch (err) {
        if (active && err?.response?.status === 404) setNotFound(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold text-foreground">Blog not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The article you are looking for doesn't exist or has been removed.
        </p>
        <button
          type="button"
          onClick={() => router.push("/blogs")}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to All Blogs
        </button>
      </div>
    );
  }

  const categoryLabel = (blog.categoryName || "Uncategorized").trim();
  const createdAt = blog.createdAt ? new Date(blog.createdAt) : null;
  const dateLabel = createdAt ? format(createdAt, "MMM d, yyyy") : "";
  const dateTimeAttr = createdAt ? createdAt.toISOString() : undefined;
  const tags = Array.isArray(blog.tags)
    ? blog.tags.filter((t) => typeof t === "string" && t.trim())
    : [];

  return (
    // 1. Reduced top margin on mobile
    <section className="mt-22 sm:mt-26 space-y-6">
      {/* Back link */}
      {/* 2. Added horizontal padding on mobile so it doesn't touch screen edges */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to All Blogs
        </Link>
      </div>

      <div className="bg-[#F9FAFB] pb-10">
        <div className="mx-auto bg-card rounded-2xl shadow-lg max-w-4xl">
          {/* Hero image */}
          <div className="overflow-hidden rounded-t-2xl border border-border bg-muted shadow-sm">
            <div className="relative aspect-video w-full">
              <Image
                src={blog.imageUrl}
                alt={blog.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </div>
          </div>

          {/* 3. Reduced side padding on mobile */}
          <div className="px-4 sm:px-10">
            {/* Article header */}
            <div className="mt-6 sm:mt-8 p-4 sm:p-8">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
                {categoryLabel}
              </span>

              {/* 4. Removed fixed w-xl width that broke layout on small screens */}
              <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
                {blog.title}
              </h1>

              {/* Meta */}
              {/* 5. Stack meta items vertically on mobile */}
              <div className="mt-6 flex flex-row sm:flex-wrap sm:items-center gap-x-6 gap-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary-dark text-background">
                    <User className="size-4" aria-hidden />
                  </span>
                  <div className="leading-tight">
                    <p className="font-semibold text-foreground">{blog.author}</p>
                    <p className="text-xs text-muted-foreground">Author</p>
                  </div>
                </div>

                {dateLabel && (
                  <div className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="size-4" aria-hidden />
                    <time dateTime={dateTimeAttr}>{dateLabel}</time>
                  </div>
                )}
              </div>

              {/* Share row */}
              <div className="mt-6 border-t border-border pt-5">
                <ShareButtons title={blog.title} />
              </div>
            </div>

            {/* Content */}
            {/* 6. Reduced article padding on mobile */}
            <article className="p-4 sm:p-6 sm:pt-0 lg:p-10">
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: blog.content || "" }}
              />

              {tags.length > 0 && (
                <>
                  <hr className="my-8 border-border" />
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag className="size-4 text-muted-foreground" aria-hidden />
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-[#F3F4F6] px-4 py-2 text-xs font-medium text-foreground-light"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}