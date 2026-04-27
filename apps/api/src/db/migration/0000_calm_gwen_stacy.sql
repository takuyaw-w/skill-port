CREATE SCHEMA "app";
--> statement-breakpoint
CREATE TABLE "app"."health_checks" (
	"id" uuid PRIMARY KEY NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
