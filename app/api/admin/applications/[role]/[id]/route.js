import { eq, and, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, roles, verificationDocumentTypes, userDocuments } from "@/lib/db/schema";
import { successResponse, errorResponse } from "@/lib/response.handle";

const VALID_ROLES = ["driver", "dispatcher", "shipper", "owner_operator"];

async function handleGet(request, { params }) {
  try {

    const { role: roleParam, id: userId } = await params;

    if (!VALID_ROLES.includes(roleParam)) {
      return errorResponse("Invalid role.", 400);
    }

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
        createdAt: users.createdAt,
      })
      .from(users)
      .innerJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return errorResponse("User not found.", 404);
    }

    if (user.roleName !== roleParam) {
      return errorResponse("Application not found for this role.", 404);
    }

    const rows = await db
      .select({
        docId: userDocuments.id,
        docTypeId: userDocuments.docTypeId,
        docTypeName: verificationDocumentTypes.name,
        docTypeSlug: verificationDocumentTypes.slug,
        isRequired: verificationDocumentTypes.isRequired,
        fileUrl: userDocuments.fileUrl,
        docStatus: userDocuments.status,
        adminNote: userDocuments.adminNote,
        isOther: userDocuments.isOther,
        otherDocName: userDocuments.otherDocName,
        uploadedAt: userDocuments.uploadedAt,
        reviewedAt: userDocuments.reviewedAt,
      })
      .from(userDocuments)
      .leftJoin(verificationDocumentTypes, eq(userDocuments.docTypeId, verificationDocumentTypes.id))
      .where(eq(userDocuments.userId, userId))
      .orderBy(asc(userDocuments.uploadedAt));

    const requiredDocs = await db
      .select({
        id: verificationDocumentTypes.id,
        name: verificationDocumentTypes.name,
        slug: verificationDocumentTypes.slug,
        isRequired: verificationDocumentTypes.isRequired,
      })
      .from(verificationDocumentTypes)
      .where(eq(verificationDocumentTypes.roleId, user.roleId))
      .orderBy(asc(verificationDocumentTypes.sortOrder));

    const uploadedByDocType = {};
    const otherDocs = [];
    for (const r of rows) {
      if (r.isOther) {
        otherDocs.push(r);
      } else if (r.docTypeId) {
        uploadedByDocType[r.docTypeId] = r;
      }
    }

    const documents = requiredDocs.map((dt) => {
      const uploaded = uploadedByDocType[dt.id];
      return {
        docTypeId: dt.id,
        name: dt.name,
        slug: dt.slug,
        isRequired: dt.isRequired,
        isOther: false,
        uploaded: uploaded
          ? {
              id: uploaded.docId,
              fileUrl: uploaded.fileUrl,
              status: uploaded.docStatus,
              adminNote: uploaded.adminNote,
              uploadedAt: uploaded.uploadedAt,
              reviewedAt: uploaded.reviewedAt,
            }
          : null,
      };
    });

    for (const od of otherDocs) {
      documents.push({
        docTypeId: od.docTypeId,
        name: od.otherDocName || "Other Document",
        slug: null,
        isRequired: false,
        isOther: true,
        uploaded: {
          id: od.docId,
          fileUrl: od.fileUrl,
          status: od.docStatus,
          adminNote: od.adminNote,
          uploadedAt: od.uploadedAt,
          reviewedAt: od.reviewedAt,
        },
      });
    }

    return successResponse("Application detail fetched.", { user, documents });
  } catch (error) {
    console.error("Application detail GET error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}

export const GET = handleGet;
