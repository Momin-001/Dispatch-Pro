import { eq, and, ne, ilike, or, sql, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, roles } from "@/lib/db/schema";
import { withAuth } from "@/lib/middleware/with-auth";
import { successResponse, errorResponse } from "@/lib/response.handle";

const PER_PAGE = 10;

async function handleGet(request) {
  try {

    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const search = (url.searchParams.get("search") || "").trim();
    const roleFilter = (url.searchParams.get("role") || "").trim();
    const statusFilter = (url.searchParams.get("status") || "").trim();

    const conditions = [ne(users.status, "pending_password")];

    if (search) {
      conditions.push(
        or(
          ilike(users.fullName, `%${search}%`),
          ilike(users.email, `%${search}%`)
        )
      );
    }

    if (roleFilter) {
      const [role] = await db
        .select({ id: roles.id })
        .from(roles)
        .where(eq(roles.name, roleFilter))
        .limit(1);
      if (role) {
        conditions.push(eq(users.roleId, role.id));
      }
    }

    if (statusFilter) {
      conditions.push(eq(users.status, statusFilter));
    }

    const whereClause = and(...conditions , ne(users.status, "pending_password"), ne(users.status, "rejected"), ne(users.status, "pending_approval"));

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
        status: users.status,
        roleName: roles.name,
        createdAt: users.createdAt,
      })
      .from(users)
      .innerJoin(roles, eq(users.roleId, roles.id))
      .where(whereClause)
      .orderBy(desc(users.createdAt))
      .limit(PER_PAGE)
      .offset(offset);

    return successResponse("Users fetched.", {
      users: rows,
      total: totalCount,
      page,
      perPage: PER_PAGE,
      totalPages: Math.ceil(totalCount / PER_PAGE),
    });
  } catch (error) {
    console.error("Admin users GET error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}

export const GET = withAuth(handleGet);
