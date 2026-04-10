import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

const USERS = [
  { fullName: "Driver 1", email: "driver@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 2, status: "pending_approval" },
  { fullName: "Driver 2", email: "driver1@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 2, status: "pending_approval" },
  { fullName: "Driver 3", email: "driver3@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 2, status: "pending_approval" },
  { fullName: "Driver 4", email: "driver4@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 2, status: "pending_approval" },
  { fullName: "Driver 5", email: "driver5@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 2, status: "pending_approval" },
  { fullName: "Driver 6", email: "driver6@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 2, status: "pending_approval" },
  { fullName: "Driver 7", email: "driver7@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 2, status: "pending_approval" },
  { fullName: "Driver 8", email: "driver8@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 2, status: "pending_approval" },
  { fullName: "Driver 9", email: "driver9@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 2, status: "pending_approval" },
  { fullName: "Driver 10", email: "driver10@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 2, status: "pending_approval" },
];

export async function seedUsers() {
  console.log("Seeding users...");

  for (const user of USERS) {
    await db
      .insert(users)
      .values(user)
      .onConflictDoNothing({ target: users.email });
  }

  console.log(`  ✓ ${USERS.length} users seeded`);
}
