import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { roles, permissions, rolePermissions } from "@/lib/db/schema";

const PERMISSIONS = [
  { key: "users.view", label: "View Users", module: "users" },
  { key: "users.create", label: "Create Users", module: "users" },
  { key: "users.edit", label: "Edit Users", module: "users" },
  { key: "users.delete", label: "Delete Users", module: "users" },
  { key: "users.approve", label: "Approve Users", module: "users" },

  { key: "loads.view", label: "View Loads", module: "loads" },
  { key: "loads.create", label: "Create Loads", module: "loads" },
  { key: "loads.edit", label: "Edit Loads", module: "loads" },
  { key: "loads.delete", label: "Delete Loads", module: "loads" },
  { key: "loads.assign", label: "Assign Loads", module: "loads" },

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
  { key: "courses.enroll", label: "Enroll in Courses", module: "courses" },

  { key: "blogs.view", label: "View Blogs", module: "blogs" },
  { key: "blogs.create", label: "Create Blogs", module: "blogs" },
  { key: "blogs.edit", label: "Edit Blogs", module: "blogs" },
  { key: "blogs.delete", label: "Delete Blogs", module: "blogs" },

  { key: "reports.view", label: "View Reports", module: "reports" },

  { key: "notifications.view", label: "View Notifications", module: "notifications" },

  { key: "profile.view", label: "View Profile", module: "profile" },
  { key: "profile.edit", label: "Edit Profile", module: "profile" },

  { key: "permissions.manage", label: "Manage Permissions", module: "permissions" },
];

// Which permissions each role gets enabled
const ROLE_PERMISSION_MAP = {
  admin: PERMISSIONS.map((p) => p.key),

  dispatcher: [
    "loads.view", "loads.create", "loads.edit", "loads.assign",
    "documents.view",
    "courses.view", "courses.enroll",
    "reports.view",
    "notifications.view",
    "profile.view", "profile.edit",
  ],

  driver: [
    "loads.view",
    "documents.view", "documents.upload",
    "courses.view", "courses.enroll",
    "notifications.view",
    "profile.view", "profile.edit",
  ],

  shipper: [
    "loads.view",
    "documents.view",
    "reports.view",
    "notifications.view",
    "profile.view", "profile.edit",
  ],

  owner_operator: [
    "loads.view",
    "equipment.view", "equipment.create", "equipment.edit",
    "documents.view", "documents.upload",
    "courses.view", "courses.enroll",
    "reports.view",
    "notifications.view",
    "profile.view", "profile.edit",
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

  const permByKey = Object.fromEntries(allPerms.map((p) => [p.key, p.id]));

  for (const role of allRoles) {
    const enabledKeys = ROLE_PERMISSION_MAP[role.name] || [];

    for (const perm of allPerms) {
      await db
        .insert(rolePermissions)
        .values({
          roleId: role.id,
          permissionId: perm.id,
          enabled: enabledKeys.includes(perm.key),
        })
        .onConflictDoNothing();
    }
  }

  console.log("  ✓ role_permissions seeded for all roles");
}
