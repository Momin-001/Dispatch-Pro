ALTER TABLE "users" ADD COLUMN "business_address" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "business_city" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "business_state" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "typical_route_from" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "typical_route_to" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "special_handling" varchar(500);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "industry" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "website" varchar(500);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "company_size" varchar(20);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "vehicle_year" varchar(4);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "vin_number" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "insurance_expiry" date;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "inspection_expiry" date;