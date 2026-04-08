import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { roles, verificationDocumentTypes } from "@/lib/db/schema";

const DOC_TYPES_BY_ROLE = {
  driver: [
    { name: "CDL License", slug: "driver-cdl-license", sortOrder: 1 },
    { name: "Insurance", slug: "driver-insurance", sortOrder: 2 },
    { name: "ID Card", slug: "driver-id-card", sortOrder: 3 },
  ],
  dispatcher: [
    { name: "Resume", slug: "dispatcher-resume", sortOrder: 1 },
    { name: "ID Card", slug: "dispatcher-id-card", sortOrder: 2 },
    { name: "Experience Certificate", slug: "dispatcher-experience-cert", sortOrder: 3 },
  ],
  shipper: [
    { name: "Business License", slug: "shipper-business-license", sortOrder: 1 },
    { name: "Tax Certificates", slug: "shipper-tax-certificates", sortOrder: 2 },
  ],
  owner_operator: [
    { name: "CDL", slug: "owner-operator-cdl", sortOrder: 1 },
    { name: "Insurance", slug: "owner-operator-insurance", sortOrder: 2 },
    { name: "Truck Registration", slug: "owner-operator-truck-registration", sortOrder: 3 },
    { name: "Inspection Certificate", slug: "owner-operator-inspection-cert", sortOrder: 4 },
  ],
};

export async function seedDocumentTypes() {
  console.log("Seeding verification document types...");

  const allRoles = await db.select().from(roles);
  const roleByName = Object.fromEntries(allRoles.map((r) => [r.name, r.id]));

  let count = 0;
  for (const [roleName, docs] of Object.entries(DOC_TYPES_BY_ROLE)) {
    const roleId = roleByName[roleName];
    if (!roleId) {
      console.warn(`  ⚠ Role "${roleName}" not found, skipping`);
      continue;
    }

    for (const doc of docs) {
      await db
        .insert(verificationDocumentTypes)
        .values({ ...doc, roleId, isRequired: true })
        .onConflictDoNothing({ target: verificationDocumentTypes.slug });
      count++;
    }
  }

  console.log(`  ✓ ${count} document types seeded`);
}
