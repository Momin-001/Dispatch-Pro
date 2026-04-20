import { and, desc, eq, ilike } from "drizzle-orm";
import { db } from "@/lib/db";
import { blogs, blogCategories } from "@/lib/db/schema";
import { successResponse, errorResponse } from "@/lib/response.handle";

const MAX_SEARCH_LEN = 200;

/**
 * Public: published blog posts (no pagination).
 * Query: `search` — optional title filter (ilike)
 *        `categoryId` — optional numeric category filter
 */
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const search = (url.searchParams.get("search") || "")
      .trim()
      .slice(0, MAX_SEARCH_LEN);
    const categoryIdRaw = (url.searchParams.get("categoryId") || "").trim();

    const conditions = [eq(blogs.status, "published")];

    if (categoryIdRaw) {
      const categoryId = parseInt(categoryIdRaw, 10);
      if (!Number.isNaN(categoryId) && categoryId > 0) {
        conditions.push(eq(blogs.categoryId, categoryId));
      }
    }

    if (search) {
      conditions.push(ilike(blogs.title, `%${search}%`));
    }

    const rows = await db
      .select({
        id: blogs.id,
        slug: blogs.slug,
        title: blogs.title,
        description: blogs.description,
        imageUrl: blogs.imageUrl,
        author: blogs.author,
        isFeatured: blogs.isFeatured,
        createdAt: blogs.createdAt,
        categoryId: blogs.categoryId,
        categoryName: blogCategories.name,
      })
      .from(blogs)
      .leftJoin(blogCategories, eq(blogs.categoryId, blogCategories.id))
      .where(and(...conditions))
      .orderBy(desc(blogs.isFeatured), desc(blogs.createdAt));

    return successResponse("Blogs fetched.", { blogs: rows });
  } catch (error) {
    console.error("Guest blogs GET error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}
