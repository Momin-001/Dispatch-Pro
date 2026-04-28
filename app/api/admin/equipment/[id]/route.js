import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { equipment } from "@/lib/db/schema";
import { successResponse, errorResponse } from "@/lib/response.handle";
import { isValidUuid } from "@/lib/helpers";

const VALID_STATUS = new Set(["active", "inactive"]);
const VALID_CATEGORY = new Set(["system", "owner_operator"]);

async function handleGet(_request, {params}) {
  try {
    const { id } = await params;
    if (!isValidUuid(id)) return errorResponse("Invalid equipment id.", 400);

    const [row] = await db
      .select({
        id: equipment.id,
        category: equipment.category,
        ownerOperatorId: equipment.ownerOperatorId,
        equipmentType: equipment.equipmentType,
        registrationNumber: equipment.registrationNumber,
        vinNumber: equipment.vinNumber,
        insuranceExpiry: equipment.insuranceExpiry,
        inspectionExpiry: equipment.inspectionExpiry,
        vehicleYear: equipment.vehicleYear,
        status: equipment.status,
        createdAt: equipment.createdAt,
        updatedAt: equipment.updatedAt,
      })
      .from(equipment)
      .where(eq(equipment.id, id))
      .limit(1);

    if (!row) return errorResponse("Equipment not found.", 404);

    return successResponse("Equipment fetched.", { equipment: row });
  } catch (error) {
    console.error("Admin equipment [id] GET error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}

async function handlePatch(request, {params}) {
  try {
    const { id } = await params;
    if (!isValidUuid(id)) return errorResponse("Invalid equipment id.", 400);

    const body = await request.json();
    const {
      category,
      ownerOperatorId,
      equipmentType,
      registrationNumber,
      vinNumber,
      insuranceExpiry,
      inspectionExpiry,
      vehicleYear,
      status,
    } = body || {};

    const cat = String(category || "system").trim();
    if (!VALID_CATEGORY.has(cat)) return errorResponse("Invalid category.", 400);

    const type = String(equipmentType || "").trim();
    if (!type) return errorResponse("Equipment type is required.", 400);

    const reg = String(registrationNumber || "").trim();
    if (!reg) return errorResponse("Registration number is required.", 400);

    const vin = String(vinNumber || "").trim();
    if (!vin) return errorResponse("VIN number is required.", 400);

    const year = String(vehicleYear || "").trim();
    if (!/^\d{4}$/.test(year)) return errorResponse("Vehicle year must be a 4-digit year.", 400);

    const st = String(status || "active").trim();
    if (!VALID_STATUS.has(st)) return errorResponse("Invalid status.", 400);

    let ooId = ownerOperatorId ? String(ownerOperatorId).trim() : null;
    if (cat === "owner_operator" && !ooId) {
      return errorResponse("Owner operator is required.", 400);
    }
    if (cat !== "owner_operator") {
      ooId = null;
    }

    const [updated] = await db
      .update(equipment)
      .set({
        category: cat,
        ownerOperatorId: ooId,
        equipmentType: type,
        registrationNumber: reg,
        vinNumber: vin,
        insuranceExpiry: insuranceExpiry ? String(insuranceExpiry) : null,
        inspectionExpiry: inspectionExpiry ? String(inspectionExpiry) : null,
        vehicleYear: year,
        status: st,
        updatedAt: new Date(),
      })
      .where(eq(equipment.id, id))
      .returning({ id: equipment.id });

    if (!updated) return errorResponse("Equipment not found.", 404);

    return successResponse("Equipment updated successfully.", { id: updated.id });
  } catch (error) {
    console.error("Admin equipment [id] PATCH error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}

export const GET = handleGet;
export const PATCH = handlePatch;

