CREATE TABLE "app"."employee_invitation_tokens" (
	"id" uuid PRIMARY KEY NOT NULL,
	"employee_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "employee_invitation_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
ALTER TABLE "app"."employee_invitation_tokens" ADD CONSTRAINT "employee_invitation_tokens_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "app"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "employee_invitation_tokens_employee_id_idx" ON "app"."employee_invitation_tokens" USING btree ("employee_id");