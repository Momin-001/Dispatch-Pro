import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { userDocuments, verificationDocumentTypes, users } from "@/lib/db/schema";
import { withAuth } from "@/lib/middleware/with-auth";
import { successResponse, errorResponse } from "@/lib/response.handle";
import { uploadApplicationFile } from "@/lib/uploads/application-file";

async function handlePost(request) {
  try {
    const { userId, role } = request.user;

    const formData = await request.formData();
    const documentIdRaw = formData.get("documentId");
    const docTypeIdRaw = formData.get("docTypeId");
    const fileEntry = formData.get("file");

    if (
      !fileEntry ||
      typeof fileEntry !== "object" ||
      typeof fileEntry.arrayBuffer !== "function" ||
      fileEntry.size === 0
    ) {
      return errorResponse("File is required.", 400);
    }

    if (fileEntry.size > 5 * 1024 * 1024) {
      return errorResponse("File must be 5 MB or smaller.", 400);
    }

    const [user] = await db.select({ roleId: users.roleId }).from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      return errorResponse("User not found.", 404);
    }

    const buffer = Buffer.from(await fileEntry.arrayBuffer());
    const uploadResult = await uploadApplicationFile(buffer, {
      role,
      mimeType: fileEntry.type || "application/octet-stream",
      originalFilename: fileEntry.name,
    });

    const uploadPayload = {
      fileUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      status: "pending",
      adminNote: null,
      uploadedAt: new Date(),
      reviewedAt: null,
    };

    if (documentIdRaw && String(documentIdRaw).trim()) {
      const documentId = String(documentIdRaw).trim();
      const [otherRow] = await db
        .select({ id: userDocuments.id, isOther: userDocuments.isOther })
        .from(userDocuments)
        .where(and(eq(userDocuments.id, documentId), eq(userDocuments.userId, userId)))
        .limit(1);

      if (!otherRow || !otherRow.isOther) {
        return errorResponse("Document request not found.", 404);
      }

      await db.update(userDocuments).set(uploadPayload).where(eq(userDocuments.id, documentId));

      return successResponse("Document uploaded successfully.");
    }

    if (!docTypeIdRaw) {
      return errorResponse("Document type ID or document ID is required.", 400);
    }

    const docTypeId = Number(docTypeIdRaw);
    if (Number.isNaN(docTypeId)) {
      return errorResponse("Invalid document type ID.", 400);
    }

    const [docType] = await db
      .select()
      .from(verificationDocumentTypes)
      .where(
        and(
          eq(verificationDocumentTypes.id, docTypeId),
          eq(verificationDocumentTypes.roleId, user.roleId)
        )
      )
      .limit(1);

    if (!docType) {
      return errorResponse("Document type not found or does not belong to your role.", 400);
    }

    const existing = await db
      .select({ id: userDocuments.id })
      .from(userDocuments)
      .where(
        and(
          eq(userDocuments.userId, userId),
          eq(userDocuments.docTypeId, docTypeId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(userDocuments)
        .set(uploadPayload)
        .where(eq(userDocuments.id, existing[0].id));
    } else {
      await db.insert(userDocuments).values({
        userId,
        docTypeId,
        fileUrl: uploadResult.secure_url,
        cloudinaryPublicId: uploadResult.public_id,
        status: "pending",
        isOther: false,
      });
    }

    return successResponse("Document uploaded successfully.");
  } catch (error) {
    console.error("Document upload error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}

export const POST = withAuth(handlePost);
