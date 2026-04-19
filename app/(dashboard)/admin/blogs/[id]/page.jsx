"use client";

import { use, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import api from "@/lib/axios";
import { BlogForm } from "@/components/dashboard/Blogs/BlogForm";

export default function EditBlogPage({ params }) {
  const { id } = use(params);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const { data: res } = await api.get(`/api/admin/blogs/${id}`);
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
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">Blog post not found.</p>
      </div>
    );
  }

  return (
    <div className="min-w-0 w-full max-w-full">
      <BlogForm mode="edit" initialBlog={blog} />
    </div>
  );
}
