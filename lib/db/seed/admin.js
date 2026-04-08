import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users, roles } from "@/lib/db/schema";

export async function seedAdmin() {
  console.log("Seeding admin user...");

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn("  ⚠ ADMIN_EMAIL or ADMIN_PASSWORD not set in .env — skipping admin seed");
    return;
  }

  const [adminRole] = await db
    .select()
    .from(roles)
    .where(eq(roles.name, "admin"))
    .limit(1);

  if (!adminRole) {
    console.warn("  ⚠ Admin role not found — run role seed first");
    return;
  }

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length > 0) {
    console.log("  ✓ Admin already exists, skipping");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.insert(users).values({
    fullName: "System Admin",
    email,
    passwordHash,
    roleId: adminRole.id,
    status: "approved",
  });

  console.log(`  ✓ Admin user created (${email})`);
}
