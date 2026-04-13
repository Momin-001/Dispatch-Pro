import { eq, and, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, roles, verificationDocumentTypes, userDocuments } from "@/lib/db/schema";
import { withAuth } from "@/lib/middleware/with-auth";
import { successResponse, errorResponse } from "@/lib/response.handle";

async function handleGet(request) {
  try {
    const { userId } = request.user;

    const [user] = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        phone: users.phone,
        status: users.status,
        roleId: users.roleId,
        roleName: roles.name,
        licenseNumber: users.licenseNumber,
        yearsExperience: users.yearsExperience,
        equipmentType: users.equipmentType,
        companyName: users.companyName,
        monthlyLoadEstimate: users.monthlyLoadEstimate,
        serviceType: users.serviceType,
        address: users.address,
        city: users.city,
        state: users.state,
        region: users.region,
        businessAddress: users.businessAddress,
        businessCity: users.businessCity,
        businessState: users.businessState,
        typicalRouteFrom: users.typicalRouteFrom,
        typicalRouteTo: users.typicalRouteTo,
        specialHandling: users.specialHandling,
        industry: users.industry,
        website: users.website,
        companySize: users.companySize,
        vehicleYear: users.vehicleYear,
        vinNumber: users.vinNumber,
        insuranceExpiry: users.insuranceExpiry,
        inspectionExpiry: users.inspectionExpiry,
      })
      .from(users)
      .innerJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return errorResponse("User not found.", 404);
    }
    const rows = await db
      .select({
        docTypeId: verificationDocumentTypes.id,
        name: verificationDocumentTypes.name,
        slug: verificationDocumentTypes.slug,
        isRequired: verificationDocumentTypes.isRequired,
        uploadedId: userDocuments.id,
        fileUrl: userDocuments.fileUrl,
        docStatus: userDocuments.status,
        adminNote: userDocuments.adminNote,
        uploadedAt: userDocuments.uploadedAt,
      })
      .from(verificationDocumentTypes)
      .leftJoin(
        userDocuments,
        and(
          eq(userDocuments.docTypeId, verificationDocumentTypes.id),
          eq(userDocuments.userId, userId)
        )
      )
      .where(eq(verificationDocumentTypes.roleId, user.roleId))
      .orderBy(asc(verificationDocumentTypes.sortOrder));

    const documents = rows.map((row) => ({
      docTypeId: row.docTypeId,
      userDocumentId: null,
      isOther: false,
      name: row.name,
      slug: row.slug,
      isRequired: row.isRequired,
      uploaded: row.uploadedId
        ? {
            id: row.uploadedId,
            fileUrl: row.fileUrl,
            status: row.docStatus,
            adminNote: row.adminNote,
            uploadedAt: row.uploadedAt,
          }
        : null,
    }));

    const otherRows = await db
      .select({
        id: userDocuments.id,
        otherDocName: userDocuments.otherDocName,
        fileUrl: userDocuments.fileUrl,
        docStatus: userDocuments.status,
        adminNote: userDocuments.adminNote,
        uploadedAt: userDocuments.uploadedAt,
      })
      .from(userDocuments)
      .where(and(eq(userDocuments.userId, userId), eq(userDocuments.isOther, true)))
      .orderBy(asc(userDocuments.uploadedAt));

    for (const r of otherRows) {
      documents.push({
        docTypeId: null,
        userDocumentId: r.id,
        isOther: true,
        name: r.otherDocName?.trim() || "Additional document",
        slug: null,
        isRequired: false,
        uploaded: {
          id: r.id,
          fileUrl: r.fileUrl || "",
          status: r.docStatus,
          adminNote: r.adminNote,
          uploadedAt: r.uploadedAt,
        },
      });
    }

    return successResponse("Verification data fetched.", {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        status: user.status,
        role: user.roleName,
        licenseNumber: user.licenseNumber,
        yearsExperience: user.yearsExperience,
        equipmentType: user.equipmentType,
        companyName: user.companyName,
        monthlyLoadEstimate: user.monthlyLoadEstimate,
        serviceType: user.serviceType,
        address: user.address,
        city: user.city,
        state: user.state,
        region: user.region,
        businessAddress: user.businessAddress,
        businessCity: user.businessCity,
        businessState: user.businessState,
        typicalRouteFrom: user.typicalRouteFrom,
        typicalRouteTo: user.typicalRouteTo,
        specialHandling: user.specialHandling,
        industry: user.industry,
        website: user.website,
        companySize: user.companySize,
        vehicleYear: user.vehicleYear,
        vinNumber: user.vinNumber,
        insuranceExpiry: user.insuranceExpiry,
        inspectionExpiry: user.inspectionExpiry,
      },
      documents,
    });
  } catch (error) {
    console.error("Verification GET error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}

const EDITABLE_FIELDS = [
  "fullName",
  "phone",
  "licenseNumber",
  "yearsExperience",
  "equipmentType",
  "companyName",
  "monthlyLoadEstimate",
  "serviceType",
  "address",
  "city",
  "state",
  "region",
  "businessAddress",
  "businessCity",
  "businessState",
  "typicalRouteFrom",
  "typicalRouteTo",
  "specialHandling",
  "industry",
  "website",
  "companySize",
  "vehicleYear",
  "vinNumber",
  "insuranceExpiry",
  "inspectionExpiry",
];

async function handlePatch(request) {
  try {
    const { userId } = request.user;
    const body = await request.json();

    const updates = {};
    for (const key of EDITABLE_FIELDS) {
      if (key in body) {
        const val = body[key];
        updates[key] = val == null || String(val).trim() === "" ? null : String(val).trim();
      }
    }

    if (Object.keys(updates).length === 0) {
      return errorResponse("No valid fields to update.", 400);
    }

    updates.updatedAt = new Date();

    await db.update(users).set(updates).where(eq(users.id, userId));

    return successResponse("Profile updated successfully.");
  } catch (error) {
    console.error("Verification PATCH error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}

export const GET = withAuth(handleGet);
export const PATCH = withAuth(handlePatch);
