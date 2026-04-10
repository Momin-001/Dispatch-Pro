ALTER TABLE "users" ADD COLUMN "license_number" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "years_experience" varchar(10);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "equipment_type" varchar(200);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "company_name" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "monthly_load_estimate" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "service_type" varchar(200);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "city" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "state" varchar(255);--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "meta";