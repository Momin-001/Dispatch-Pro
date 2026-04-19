import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { blogs, blogCategories } from "@/lib/db/schema";
import { successResponse, errorResponse } from "@/lib/response.handle";
import { isAllowedThumbnailMime, uploadBlogThumbnail } from "@/lib/uploads/blog-thumbnail";

const PER_PAGE = 10;

const VALID_STATUSES = new Set(["draft", "published", "archived"]);

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
  if (!baseSlug) return `post-${Date.now()}`;
  let candidate = baseSlug;
  let i = 1;
  // simple loop — collisions are rare
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const [hit] = await db
      .select({ id: blogs.id })
      .from(blogs)
      .where(eq(blogs.slug, candidate))
      .limit(1);
    if (!hit) return candidate;
    i += 1;
    candidate = `${baseSlug}-${i}`;
  }
}

async function handleGet(request) {
  try {
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const search = (url.searchParams.get("search") || "").trim();
    const categoryId = (url.searchParams.get("categoryId") || "").trim();
    const status = (url.searchParams.get("status") || "").trim();

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(blogs.title, `%${search}%`),
          ilike(blogs.author, `%${search}%`)
        )
      );
    }

    if (categoryId) {
      const parsed = parseInt(categoryId, 10);
      if (!Number.isNaN(parsed)) {
        conditions.push(eq(blogs.categoryId, parsed));
      }
    }

    if (status && VALID_STATUSES.has(status)) {
      conditions.push(eq(blogs.status, status));
    }

    const whereClause = conditions.length ? and(...conditions) : undefined;

    const [{ count: totalCount }] = await db
      .select({ count: sql`count(*)::int` })
      .from(blogs)
      .where(whereClause);

    const offset = (page - 1) * PER_PAGE;

    const rows = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        slug: blogs.slug,
        author: blogs.author,
        status: blogs.status,
        views: blogs.views,
        isFeatured: blogs.isFeatured,
        imageUrl: blogs.imageUrl,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
        categoryId: blogs.categoryId,
        categoryName: blogCategories.name,
      })
      .from(blogs)
      .leftJoin(blogCategories, eq(blogs.categoryId, blogCategories.id))
      .where(whereClause)
      .orderBy(desc(blogs.createdAt))
      .limit(PER_PAGE)
      .offset(offset);

    return successResponse("Blogs fetched.", {
      blogs: rows,
      total: totalCount,
      page,
      perPage: PER_PAGE,
      totalPages: Math.max(1, Math.ceil(totalCount / PER_PAGE)),
    });
  } catch (error) {
    console.error("Admin blogs GET error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}

async function handlePost(request) {
  try {
    const formData = await request.formData();

    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const author = String(formData.get("author") || "").trim();
    const content = String(formData.get("content") || "").trim();
    const status = String(formData.get("status") || "draft").trim();
    const isFeatured = String(formData.get("isFeatured") || "false") === "true";
    const categoryIdRaw = formData.get("categoryId");
    const slugInput = String(formData.get("slug") || "").trim();
    const tagsRaw = String(formData.get("tags") || "").trim();
    const thumbnail = formData.get("thumbnail");

    if (!title) return errorResponse("Title is required.", 400);
    if (!description) return errorResponse("Description is required.", 400);
    if (!author) return errorResponse("Author name is required.", 400);
    if (!content || content === "<p></p>") return errorResponse("Content is required.", 400);
    if (!VALID_STATUSES.has(status)) return errorResponse("Invalid status.", 400);
    if (!categoryIdRaw) return errorResponse("Category is required.", 400);
    const categoryId = parseInt(String(categoryIdRaw), 10);
    if (Number.isNaN(categoryId)) return errorResponse("Invalid category.", 400);

    if (!thumbnail || typeof thumbnail.arrayBuffer !== "function") {
      return errorResponse("Thumbnail image is required.", 400);
    }
    if (!isAllowedThumbnailMime(thumbnail.type)) {
      return errorResponse("Thumbnail must be a JPG, PNG, WEBP or GIF image.", 400);
    }

    let tags = [];
    if (tagsRaw) {
      try {
        const parsed = JSON.parse(tagsRaw);
        if (Array.isArray(parsed)) {
          tags = parsed
            .map((t) => String(t || "").trim())
            .filter(Boolean)
            .slice(0, 30);
        }
      } catch {
        tags = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);
      }
    }

    const baseSlug = slugify(slugInput || title);
    const slug = await ensureUniqueSlug(baseSlug);

    const buffer = Buffer.from(await thumbnail.arrayBuffer());
    const uploaded = await uploadBlogThumbnail(buffer);

    const [created] = await db
      .insert(blogs)
      .values({
        title,
        slug,
        description,
        imageUrl: uploaded.secure_url,
        cloudinaryPublicId: uploaded.public_id,
        author,
        content,
        isFeatured,
        status,
        tags,
        categoryId,
      })
      .returning({ id: blogs.id });

    return successResponse("Blog created successfully.", { id: created.id });
  } catch (error) {
    console.error("Admin blogs POST error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}

export const GET = handleGet;
export const POST = handlePost;
