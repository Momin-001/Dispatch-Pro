import { eq, and, ne, ilike, or, sql, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, roles } from "@/lib/db/schema";
import { successResponse, errorResponse } from "@/lib/response.handle";

const VALID_ROLES = ["driver", "dispatcher", "shipper", "owner_operator"];
const PER_PAGE = 10;

async function handleGet(request, { params }) {
  try {
    const { role: roleParam } = await params;

    if (!VALID_ROLES.includes(roleParam)) {
      return errorResponse("Invalid role.", 400);
    }

    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const search = (url.searchParams.get("search") || "").trim();
    const statusFilter = (url.searchParams.get("status") || "").trim();
    const experienceFilter = (url.searchParams.get("experience") || "").trim();
    const stateFilter = (url.searchParams.get("state") || "").trim();
    const companyFilter = (url.searchParams.get("company") || "").trim();
    const regionFilter = (url.searchParams.get("region") || "").trim();
    const industryFilter = (url.searchParams.get("industry") || "").trim();
    const equipmentTypeFilter = (url.searchParams.get("equipmentType") || "").trim();

    const [role] = await db.select({ id: roles.id }).from(roles).where(eq(roles.name, roleParam)).limit(1);
    if (!role) return errorResponse("Role not found.", 400);

    const conditions = [
      eq(users.roleId, role.id),
      ne(users.status, "pending_password"),
    ];

    if (search) {
      if (roleParam === "shipper") {
        conditions.push(
          or(ilike(users.fullName, `%${search}%`), ilike(users.companyName, `%${search}%`))
        );
      } else if (roleParam === "owner_operator") {
        conditions.push(ilike(users.fullName, `%${search}%`));
      } else {
        conditions.push(
          or(
            ilike(users.fullName, `%${search}%`),
            ilike(users.email, `%${search}%`),
            ilike(users.cdlNumber, `%${search}%`)
          )
        );
      }
    }

    if (statusFilter) {
      conditions.push(eq(users.status, statusFilter));
    }

    if (experienceFilter) {
      conditions.push(ilike(users.yearsExperience, `%${experienceFilter}%`));
    }

    if (stateFilter) {
      conditions.push(ilike(users.state, `%${stateFilter}%`));
    }

    if (companyFilter) {
      conditions.push(ilike(users.companyName, `%${companyFilter}%`));
    }

    if (regionFilter) {
      conditions.push(ilike(users.region, `%${regionFilter}%`));
    }

    if (industryFilter) {
      conditions.push(ilike(users.industry, `%${industryFilter}%`));
    }

    if (equipmentTypeFilter) {
      conditions.push(ilike(users.equipmentType, `%${equipmentTypeFilter}%`));
    }

    const whereClause = and(...conditions);

    const [{ count: totalCount }] = await db
      .select({ count: sql`count(*)::int` })
      .from(users)
      .where(whereClause);

    const offset = (page - 1) * PER_PAGE;

    const rows = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        phone: users.phone,
        status: users.status,
        cdlNumber: users.cdlNumber,
        yearsExperience: users.yearsExperience,
        equipmentType: users.equipmentType,
        shippmentType: users.shippmentType,
        companyName: users.companyName,
        monthlyLoadEstimate: users.monthlyLoadEstimate,
        registrationNumber: users.registrationNumber,
        state: users.state,
        region: users.region,
        industry: users.industry,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(whereClause)
      .orderBy(desc(users.createdAt))
      .limit(PER_PAGE)
      .offset(offset);

    return successResponse("Applications fetched.", {
      applications: rows,
      total: totalCount,
      page,
      perPage: PER_PAGE,
      totalPages: Math.ceil(totalCount / PER_PAGE),
    });
  } catch (error) {
    console.error("Applications GET error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}

export const GET = handleGet;
