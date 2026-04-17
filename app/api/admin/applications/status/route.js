import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, userDocuments } from "@/lib/db/schema";
import { successResponse, errorResponse } from "@/lib/response.handle";

const ALLOWED_ACTIONS = ["approved", "rejected"];

async function handlePatch(request) {
  try {

    const body = await request.json();
    const { userId, action } = body;

    if (!userId || !action) {
      return errorResponse("userId and action are required.", 400);
    }

    if (!ALLOWED_ACTIONS.includes(action)) {
      return errorResponse("Invalid action. Must be 'approved' or 'rejected'.", 400);
    }

    const [user] = await db
      .select({ id: users.id, status: users.status })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return errorResponse("User not found.", 404);
    }

    const docStatus = action === "approved" ? "approved" : "rejected";
    const now = new Date();

    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ status: action, updatedAt: now })
        .where(eq(users.id, userId));

      await tx
        .update(userDocuments)
        .set({ status: docStatus, reviewedAt: now })
        .where(eq(userDocuments.userId, userId));
    });

    return successResponse(
      action === "approved"
        ? "User has been approved successfully."
        : "User has been rejected."
    );
  } catch (error) {
    console.error("Application status PATCH error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}

export const PATCH = handlePatch;
