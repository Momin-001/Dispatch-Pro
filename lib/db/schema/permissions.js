import { pgTable, serial, varchar, timestamp, integer, boolean, uniqueIndex } from "drizzle-orm/pg-core";
import { roles } from "./roles.js";

export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  label: varchar("label", { length: 200 }).notNull(),
  module: varchar("module", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rolePermissions = pgTable(
  "role_permissions",
  {
    id: serial("id").primaryKey(),
    roleId: integer("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: integer("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
    enabled: boolean("enabled").notNull().default(true),
  },
  (table) => [
    uniqueIndex("role_permission_unique").on(table.roleId, table.permissionId),
  ]
);
