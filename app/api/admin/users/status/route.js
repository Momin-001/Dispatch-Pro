import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { successResponse, errorResponse } from "@/lib/response.handle";

async function handlePatch(request) {
  try {

    const body = await request.json();
    const { userId, action } = body;

    if (!userId || !action) {
      return errorResponse("userId and action are required.", 400);
    }

    if (!["suspended", "active"].includes(action)) {
      return errorResponse("Invalid action. Must be 'suspended' or 'approved'.", 400);
    }

    const [user] = await db
      .select({ id: users.id, status: users.status })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return errorResponse("User not found.", 404);
    }

    await db
      .update(users)
      .set({ status: action, updatedAt: new Date() })
      .where(eq(users.id, userId));

    const msg =
      action === "suspended"
        ? "User has been suspended."
        : "User has been activated.";

    return successResponse(msg);
  } catch (error) {
    console.error("User status PATCH error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}

export const PATCH = handlePatch;
