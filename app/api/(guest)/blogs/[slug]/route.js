import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { blogs, blogCategories } from "@/lib/db/schema";
import { successResponse, errorResponse } from "@/lib/response.handle";

/** Public: fetch a single published blog by slug. Increments the view counter. */
export async function GET(_request, { params }) {
  try {
    const { slug } = await params;
    if (!slug || typeof slug !== "string") {
      return errorResponse("Blog not found.", 404);
    }

    const [row] = await db
      .select({
        id: blogs.id,
        slug: blogs.slug,
        title: blogs.title,
        description: blogs.description,
        content: blogs.content,
        imageUrl: blogs.imageUrl,
        author: blogs.author,
        isFeatured: blogs.isFeatured,
        tags: blogs.tags,
        views: blogs.views,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
        categoryId: blogs.categoryId,
        categoryName: blogCategories.name,
        categorySlug: blogCategories.slug,
      })
      .from(blogs)
      .leftJoin(blogCategories, eq(blogs.categoryId, blogCategories.id))
      .where(and(eq(blogs.slug, slug), eq(blogs.status, "published")))
      .limit(1);

    if (!row) return errorResponse("Blog not found.", 404);

    // Fire-and-forget view increment — keep the endpoint read-fast
    db.update(blogs)
      .set({ views: sql`${blogs.views} + 1` })
      .where(eq(blogs.id, row.id))
      .catch((err) => console.error("Blog views increment failed:", err));

    return successResponse("Blog fetched.", { blog: row });
  } catch (error) {
    console.error("Guest blog GET error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}
