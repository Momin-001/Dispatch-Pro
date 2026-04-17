import { db } from "@/lib/db";
import { roles, permissions, rolePermissions } from "@/lib/db/schema";

const PERMISSIONS = [
  { key: "users.view", label: "View Users", module: "users" },
  { key: "users.create", label: "Create Users", module: "users" },
  { key: "users.edit", label: "Edit Users", module: "users" },
  { key: "users.delete", label: "Delete Users", module: "users" },

  { key: "loads.view", label: "View Loads", module: "loads" },
  { key: "loads.create", label: "Create Loads", module: "loads" },
  { key: "loads.edit", label: "Edit Loads", module: "loads" },
  { key: "loads.delete", label: "Delete Loads", module: "loads" },

  { key: "equipment.view", label: "View Equipment", module: "equipment" },
  { key: "equipment.create", label: "Create Equipment", module: "equipment" },
  { key: "equipment.edit", label: "Edit Equipment", module: "equipment" },
  { key: "equipment.delete", label: "Delete Equipment", module: "equipment" },

  { key: "documents.view", label: "View Documents", module: "documents" },
  { key: "documents.upload", label: "Upload Documents", module: "documents" },
  { key: "documents.review", label: "Review Documents", module: "documents" },

  { key: "courses.view", label: "View Courses", module: "courses" },
  { key: "courses.create", label: "Create Courses", module: "courses" },
  { key: "courses.edit", label: "Edit Courses", module: "courses" },
  { key: "courses.delete", label: "Delete Courses", module: "courses" },
  { key: "courses.enroll", label: "Enroll In Courses", module: "courses" },
  { key: "courses.purchase", label: "Purchase Courses", module: "courses" },

  { key: "blogs.view", label: "View Blogs", module: "blogs" },
  { key: "blogs.create", label: "Create Blogs", module: "blogs" },
  { key: "blogs.edit", label: "Edit Blogs", module: "blogs" },
  { key: "blogs.delete", label: "Delete Blogs", module: "blogs" },

  { key: "permissions.manage", label: "Manage Permissions", module: "permissions" },
];

/** Admin does not use these in-app; keep `enabled: false` in DB (not “all keys”). */
const ADMIN_DISABLED_PERMISSION_KEYS = new Set([
  "documents.upload",
  "courses.enroll",
  "courses.purchase",
]);

// Which permissions each role gets enabled
const ROLE_PERMISSION_MAP = {
  admin: PERMISSIONS.map((p) => p.key).filter((k) => !ADMIN_DISABLED_PERMISSION_KEYS.has(k)),

  dispatcher: [
    "loads.view", "loads.create", "loads.edit",
    "documents.view",
    "courses.view", "courses.enroll", "courses.purchase",
  ],

  driver: [
    "loads.view", "loads.edit",
    "documents.view", "documents.upload",
    "courses.view", "courses.enroll", "courses.purchase",
  ],

  shipper: [
    "loads.view",
    "documents.view",
  ],

  owner_operator: [
    "loads.view",
    "equipment.view", "equipment.edit",
    "documents.view", "documents.upload",
    "courses.view", "courses.enroll", "courses.purchase",
  ],
};

export async function seedPermissions() {
  console.log("Seeding permissions...");

  for (const perm of PERMISSIONS) {
    await db
      .insert(permissions)
      .values(perm)
      .onConflictDoNothing({ target: permissions.key });
  }
  console.log(`  ✓ ${PERMISSIONS.length} permissions seeded`);

  console.log("Seeding role_permissions...");

  const allRoles = await db.select().from(roles);
  const allPerms = await db.select().from(permissions);

  const inserts = [];

  for (const role of allRoles) {
    const enabledKeys = ROLE_PERMISSION_MAP[role.name] || [];
  
    for (const perm of allPerms) {
      inserts.push({
        roleId: role.id,
        permissionId: perm.id,
        enabled: enabledKeys.includes(perm.key),
      });
    }
  }
  
  await db.insert(rolePermissions).values(inserts).onConflictDoNothing({
    target: [rolePermissions.roleId, rolePermissions.permissionId],
  });

  console.log("  ✓ role_permissions seeded for all roles");
}
