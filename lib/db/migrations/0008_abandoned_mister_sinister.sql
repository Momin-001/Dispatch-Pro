ALTER TABLE "blogs" ADD COLUMN "views" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "tags" text[];