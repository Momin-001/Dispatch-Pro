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
  { fullName: "Driver 11", email: "driver11@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 2, status: "pending_approval" },
  { fullName: "Driver 12", email: "driver12@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 2, status: "pending_approval" },
  { fullName: "Driver 13", email: "driver13@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 2, status: "pending_approval" },
  { fullName: "Driver 14", email: "driver14@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 2, status: "pending_approval" },
  { fullName: "Driver 15", email: "driver15@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 2, status: "pending_approval" },
  { fullName: "Driver 16", email: "driver16@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 2, status: "pending_approval" },
  { fullName: "Driver 17", email: "driver17@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 2, status: "pending_approval" },
  { fullName: "Driver 18", email: "driver18@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 2, status: "pending_approval" },

  { fullName: "Dispatcher 1", email: "dispatcher@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 3, status: "pending_approval" },
  { fullName: "Dispatcher 2", email: "dispatcher1@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 3, status: "pending_approval" },
  { fullName: "Dispatcher 3", email: "dispatcher3@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 3, status: "pending_approval" },
  { fullName: "Dispatcher 4", email: "dispatcher4@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 3, status: "pending_approval" },
  { fullName: "Dispatcher 5", email: "dispatcher5@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 3, status: "pending_approval" },
  { fullName: "Dispatcher 6", email: "dispatcher6@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 3, status: "pending_approval" },
  { fullName: "Dispatcher 7", email: "dispatcher7@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 3, status: "pending_approval" },
  { fullName: "Dispatcher 8", email: "dispatcher8@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 3, status: "pending_approval" },
  { fullName: "Dispatcher 9", email: "dispatcher9@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 3, status: "pending_approval" },
  { fullName: "Dispatcher 10", email: "dispatcher10@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 3, status: "pending_approval" },
  { fullName: "Dispatcher 11", email: "dispatcher11@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 3, status: "pending_approval" },
  { fullName: "Dispatcher 12", email: "dispatcher12@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 3, status: "pending_approval" },
  { fullName: "Dispatcher 13", email: "dispatcher13@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 3, status: "pending_approval" },
  { fullName: "Dispatcher 14", email: "dispatcher14@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 3, status: "pending_approval" },
  { fullName: "Dispatcher 15", email: "dispatcher15@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 3, status: "pending_approval" },
  { fullName: "Dispatcher 16", email: "dispatcher16@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 3, status: "pending_approval" },
  { fullName: "Dispatcher 17", email: "dispatcher17@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 3, status: "pending_approval" },
  { fullName: "Dispatcher 18", email: "dispatcher18@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 3, status: "pending_approval" },

  { fullName: "Shipper 1", email: "shipper@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 4, status: "pending_approval" },
  { fullName: "Shipper 2", email: "shipper1@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 4, status: "pending_approval" },
  { fullName: "Shipper 3", email: "shipper3@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 4, status: "pending_approval" },
  { fullName: "Shipper 4", email: "shipper4@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 4, status: "pending_approval" },
  { fullName: "Shipper 5", email: "shipper5@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 4, status: "pending_approval" },
  { fullName: "Shipper 6", email: "shipper6@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 4, status: "pending_approval" },
  { fullName: "Shipper 7", email: "shipper7@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 4, status: "pending_approval" },
  { fullName: "Shipper 8", email: "shipper8@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 4, status: "pending_approval" },
  { fullName: "Shipper 9", email: "shipper9@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 4, status: "pending_approval" },
  { fullName: "Shipper 10", email: "shipper10@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 4, status: "pending_approval" },
  { fullName: "Shipper 11", email: "shipper11@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 4, status: "pending_approval" },
  { fullName: "Shipper 12", email: "shipper12@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 4, status: "pending_approval" },
  { fullName: "Shipper 13", email: "shipper13@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 4, status: "pending_approval" },
  { fullName: "Shipper 14", email: "shipper14@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 4, status: "pending_approval" },
  { fullName: "Shipper 15", email: "shipper15@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 4, status: "pending_approval" },
  { fullName: "Shipper 16", email: "shipper16@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 4, status: "pending_approval" },
  { fullName: "Shipper 17", email: "shipper17@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 4, status: "pending_approval" },
  { fullName: "Shipper 18", email: "shipper18@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 4, status: "pending_approval" },

  { fullName: "Owner Operator 1", email: "owner_operator@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 5, status: "pending_approval" },
  { fullName: "Owner Operator 2", email: "owner_operator1@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 5, status: "pending_approval" },
  { fullName: "Owner Operator 3", email: "owner_operator3@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 5, status: "pending_approval" },
  { fullName: "Owner Operator 4", email: "owner_operator4@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 5, status: "pending_approval" },
  { fullName: "Owner Operator 5", email: "owner_operator5@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 5, status: "pending_approval" },
  { fullName: "Owner Operator 6", email: "owner_operator6@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 5, status: "pending_approval" },
  { fullName: "Owner Operator 7", email: "owner_operator7@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 5, status: "pending_approval" },
  { fullName: "Owner Operator 8", email: "owner_operator8@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 5, status: "pending_approval" },
  { fullName: "Owner Operator 9", email: "owner_operator9@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 5, status: "pending_approval" },
  { fullName: "Owner Operator 10", email: "owner_operator10@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 5, status: "pending_approval" },
  { fullName: "Owner Operator 11", email: "owner_operator11@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 5, status: "pending_approval" },
  { fullName: "Owner Operator 12", email: "owner_operator12@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 5, status: "pending_approval" },
  { fullName: "Owner Operator 13", email: "owner_operator13@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 5, status: "pending_approval" },
  { fullName: "Owner Operator 14", email: "owner_operator14@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 5, status: "pending_approval" },
  { fullName: "Owner Operator 15", email: "owner_operator15@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 5, status: "pending_approval" },
  { fullName: "Owner Operator 16", email: "owner_operator16@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 5, status: "pending_approval" },
  { fullName: "Owner Operator 17", email: "owner_operator17@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 5, status: "pending_approval" },
  { fullName: "Owner Operator 18", email: "owner_operator18@example.com", passwordHash: "$2b$12$mUwWNcZ4Q890IanxcLhY4eCWYfgousNh6kQnOwEGdleqdj.x7m1Ty", roleId: 5, status: "pending_approval" },


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
