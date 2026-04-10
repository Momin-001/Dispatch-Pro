import { seedRoles } from "./roles.js";
import { seedPermissions } from "./permissions.js";
import { seedDocumentTypes } from "./documents.js";
import { seedAdmin } from "./admin.js";
import { seedUsers } from "./users.js";

async function main() {
  console.log("=== Starting database seed ===\n");

  // await seedRoles();
  // await seedPermissions();
  // await seedDocumentTypes();
  // await seedAdmin();
  await seedUsers();
  console.log("\n=== Seed complete ===");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
