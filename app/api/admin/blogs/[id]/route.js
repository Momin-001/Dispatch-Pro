import { and, eq, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { blogs, blogCategories } from "@/lib/db/schema";
import { successResponse, errorResponse } from "@/lib/response.handle";
import { isValidUuid } from "@/lib/helpers";
import {
  isAllowedThumbnailMime,
  uploadBlogThumbnail,
  deleteBlogThumbnail,
} from "@/lib/uploads/blog-thumbnail";

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

async function ensureUniqueSlug(baseSlug, excludeId) {
  if (!baseSlug) return `post-${Date.now()}`;
  let candidate = baseSlug;
  let i = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const [hit] = await db
      .select({ id: blogs.id })
      .from(blogs)
      .where(and(eq(blogs.slug, candidate), ne(blogs.id, excludeId)))
      .limit(1);
    if (!hit) return candidate;
    i += 1;
    candidate = `${baseSlug}-${i}`;
  }
}

async function handleGet(_request, { params }) {
  try {
    const { id } = await params;
    if (!isValidUuid(id)) return errorResponse("Blog not found.", 404);

    const [row] = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        slug: blogs.slug,
        description: blogs.description,
        imageUrl: blogs.imageUrl,
        cloudinaryPublicId: blogs.cloudinaryPublicId,
        author: blogs.author,
        content: blogs.content,
        isFeatured: blogs.isFeatured,
        status: blogs.status,
        views: blogs.views,
        tags: blogs.tags,
        categoryId: blogs.categoryId,
        categoryName: blogCategories.name,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
      })
      .from(blogs)
      .leftJoin(blogCategories, eq(blogs.categoryId, blogCategories.id))
      .where(eq(blogs.id, id))
      .limit(1);

    if (!row) return errorResponse("Blog not found.", 404);

    return successResponse("Blog fetched.", { blog: row });
  } catch (error) {
    console.error("Admin blog GET error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}

async function handlePatch(request, { params }) {
  try {
    const { id } = await params;
    if (!isValidUuid(id)) return errorResponse("Blog not found.", 404);

    const [existing] = await db
      .select({
        id: blogs.id,
        slug: blogs.slug,
        cloudinaryPublicId: blogs.cloudinaryPublicId,
        status: blogs.status,
      })
      .from(blogs)
      .where(eq(blogs.id, id))
      .limit(1);

    if (!existing) return errorResponse("Blog not found.", 404);

    const contentType = request.headers.get("content-type") || "";

    // ---- JSON path: small toggles (publish toggle, etc.) ----
    if (contentType.includes("application/json")) {
      const body = await request.json();
      const updates = {};

      if (typeof body.status === "string") {
        if (!VALID_STATUSES.has(body.status)) {
          return errorResponse("Invalid status.", 400);
        }
        updates.status = body.status;
      }

      if (typeof body.isFeatured === "boolean") {
        updates.isFeatured = body.isFeatured;
      }

      if (Object.keys(updates).length === 0) {
        return errorResponse("Nothing to update.", 400);
      }

      updates.updatedAt = new Date();
      await db.update(blogs).set(updates).where(eq(blogs.id, id));

      return successResponse("Blog updated successfully.");
    }

    // ---- FormData path: full edit ----
    const formData = await request.formData();

    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const author = String(formData.get("author") || "").trim();
    const content = String(formData.get("content") || "").trim();
    const status = String(formData.get("status") || "").trim();
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
    const slug =
      baseSlug === existing.slug
        ? existing.slug
        : await ensureUniqueSlug(baseSlug, id);

    const updates = {
      title,
      slug,
      description,
      author,
      content,
      isFeatured,
      status,
      tags,
      categoryId,
      updatedAt: new Date(),
    };

    let oldPublicId = null;
    if (thumbnail && typeof thumbnail.arrayBuffer === "function" && thumbnail.size > 0) {
      if (!isAllowedThumbnailMime(thumbnail.type)) {
        return errorResponse("Thumbnail must be a JPG, PNG, WEBP or GIF image.", 400);
      }
      const buffer = Buffer.from(await thumbnail.arrayBuffer());
      const uploaded = await uploadBlogThumbnail(buffer);
      updates.imageUrl = uploaded.secure_url;
      updates.cloudinaryPublicId = uploaded.public_id;
      oldPublicId = existing.cloudinaryPublicId;
    }

    await db.update(blogs).set(updates).where(eq(blogs.id, id));

    if (oldPublicId) {
      await deleteBlogThumbnail(oldPublicId);
    }

    return successResponse("Blog updated successfully.");
  } catch (error) {
    console.error("Admin blog PATCH error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}

async function handleDelete(_request, { params }) {
  try {
    const { id } = await params;
    if (!isValidUuid(id)) return errorResponse("Blog not found.", 404);

    const [existing] = await db
      .select({ id: blogs.id, cloudinaryPublicId: blogs.cloudinaryPublicId })
      .from(blogs)
      .where(eq(blogs.id, id))
      .limit(1);

    if (!existing) return errorResponse("Blog not found.", 404);

    await db.delete(blogs).where(eq(blogs.id, id));

    if (existing.cloudinaryPublicId) {
      await deleteBlogThumbnail(existing.cloudinaryPublicId);
    }

    return successResponse("Blog deleted successfully.");
  } catch (error) {
    console.error("Admin blog DELETE error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}

export const GET = handleGet;
export const PATCH = handlePatch;
export const DELETE = handleDelete;
