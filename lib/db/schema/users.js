import { pgTable, uuid, varchar, integer, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";
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
  meta: jsonb("meta"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
