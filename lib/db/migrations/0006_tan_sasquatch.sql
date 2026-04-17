ALTER TABLE "users" RENAME COLUMN "license_number" TO "cdl_number";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "shippment_type" varchar(200);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "registration_number" varchar(50);--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "service_type";