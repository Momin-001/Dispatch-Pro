import { and, eq, ne, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { blogCategories, blogs } from "@/lib/db/schema";
import { successResponse, errorResponse } from "@/lib/response.handle";

const VALID_STATUSES = new Set(["active", "inactive"]);

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 240);
}

function parseId(raw) {
  const n = parseInt(String(raw), 10);
  return Number.isNaN(n) || n <= 0 ? null : n;
}

async function ensureUniqueSlug(baseSlug, excludeId) {
  if (!baseSlug) return `category-${Date.now()}`;
  let candidate = baseSlug;
  let i = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const [hit] = await db
      .select({ id: blogCategories.id })
      .from(blogCategories)
      .where(
        and(eq(blogCategories.slug, candidate), ne(blogCategories.id, excludeId))
      )
      .limit(1);
    if (!hit) return candidate;
    i += 1;
    candidate = `${baseSlug}-${i}`;
  }
}

async function handleGet(_request, { params }) {
  try {
    const { id } = await params;
    const numericId = parseId(id);
    if (!numericId) return errorResponse("Category not found.", 404);

    // Count posts for this category only. Do not use `blogCategories.id` inside the
    // subquery's sql`` — Drizzle can emit bare `"id"`, which Postgres resolves to
    // `blogs.id` (uuid) instead of `blog_categories.id` (integer).
    const [row] = await db
      .select({
        id: blogCategories.id,
        name: blogCategories.name,
        slug: blogCategories.slug,
        description: blogCategories.description,
        status: blogCategories.status,
        createdAt: blogCategories.createdAt,
        updatedAt: blogCategories.updatedAt,
        totalPosts: sql`(select count(*)::int from ${blogs} where ${blogs.categoryId} = ${numericId})`,
      })
      .from(blogCategories)
      .where(eq(blogCategories.id, numericId))
      .limit(1);

    if (!row) return errorResponse("Category not found.", 404);

    return successResponse("Category fetched.", { category: row });
  } catch (error) {
    console.error("Admin blog category GET error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}

async function handlePatch(request, { params }) {
  try {
    const { id } = await params;
    const numericId = parseId(id);
    if (!numericId) return errorResponse("Category not found.", 404);

    const [existing] = await db
      .select({ id: blogCategories.id, slug: blogCategories.slug })
      .from(blogCategories)
      .where(eq(blogCategories.id, numericId))
      .limit(1);

    if (!existing) return errorResponse("Category not found.", 404);

    const body = await request.json();
    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();
    const status = String(body.status || "").trim();
    const slugInput = String(body.slug || "").trim();

    if (!name) return errorResponse("Category name is required.", 400);
    if (name.length > 255) return errorResponse("Name is too long.", 400);
    if (!description) return errorResponse("Description is required.", 400);
    if (description.length > 255) return errorResponse("Description is too long.", 400);
    if (!VALID_STATUSES.has(status)) return errorResponse("Invalid status.", 400);

    const baseSlug = slugify(slugInput || name);
    const slug =
      baseSlug === existing.slug
        ? existing.slug
        : await ensureUniqueSlug(baseSlug, numericId);

    await db
      .update(blogCategories)
      .set({ name, slug, description, status, updatedAt: new Date() })
      .where(eq(blogCategories.id, numericId));

    return successResponse("Category updated successfully.");
  } catch (error) {
    console.error("Admin blog category PATCH error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}

async function handleDelete(_request, { params }) {
  try {
    const { id } = await params;
    const numericId = parseId(id);
    if (!numericId) return errorResponse("Category not found.", 404);

    const [existing] = await db
      .select({ id: blogCategories.id })
      .from(blogCategories)
      .where(eq(blogCategories.id, numericId))
      .limit(1);

    if (!existing) return errorResponse("Category not found.", 404);

    await db.delete(blogCategories).where(eq(blogCategories.id, numericId));

    return successResponse("Category deleted successfully.");
  } catch (error) {
    console.error("Admin blog category DELETE error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}

export const GET = handleGet;
export const PATCH = handlePatch;
export const DELETE = handleDelete;
