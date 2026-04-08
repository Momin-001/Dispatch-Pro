import { pgTable, serial, uuid, varchar, integer, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { roles } from "./roles.js";
import { users } from "./users.js";

export const verificationDocumentTypes = pgTable("verification_document_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  roleId: integer("role_id")
    .notNull()
    .references(() => roles.id, { onDelete: "cascade" }),
  isRequired: boolean("is_required").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const documentStatusEnum = pgEnum("document_status", [
  "pending",
  "approved",
  "rejected",
  "reupload_requested",
]);

export const userDocuments = pgTable("user_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  docTypeId: integer("doc_type_id").references(() => verificationDocumentTypes.id, {
    onDelete: "set null",
  }),
  fileUrl: varchar("file_url", { length: 500 }).notNull(),
  cloudinaryPublicId: varchar("cloudinary_public_id", { length: 500 }),
  status: documentStatusEnum("status").notNull().default("pending"),
  adminNote: varchar("admin_note", { length: 1000 }),
  isOther: boolean("is_other").notNull().default(false),
  otherDocName: varchar("other_doc_name", { length: 255 }),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
});
