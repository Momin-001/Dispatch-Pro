import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { equipment } from "@/lib/db/schema";
import { successResponse, errorResponse } from "@/lib/response.handle";

const PER_PAGE = 10;
const VALID_STATUS = new Set(["active", "inactive"]);
const VALID_CATEGORY = new Set(["system", "owner_operator"]);

async function handleGet(request) {
  try {
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const search = (url.searchParams.get("search") || "").trim();
    const status = (url.searchParams.get("status") || "").trim();

    const conditions = [];
    if (search) {
      conditions.push(ilike(equipment.equipmentType, `%${search}%`));
    }
    if (status && VALID_STATUS.has(status)) {
      conditions.push(eq(equipment.status, status));
    }

    const whereClause = conditions.length ? and(...conditions) : undefined;

    const [{ count: totalCount }] = await db
      .select({ count: sql`count(*)::int` })
      .from(equipment)
      .where(whereClause);

    const offset = (page - 1) * PER_PAGE;

    const rows = await db
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
      .where(whereClause)
      .orderBy(desc(equipment.createdAt))
      .limit(PER_PAGE)
      .offset(offset);

    return successResponse("Equipment fetched.", {
      equipment: rows,
      total: totalCount,
      page,
      perPage: PER_PAGE,
      totalPages: Math.max(1, Math.ceil(totalCount / PER_PAGE)),
    });
  } catch (error) {
    console.error("Admin equipment GET error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}

async function handlePost(request) {
  try {
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

    const [created] = await db
      .insert(equipment)
      .values({
        category: cat,
        ownerOperatorId: ooId,
        equipmentType: type,
        registrationNumber: reg,
        vinNumber: vin,
        insuranceExpiry: insuranceExpiry ? String(insuranceExpiry) : null,
        inspectionExpiry: inspectionExpiry ? String(inspectionExpiry) : null,
        vehicleYear: year,
        status: st,
      })
      .returning({ id: equipment.id });

    return successResponse("Equipment created successfully.", { id: created.id });
  } catch (error) {
    console.error("Admin equipment POST error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}

export const GET = handleGet;
export const POST = handlePost;

