import { db } from "@/lib/db";
import { roles } from "@/lib/db/schema";

const ROLES = [
  { name: "admin" },
  { name: "driver" },
  { name: "dispatcher" },
  { name: "shipper" },
  { name: "owner_operator" },
];

export async function seedRoles() {
  console.log("Seeding roles...");

  for (const role of ROLES) {
    await db
      .insert(roles)
      .values(role)
      .onConflictDoNothing({ target: roles.name });
  }

  console.log(`  ✓ ${ROLES.length} roles seeded`);
}
