"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

const categorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required.").max(255),
  slug: z.string().trim().min(1, "Slug is required.").max(240),
  description: z.string().trim().min(1, "Description is required.").max(255),
  status: z.enum(["active", "inactive"], { message: "Status is required." }),
});

export function CategoryForm({ initialCategory = null, mode = "create" }) {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(initialCategory?.slug));

  const defaultValues = {
    ...EMPTY,
    ...(initialCategory
      ? {
          name: initialCategory.name || "",
          slug: initialCategory.slug || "",
          description: initialCategory.description || "",
          status: initialCategory.status || "active",
        }
      : {}),
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues,
    mode: "onSubmit",
  });

  // Auto-update slug from name when not manually edited
  useEffect(() => {
    if (slugTouched) return;
    const name = watch("name");
    setValue("slug", slugifyClient(name), { shouldValidate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch("name")]);

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        name: values.name.trim(),
        slug: values.slug.trim() || slugifyClient(values.name),
        description: values.description.trim(),
        status: values.status,
      };

      if (mode === "create") {
        const { data: res } = await api.post(
          "/api/admin/blog-categories",
          payload
        );
        toast.success(res.message);
      } else {
        const { data: res } = await api.patch(
          `/api/admin/blog-categories/${initialCategory.id}`,
          payload
        );
        toast.success(res.message);
      }
      router.push("/admin/blog-categories");
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              placeholder="Industry Insights"
              maxLength={255}
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
            {errors.name?.message && (
              <p className="mt-1 text-xs text-destructive">{String(errors.name.message)}</p>
            )}
          </div>

          <div>
            <FieldLabel required>Slug</FieldLabel>
            <Input
              onChange={(e) => {
                setSlugTouched(true);
                setValue("slug", slugifyClient(e.target.value), {
                  shouldValidate: true,
                });
              }}
              placeholder="industry-insights"
              maxLength={240}
              aria-invalid={Boolean(errors.slug)}
              value={watch("slug")}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Auto-generated from name. You can override it.
            </p>
            {errors.slug?.message && (
              <p className="mt-1 text-xs text-destructive">{String(errors.slug.message)}</p>
            )}
          </div>
        </div>

        <div>
          <FieldLabel required>Description</FieldLabel>
          <Textarea
            placeholder="Short summary of what this category covers"
            maxLength={255}
            rows={3}
            aria-invalid={Boolean(errors.description)}
            {...register("description")}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {String(watch("description") || "").length}/255
          </p>
          {errors.description?.message && (
            <p className="mt-1 text-xs text-destructive">{String(errors.description.message)}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FieldLabel required>Status</FieldLabel>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full" aria-invalid={Boolean(errors.status)}>
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
              )}
            />
            {errors.status?.message && (
              <p className="mt-1 text-xs text-destructive">{String(errors.status.message)}</p>
            )}
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
