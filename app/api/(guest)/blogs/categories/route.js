import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { blogCategories } from "@/lib/db/schema";
import { successResponse, errorResponse } from "@/lib/response.handle";

/** Public: active blog categories only (for guest blog filters). */
export async function GET() {
  try {
    const rows = await db
      .select({
        id: blogCategories.id,
        name: blogCategories.name,
        slug: blogCategories.slug,
      })
      .from(blogCategories)
      .where(eq(blogCategories.status, "active"))
      .orderBy(asc(blogCategories.name));

    return successResponse("Categories fetched.", { categories: rows });
  } catch (error) {
    console.error("Guest blog categories GET error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}
