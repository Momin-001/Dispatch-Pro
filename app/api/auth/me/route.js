import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, roles, rolePermissions, permissions } from "@/lib/db/schema";
import { withAuth } from "@/lib/middleware/with-auth";
import { successResponse, errorResponse } from "@/lib/response.handle";

async function handler(request) {
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
      })
      .from(users)
      .innerJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return errorResponse("User not found.", 404);
    }

    const permKeys = (
      await db
        .select({
          key: permissions.key,
          enabled: rolePermissions.enabled,
        })
        .from(rolePermissions)
        .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
        .where(eq(rolePermissions.roleId, user.roleId))
    )
      .filter((r) => r.enabled)
      .map((r) => r.key);

    return successResponse("User fetched successfully.", {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.roleName,
        status: user.status,
      },
      permissions: permKeys,
    });
  } catch (error) {
    console.error("Me error:", error);
    return errorResponse("Something went wrong. Please try again.", 500);
  }
}

export const GET = withAuth(handler);
