import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { userDocuments, verificationDocumentTypes, users } from "@/lib/db/schema";
import { withAuth } from "@/lib/middleware/with-auth";
import { successResponse, errorResponse } from "@/lib/response.handle";

const ALLOWED_ACTIONS = ["approved", "reupload_requested"];

async function handlePatch(request) {
  try {

    const body = await request.json();
    const { documentId, action, adminNote } = body;

    if (!documentId || !action) {
      return errorResponse("documentId and action are required.", 400);
    }

    if (!ALLOWED_ACTIONS.includes(action)) {
      return errorResponse("Invalid action. Must be 'approved' or 'reupload_requested'.", 400);
    }

    const [doc] = await db
      .select({ id: userDocuments.id })
      .from(userDocuments)
      .where(eq(userDocuments.id, documentId))
      .limit(1);

    if (!doc) {
      return errorResponse("Document not found.", 404);
    }

    const updates = {
      status: action,
      reviewedAt: new Date(),
    };

    if (action === "reupload_requested" && adminNote) {
      updates.adminNote = String(adminNote).trim();
    }

    if (action === "approved") {
      updates.adminNote = null;
    }

    await db.update(userDocuments).set(updates).where(eq(userDocuments.id, documentId));

    return successResponse(
      action === "approved"
        ? "Document approved."
        : "Re-upload requested."
    );
  } catch (error) {
    console.error("Document action PATCH error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}

async function handlePost(request) {
  try {

    const body = await request.json();
    const { userId, documentName } = body;

    if (!userId || !documentName) {
      return errorResponse("userId and documentName are required.", 400);
    }

    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return errorResponse("User not found.", 404);
    }

    await db.insert(userDocuments).values({
      userId,
      docTypeId: null,
      fileUrl: "",
      status: "pending",
      isOther: true,
      otherDocName: String(documentName).trim(),
    });

    return successResponse("Additional document requested successfully.");
  } catch (error) {
    console.error("Request document POST error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}

export const PATCH = withAuth(handlePatch);
export const POST = withAuth(handlePost);
