import { pgTable, uuid, varchar, integer, timestamp, text, pgEnum, serial, boolean } from "drizzle-orm/pg-core";

export const blogCategoryStatusEnum = pgEnum("blog_category_status", [
  "active",
  "inactive",
]);

export const blogCategories = pgTable("blog_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: varchar("description", { length: 255 }).notNull(),
  status: blogCategoryStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const blogStatusEnum = pgEnum("blog_status", [
  "draft",
  "published",
  "archived",
]);

export const blogs = pgTable("blogs", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: varchar("description", { length: 255 }).notNull(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  cloudinaryPublicId: varchar("cloudinary_public_id", { length: 500 }),
  author: varchar("author", { length: 255 }).notNull(),
  content: text("content").notNull(),
  isFeatured: boolean("is_featured").notNull().default(false),
  status: blogStatusEnum("status").notNull().default("published"),
  views: integer("views").notNull().default(0),
  tags: text("tags").array(),
  categoryId: integer("category_id").references(() => blogCategories.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});