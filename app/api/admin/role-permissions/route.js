import { eq, and, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { roles, permissions, rolePermissions } from "@/lib/db/schema";
import { successResponse, errorResponse } from "@/lib/response.handle";
import {
  PERMISSION_MATRIX_ROWS,
  ADMIN_PERMISSION_MATRIX_DISPLAY,
  ROLE_PERMISSION_MATRIX_CELL,
} from "@/lib/helpers";

const NON_ADMIN_ROLES = ["dispatcher", "driver", "shipper", "owner_operator"];

function isToggleCell(roleName, permissionKey) {
  return ROLE_PERMISSION_MATRIX_CELL[roleName]?.[permissionKey] === "toggle";
}

async function handleGet() {
  try {
    const keys = PERMISSION_MATRIX_ROWS.map((r) => r.key);

    const permRows = await db
      .select({ id: permissions.id, key: permissions.key })
      .from(permissions)
      .where(inArray(permissions.key, keys));

    if (permRows.length !== keys.length) {
      const found = new Set(permRows.map((p) => p.key));
      const missing = keys.filter((k) => !found.has(k));
      return errorResponse(
        `Missing permission keys in database: ${missing.join(", ")}. Run db seed.`,
        500
      );
    }

    const permIdByKey = Object.fromEntries(permRows.map((p) => [p.key, p.id]));

    const roleRows = await db
      .select({ id: roles.id, name: roles.name })
      .from(roles)
      .where(inArray(roles.name, [...NON_ADMIN_ROLES, "admin"]));

    const roleIdByName = Object.fromEntries(roleRows.map((r) => [r.name, r.id]));

    const nonAdminRoleIds = NON_ADMIN_ROLES.map((n) => roleIdByName[n]).filter(Boolean);

    const rpRows = await db
      .select({
        roleId: rolePermissions.roleId,
        permissionId: rolePermissions.permissionId,
        enabled: rolePermissions.enabled,
      })
      .from(rolePermissions)
      .where(
        and(
          inArray(rolePermissions.roleId, nonAdminRoleIds),
          inArray(
            rolePermissions.permissionId,
            permRows.map((p) => p.id)
          )
        )
      );

    const enabledLookup = new Map();
    for (const rp of rpRows) {
      enabledLookup.set(`${rp.roleId}:${rp.permissionId}`, rp.enabled);
    }

    const matrix = PERMISSION_MATRIX_ROWS.map((row) => {
      const admin = ADMIN_PERMISSION_MATRIX_DISPLAY[row.key] || "cross";
      const roleCells = {};
      for (const roleName of NON_ADMIN_ROLES) {
        const mode = ROLE_PERMISSION_MATRIX_CELL[roleName]?.[row.key] || "cross";
        if (mode === "toggle") {
          const rid = roleIdByName[roleName];
          const pid = permIdByKey[row.key];
          const enabled = enabledLookup.get(`${rid}:${pid}`) ?? false;
          roleCells[roleName] = { kind: "toggle", enabled };
        } else {
          roleCells[roleName] = { kind: "cross" };
        }
      }
      return {
        key: row.key,
        label: row.label,
        admin,
        roles: roleCells,
      };
    });

    return successResponse("Permission matrix loaded.", { matrix });
  } catch (error) {
    console.error("role-permissions GET error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}

async function handlePatch(request) {
  try {
    const body = await request.json();
    const { roleName, permissionKey, enabled } = body;

    if (!roleName || !permissionKey || typeof enabled !== "boolean") {
      return errorResponse("roleName, permissionKey, and enabled (boolean) are required.", 400);
    }

    if (roleName === "admin") {
      return errorResponse("Admin permissions cannot be changed.", 400);
    }

    if (!NON_ADMIN_ROLES.includes(roleName)) {
      return errorResponse("Invalid role.", 400);
    }

    if (!isToggleCell(roleName, permissionKey)) {
      return errorResponse("This permission cannot be toggled for that role.", 400);
    }

    const [role] = await db
      .select({ id: roles.id })
      .from(roles)
      .where(eq(roles.name, roleName))
      .limit(1);

    const [perm] = await db
      .select({ id: permissions.id })
      .from(permissions)
      .where(eq(permissions.key, permissionKey))
      .limit(1);

    if (!role || !perm) {
      return errorResponse("Role or permission not found.", 404);
    }

    const [existingRp] = await db
      .select({ id: rolePermissions.id })
      .from(rolePermissions)
      .where(
        and(
          eq(rolePermissions.roleId, role.id),
          eq(rolePermissions.permissionId, perm.id)
        )
      )
      .limit(1);

    if (existingRp) {
      await db
        .update(rolePermissions)
        .set({ enabled })
        .where(eq(rolePermissions.id, existingRp.id));
    } else {
      await db.insert(rolePermissions).values({
        roleId: role.id,
        permissionId: perm.id,
        enabled,
      });
    }

    return successResponse("Permission updated.");
  } catch (error) {
    console.error("role-permissions PATCH error:", error);
    return errorResponse("Something went wrong.", 500);
  }
}

export const GET = handleGet;
export const PATCH = handlePatch;
