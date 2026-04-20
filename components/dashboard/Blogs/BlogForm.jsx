"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Plus, X, ImagePlus } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import api from "@/lib/axios";
import { RichTextEditor } from "@/components/dashboard/Blogs/RichTextEditor";

function slugifyClient(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 240);
}

const EMPTY = {
  title: "",
  description: "",
  slug: "",
  author: "",
  categoryId: "",
  isFeatured: "false",
  tags: [],
  content: "",
};

function FieldLabel({ children, required }) {
  return (
    <label className="mb-1 block text-sm font-medium text-foreground">
      {children}
      {required && <span className="ml-0.5 text-destructive">*</span>}
    </label>
  );
}

export function BlogForm({ initialBlog = null, mode = "create" }) {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(() => ({
    ...EMPTY,
    ...(initialBlog
      ? {
          title: initialBlog.title || "",
          description: initialBlog.description || "",
          slug: initialBlog.slug || "",
          author: initialBlog.author || "",
          categoryId: initialBlog.categoryId ? String(initialBlog.categoryId) : "",
          isFeatured: initialBlog.isFeatured ? "true" : "false",
          tags: Array.isArray(initialBlog.tags) ? initialBlog.tags : [],
          content: initialBlog.content || "",
        }
      : {}),
  }));

  const [slugTouched, setSlugTouched] = useState(Boolean(initialBlog?.slug));
  const [tagInput, setTagInput] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(initialBlog?.imageUrl || "");
  const [thumbnailRemoved, setThumbnailRemoved] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [submittingStatus, setSubmittingStatus] = useState(null); // "draft" | "published" | null

  // Load categories
  useEffect(() => {
    let active = true;
    (async () => {
      setCategoriesLoading(true);
      try {
        const { data: res } = await api.get("/api/admin/blog-categories");
        if (active) setCategories(res.data.categories || []);
      } catch {
        /* axios interceptor */
      } finally {
        if (active) setCategoriesLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Auto-update slug from title when user hasn't manually edited slug yet
  useEffect(() => {
    if (slugTouched) return;
    setForm((p) => ({ ...p, slug: slugifyClient(p.title) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.title]);

  // Cleanup blob preview
  useEffect(() => {
    return () => {
      if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
    setThumbnailRemoved(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeThumbnail = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setThumbnailFile(null);
    setThumbnailPreview("");
    setThumbnailRemoved(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const addTag = () => {
    const v = tagInput.trim();
    if (!v) return;
    if (form.tags.includes(v)) {
      setTagInput("");
      return;
    }
    if (form.tags.length >= 30) {
      toast.error("Maximum 30 tags allowed.");
      return;
    }
    setForm((p) => ({ ...p, tags: [...p.tags, v] }));
    setTagInput("");
  };

  const removeTag = (tag) => {
    setForm((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const validate = () => {
    if (!form.title.trim()) return "Title is required.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.author.trim()) return "Author name is required.";
    if (!form.categoryId) return "Category is required.";
    if (!form.content || form.content === "<p></p>") return "Content is required.";

    // Need a thumbnail: either a freshly picked file, or an existing one (when editing)
    const hasExistingImage = !thumbnailRemoved && Boolean(initialBlog?.imageUrl);
    if (!thumbnailFile && !hasExistingImage) {
      return "Thumbnail image is required.";
    }
    return null;
  };

  const handleSubmit = async (status) => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    setSubmittingStatus(status);
    try {
      const fd = new FormData();
      fd.set("title", form.title.trim());
      fd.set("description", form.description.trim());
      fd.set("slug", form.slug.trim() || slugifyClient(form.title));
      fd.set("author", form.author.trim());
      fd.set("categoryId", form.categoryId);
      fd.set("isFeatured", form.isFeatured);
      fd.set("status", status);
      fd.set("content", form.content);
      fd.set("tags", JSON.stringify(form.tags));
      if (thumbnailFile) fd.set("thumbnail", thumbnailFile);

      if (mode === "create") {
        const { data: res } = await api.post("/api/admin/blogs", fd);
        toast.success(res.message);
        router.push("/admin/blogs");
      } else {
        const { data: res } = await api.patch(
          `/api/admin/blogs/${initialBlog.id}`,
          fd
        );
        toast.success(res.message);
        router.push("/admin/blogs");
      }
    } catch {
      /* axios interceptor */
    } finally {
      setSubmittingStatus(null);
    }
  };

  const isSubmitting = submittingStatus !== null;

  const headerTitle =
    mode === "create" ? "Create New Blog Post" : "Edit Blog Post";
  const headerDescription =
    mode === "create"
      ? "Publish educational and industry-focused content."
      : "Update existing blog post and re-publish if needed.";

  const categoryOptions = useMemo(() => categories || [], [categories]);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{headerTitle}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{headerDescription}</p>
      </div>

      {/* Basic Information */}
      <Card className="space-y-4 p-5">
        <h2 className="text-lg font-semibold text-foreground">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FieldLabel required>Title</FieldLabel>
            <Input
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="How to optimize your dispatch operations"
              maxLength={255}
            />
          </div>

          <div>
            <FieldLabel required>Slug</FieldLabel>
            <Input
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setField("slug", slugifyClient(e.target.value));
              }}
              placeholder="how-to-optimize-your-dispatch-operations"
              maxLength={240}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Auto-generated from title. You can override it.
            </p>
          </div>
        </div>

        <div>
          <FieldLabel required>Description</FieldLabel>
          <Textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Short summary that appears in listings and previews"
            maxLength={255}
            rows={3}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {form.description.length}/255
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FieldLabel required>Author Name</FieldLabel>
            <Input
              value={form.author}
              onChange={(e) => setField("author", e.target.value)}
              placeholder="Jane Doe"
              maxLength={255}
            />
          </div>

          <div>
            <FieldLabel required>Category</FieldLabel>
            <Select
              value={form.categoryId}
              onValueChange={(v) => setField("categoryId", v)}
              disabled={categoriesLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    categoriesLoading ? "Loading…" : "Select category"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.length === 0 && !categoriesLoading ? (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    No categories yet
                  </div>
                ) : (
                  categoryOptions.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FieldLabel required>Featured Post</FieldLabel>
            <Select
              value={form.isFeatured}
              onValueChange={(v) => setField("isFeatured", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes — show as featured</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Thumbnail */}
          <div>
            <FieldLabel required>Thumbnail Image</FieldLabel>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleThumbnailChange}
            />
            <button
              type="button"
              onClick={openFilePicker}
              className="group relative flex h-40 w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed border-border bg-muted/40 transition-colors hover:border-primary-dark hover:bg-muted/60"
            >
              {thumbnailPreview ? (
                <>
                  <Image
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label="Remove image"
                    onClick={removeThumbnail}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") removeThumbnail(e);
                    }}
                    className="absolute right-2 top-2 z-10 inline-flex size-7 items-center justify-center rounded-full bg-secondary text-background shadow-sm transition-transform hover:scale-110 hover:bg-secondary-dark"
                  >
                    <X className="size-4" />
                  </span>
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                    Click to replace
                  </span>
                </>
              ) : (
                <span className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
                  <ImagePlus className="size-6" />
                  Click to upload thumbnail
                  <span className="text-[10px]">JPG, PNG, WEBP, GIF</span>
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tags */}
        <div>
          <FieldLabel>Tags</FieldLabel>
          <div className="flex items-stretch gap-2">
            <div className="flex h-10 flex-1 items-center overflow-hidden rounded-md border border-input bg-background px-2">
              <button
                type="button"
                onClick={addTag}
                className="mr-2 inline-flex size-6 items-center justify-center rounded bg-primary-dark text-background hover:bg-primary-dark/80"
                aria-label="Add tag"
              >
                <Plus className="size-3.5" />
              </button>
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type a tag and press Enter"
                className="flex-1 bg-transparent text-sm outline-none"
              />
            </div>
          </div>
          {form.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {form.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    className="inline-flex size-4 items-center justify-center rounded-full hover:bg-secondary hover:text-background"
                    aria-label={`Remove ${t}`}
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Content Editor */}
      <Card className="space-y-4 p-5">
        <h2 className="text-lg font-semibold text-foreground">
          Content Editor
        </h2>
        <RichTextEditor
          value={form.content}
          onChange={(html) => setField("content", html)}
        />
      </Card>

      {/* Footer Actions */}
      <div className="flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center">
        <Button
          type="button"
          variant="dark"
          size="lg"
          disabled={isSubmitting}
          onClick={() => handleSubmit("published")}
          className="gap-2"
        >
          {submittingStatus === "published" && (
            <Loader2 className="size-4 animate-spin" />
          )}
          Publish Now
        </Button>
        <Button
          type="button"
          variant="secondary-dark"
          size="lg"
          disabled={isSubmitting}
          onClick={() => handleSubmit("draft")}
          className="gap-2"
        >
          {submittingStatus === "draft" && (
            <Loader2 className="size-4 animate-spin" />
          )}
          Save as Draft
        </Button>
                <Button
          type="button"
          variant="secondary-dark"
          size="lg"
          disabled={isSubmitting}
          onClick={() => router.push("/admin/blogs")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
