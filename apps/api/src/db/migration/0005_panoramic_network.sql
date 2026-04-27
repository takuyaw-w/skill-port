ALTER TABLE "app"."employees" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."employees" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."employees" ADD CONSTRAINT "employees_email_unique" UNIQUE("email");