import { asc, desc, eq, ilike, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { blogCategories, blogs } from "@/lib/db/schema";
import { successResponse, errorResponse } from "@/lib/response.handle";

const PER_PAGE = 10;

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

async function ensureUniqueSlug(baseSlug) {
  if (!baseSlug) return `category-${Date.now()}`;
  let candidate = baseSlug;
  let i = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const [hit] = await db
      .select({ id: blogCategories.id })
      .from(blogCategories)
      .where(eq(blogCategories.slug, candidate))
      .limit(1);
    if (!hit) return candidate;
    i += 1;
    candidate = `${baseSlug}-${i}`;
  }
}

async function handleGet(request) {
  try {
    const url = new URL(request.url);
    const onlyActive = url.searchParams.get("onlyActive") === "true";
    const paginated = url.searchParams.get("paginated") === "true";

    // Lightweight mode for selects: simple list (optionally only active), no counts.
    if (!paginated) {
      const rows = await db
        .select({
          id: blogCategories.id,
          name: blogCategories.name,
          slug: blogCategories.slug,
          status: blogCategories.status,
        })
        .from(blogCategories)
        .where(onlyActive ? eq(blogCategories.status, "active") : undefined)
        .orderBy(asc(blogCategories.name));

      return successResponse("Categories fetched.", { categories: rows });
    }

    // Paginated listing for the admin categories page (with post counts).
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const search = (url.searchParams.get("search") || "").trim();

    const whereClause = search
      ? ilike(blogCategories.name, `%${search}%`)
      : undefined;

    const [{ count: totalCount }] = await db
      .select({ count: sql`count(*)::int` })
      .from(blogCategories)
      .where(whereClause);

    const offset = (page - 1) * PER_PAGE;

    // Single query with LEFT JOIN + GROUP BY for post counts (no N+1).
    const rows = await db
      .select({
        id: blogCategories.id,
        name: blogCategories.name,
        slug: blogCategories.slug,
        description: blogCategories.description,
        status: blogCategories.status,
        createdAt: blogCategories.createdAt,
        updatedAt: blogCategories.updatedAt,
        totalPosts: sql`count(${blogs.id})::int`,
      })
      .from(blogCategories)
      .leftJoin(blogs, eq(blogs.categoryId, blogCategories.id))
      .where(whereClause)
      .groupBy(blogCategories.id)
      .orderBy(desc(blogCategories.createdAt))
      .limit(PER_PAGE)
      .offset(offset);

    return successResponse("Categories fetched.", {
      categories: rows,
      total: totalCount,
      page,
      perPage: PER_PAGE,
      totalPages: Math.max(1, Math.ceil(totalCount / PER_PAGE)),
    });
  } catch (error) {
    console.error("Admin blog categories GET error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}

async function handlePost(request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();
    const status = String(body.status || "active").trim();
    const slugInput = String(body.slug || "").trim();

    if (!name) return errorResponse("Category name is required.", 400);
    if (name.length > 255) return errorResponse("Name is too long.", 400);
    if (!description) return errorResponse("Description is required.", 400);
    if (description.length > 255) return errorResponse("Description is too long.", 400);
    if (!VALID_STATUSES.has(status)) return errorResponse("Invalid status.", 400);

    const baseSlug = slugify(slugInput || name);
    const slug = await ensureUniqueSlug(baseSlug);

    const [created] = await db
      .insert(blogCategories)
      .values({ name, slug, description, status })
      .returning({ id: blogCategories.id });

    return successResponse("Category created successfully.", { id: created.id });
  } catch (error) {
    console.error("Admin blog category POST error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}

export const GET = handleGet;
export const POST = handlePost;
