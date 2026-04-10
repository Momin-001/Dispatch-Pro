import { pgTable, uuid, varchar, integer, timestamp, text, date, pgEnum } from "drizzle-orm/pg-core";
import { roles } from "./roles.js";

export const userStatusEnum = pgEnum("user_status", [
  "pending_password",
  "pending_approval",
  "approved",
  "suspended",
  "rejected",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 30 }),
  passwordHash: varchar("password_hash", { length: 255 }),
  roleId: integer("role_id")
    .notNull()
    .references(() => roles.id, { onDelete: "restrict" }),
  status: userStatusEnum("status").notNull().default("pending_password"),

  /** Generic profile fields — only some are filled per role; rest stay null. */
  licenseNumber: varchar("license_number", { length: 100 }),
  yearsExperience: varchar("years_experience", { length: 10 }),
  equipmentType: varchar("equipment_type", { length: 200 }),
  companyName: varchar("company_name", { length: 255 }),
  monthlyLoadEstimate: varchar("monthly_load_estimate", { length: 50 }),
  serviceType: varchar("service_type", { length: 200 }),

  address: text("address"),
  city: varchar("city", { length: 255 }),
  state: varchar("state", { length: 255 }),
  region: varchar("region", { length: 255 }),

  /** Shipper-specific */
  businessAddress: text("business_address"),
  businessCity: varchar("business_city", { length: 255 }),
  businessState: varchar("business_state", { length: 255 }),
  typicalRouteFrom: varchar("typical_route_from", { length: 100 }),
  typicalRouteTo: varchar("typical_route_to", { length: 100 }),
  specialHandling: varchar("special_handling", { length: 500 }),
  industry: varchar("industry", { length: 255 }),
  website: varchar("website", { length: 500 }),
  companySize: varchar("company_size", { length: 20 }),

  /** Owner-Operator-specific */
  vehicleYear: varchar("vehicle_year", { length: 4 }),
  vinNumber: varchar("vin_number", { length: 50 }),
  insuranceExpiry: date("insurance_expiry"),
  inspectionExpiry: date("inspection_expiry"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
