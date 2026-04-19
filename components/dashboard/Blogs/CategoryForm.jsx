"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
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
import { BLOG_CATEGORY_STATUS_OPTIONS } from "@/lib/helpers";

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

function FieldLabel({ children, required }) {
  return (
    <label className="mb-1 block text-sm font-medium text-foreground">
      {children}
      {required && <span className="ml-0.5 text-destructive">*</span>}
    </label>
  );
}

const EMPTY = {
  name: "",
  slug: "",
  description: "",
  status: "active",
};

export function CategoryForm({ initialCategory = null, mode = "create" }) {
  const router = useRouter();

  const [form, setForm] = useState(() => ({
    ...EMPTY,
    ...(initialCategory
      ? {
          name: initialCategory.name || "",
          slug: initialCategory.slug || "",
          description: initialCategory.description || "",
          status: initialCategory.status || "active",
        }
      : {}),
  }));
  const [slugTouched, setSlugTouched] = useState(Boolean(initialCategory?.slug));
  const [submitting, setSubmitting] = useState(false);

  // Auto-update slug from name when not manually edited
  useEffect(() => {
    if (slugTouched) return;
    setForm((p) => ({ ...p, slug: slugifyClient(p.name) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.name]);

  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const validate = () => {
    if (!form.name.trim()) return "Category name is required.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.status) return "Status is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || slugifyClient(form.name),
        description: form.description.trim(),
        status: form.status,
      };

      if (mode === "create") {
        const { data: res } = await api.post(
          "/api/admin/blogs/categories",
          payload
        );
        toast.success(res.message);
      } else {
        const { data: res } = await api.patch(
          `/api/admin/blogs/categories/${initialCategory.id}`,
          payload
        );
        toast.success(res.message);
      }
      router.push("/admin/blogs/categories");
    } catch {
      /* axios interceptor */
    } finally {
      setSubmitting(false);
    }
  };

  const headerTitle =
    mode === "create" ? "Create Blog Category" : "Edit Blog Category";
  const headerDescription =
    mode === "create"
      ? "Group blog posts under structured topics."
      : "Update an existing blog category.";

  const submitLabel = mode === "create" ? "Create Category" : "Save Changes";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{headerTitle}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{headerDescription}</p>
      </div>

      {/* Basic Information */}
      <Card className="p-5">
        <h2 className="text-lg font-semibold text-foreground">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FieldLabel required>Category Name</FieldLabel>
            <Input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Industry Insights"
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
              placeholder="industry-insights"
              maxLength={240}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Auto-generated from name. You can override it.
            </p>
          </div>
        </div>

        <div>
          <FieldLabel required>Description</FieldLabel>
          <Textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Short summary of what this category covers"
            maxLength={255}
            rows={3}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {form.description.length}/255
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FieldLabel required>Status</FieldLabel>
            <Select
              value={form.status}
              onValueChange={(v) => setField("status", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BLOG_CATEGORY_STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Footer Actions */}
      <div className="flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center">

        <Button
          type="submit"
          variant="dark"
          size="lg"
          disabled={submitting}
          className="gap-2"
        >
          {submitting && <Loader2 className="size-4 animate-spin" />}
          {submitLabel}
        </Button>

        <Button
          type="button"
          variant="secondary-dark"
          size="lg"
          disabled={submitting}
          onClick={() => router.push("/admin/blog-categories")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
