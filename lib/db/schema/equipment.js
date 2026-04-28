import { pgTable, uuid, varchar, timestamp, date, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const equipmentCategoryEnum = pgEnum("equipment_category", [
  "system",
  "owner_operator",
]);

export const equipmentStatusEnum = pgEnum("equipment_status", [
  "active",
  "inactive",
]);

export const equipment = pgTable("equipment", {
  id: uuid("id").defaultRandom().primaryKey(),

  category: equipmentCategoryEnum("category").notNull().default("system"),
  ownerOperatorId: uuid("owner_operator_id").references(() => users.id, {
    onDelete: "cascade",
  }),

  equipmentType: varchar("equipment_type", { length: 200 }).notNull(),
  registrationNumber: varchar("registration_number", { length: 50 }).notNull(),
  vinNumber: varchar("vin_number", { length: 50 }).notNull(),
  insuranceExpiry: date("insurance_expiry"),
  inspectionExpiry: date("inspection_expiry"),
  vehicleYear: varchar("vehicle_year", { length: 4 }),

  status: equipmentStatusEnum("status").notNull().default("active"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

