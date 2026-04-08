import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { roles, permissions, rolePermissions } from "@/lib/db/schema";
import { errorResponse } from "@/lib/response.handle";
import { withAuth } from "./with-auth";

/**
 * Higher-order function that wraps an API route handler with both
 * authentication AND permission checking.
 *
 * Queries the database to verify the user's role has the required
 * permission enabled. This ensures real-time permission enforcement
 * even after admin toggles.
 *
 * @param {string} permissionKey - e.g. "loads.create", "users.approve"
 * @param {Function} handler - the route handler (request, context)
 */
export function withPermission(permissionKey, handler) {
  return withAuth(async (request, context) => {
    const { userId, role: roleName } = request.user;

    const result = await db
      .select({
        enabled: rolePermissions.enabled,
      })
      .from(rolePermissions)
      .innerJoin(roles, eq(rolePermissions.roleId, roles.id))
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(
        and(
          eq(roles.name, roleName),
          eq(permissions.key, permissionKey)
        )
      )
      .limit(1);

    if (!result.length || !result[0].enabled) {
      return errorResponse(
        "Permission denied. Please refresh to access new permissions for your role.",
        403
      );
    }

    return handler(request, context);
  });
}
