CREATE SCHEMA "app";
--> statement-breakpoint
CREATE TABLE "app"."health_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "app"."user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text DEFAULT 'employee' NOT NULL,
	"banned" boolean DEFAULT false NOT NULL,
	"ban_expires" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "app"."verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."employees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"email" text NOT NULL,
	"employee_code" text NOT NULL,
	"family_name" text NOT NULL,
	"given_name" text NOT NULL,
	"family_name_kana" text,
	"given_name_kana" text,
	"birth_date" date,
	"gender" smallint DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "employees_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "employees_email_unique" UNIQUE("email"),
	CONSTRAINT "employees_employee_code_unique" UNIQUE("employee_code")
);
--> statement-breakpoint
CREATE TABLE "app"."employee_invitation_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "employee_invitation_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "app"."skill_option_aliases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"skill_option_id" uuid NOT NULL,
	"alias_name" text NOT NULL,
	"alias_normalized_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."skill_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" text NOT NULL,
	"name" text NOT NULL,
	"normalized_name" text NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."skill_sheet_certifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"skill_sheet_id" uuid NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."skill_sheet_project_phases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"phase" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."skill_sheet_project_technologies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"skill_option_id" uuid,
	"category" text NOT NULL,
	"name" text NOT NULL,
	"normalized_name" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."skill_sheet_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"skill_sheet_id" uuid NOT NULL,
	"start_year_month" text NOT NULL,
	"end_year_month" text,
	"name" text NOT NULL,
	"summary" text,
	"responsibilities" text,
	"role" text,
	"team_size" integer,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."skill_sheet_skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"skill_sheet_id" uuid NOT NULL,
	"skill_option_id" uuid,
	"category" text NOT NULL,
	"name" text NOT NULL,
	"normalized_name" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."skill_sheets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" uuid NOT NULL,
	"public_initials" text NOT NULL,
	"nearest_station" text,
	"experience_label" text,
	"self_pr" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "skill_sheets_employee_id_unique" UNIQUE("employee_id")
);
--> statement-breakpoint
ALTER TABLE "app"."account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."employees" ADD CONSTRAINT "employees_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."employee_invitation_tokens" ADD CONSTRAINT "employee_invitation_tokens_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "app"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."skill_option_aliases" ADD CONSTRAINT "skill_option_aliases_skill_option_id_skill_options_id_fk" FOREIGN KEY ("skill_option_id") REFERENCES "app"."skill_options"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."skill_sheet_certifications" ADD CONSTRAINT "skill_sheet_certifications_skill_sheet_id_skill_sheets_id_fk" FOREIGN KEY ("skill_sheet_id") REFERENCES "app"."skill_sheets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."skill_sheet_project_phases" ADD CONSTRAINT "skill_sheet_project_phases_project_id_skill_sheet_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "app"."skill_sheet_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."skill_sheet_project_technologies" ADD CONSTRAINT "skill_sheet_project_technologies_project_id_skill_sheet_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "app"."skill_sheet_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."skill_sheet_project_technologies" ADD CONSTRAINT "skill_sheet_project_technologies_skill_option_id_skill_options_id_fk" FOREIGN KEY ("skill_option_id") REFERENCES "app"."skill_options"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."skill_sheet_projects" ADD CONSTRAINT "skill_sheet_projects_skill_sheet_id_skill_sheets_id_fk" FOREIGN KEY ("skill_sheet_id") REFERENCES "app"."skill_sheets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."skill_sheet_skills" ADD CONSTRAINT "skill_sheet_skills_skill_sheet_id_skill_sheets_id_fk" FOREIGN KEY ("skill_sheet_id") REFERENCES "app"."skill_sheets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."skill_sheet_skills" ADD CONSTRAINT "skill_sheet_skills_skill_option_id_skill_options_id_fk" FOREIGN KEY ("skill_option_id") REFERENCES "app"."skill_options"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."skill_sheets" ADD CONSTRAINT "skill_sheets_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "app"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "app"."account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "app"."session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "app"."verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "employee_invitation_tokens_employee_id_idx" ON "app"."employee_invitation_tokens" USING btree ("employee_id");--> statement-breakpoint
CREATE INDEX "skill_option_aliases_skill_option_id_idx" ON "app"."skill_option_aliases" USING btree ("skill_option_id");--> statement-breakpoint
CREATE INDEX "skill_option_aliases_alias_normalized_name_idx" ON "app"."skill_option_aliases" USING btree ("alias_normalized_name");--> statement-breakpoint
CREATE UNIQUE INDEX "skill_option_aliases_option_alias_unique" ON "app"."skill_option_aliases" USING btree ("skill_option_id","alias_normalized_name");--> statement-breakpoint
CREATE INDEX "skill_options_category_idx" ON "app"."skill_options" USING btree ("category");--> statement-breakpoint
CREATE INDEX "skill_options_normalized_name_idx" ON "app"."skill_options" USING btree ("normalized_name");--> statement-breakpoint
CREATE INDEX "skill_options_is_active_idx" ON "app"."skill_options" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "skill_options_category_sort_order_idx" ON "app"."skill_options" USING btree ("category","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "skill_options_category_normalized_name_unique" ON "app"."skill_options" USING btree ("category","normalized_name");--> statement-breakpoint
CREATE INDEX "skill_sheet_certifications_skill_sheet_id_idx" ON "app"."skill_sheet_certifications" USING btree ("skill_sheet_id");--> statement-breakpoint
CREATE INDEX "skill_sheet_certifications_sheet_sort_order_idx" ON "app"."skill_sheet_certifications" USING btree ("skill_sheet_id","sort_order");--> statement-breakpoint
CREATE INDEX "skill_sheet_project_phases_project_id_idx" ON "app"."skill_sheet_project_phases" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "skill_sheet_project_phases_phase_idx" ON "app"."skill_sheet_project_phases" USING btree ("phase");--> statement-breakpoint
CREATE INDEX "skill_sheet_project_phases_project_sort_order_idx" ON "app"."skill_sheet_project_phases" USING btree ("project_id","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "skill_sheet_project_phases_project_phase_unique" ON "app"."skill_sheet_project_phases" USING btree ("project_id","phase");--> statement-breakpoint
CREATE INDEX "skill_sheet_project_technologies_project_id_idx" ON "app"."skill_sheet_project_technologies" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "skill_sheet_project_technologies_skill_option_id_idx" ON "app"."skill_sheet_project_technologies" USING btree ("skill_option_id");--> statement-breakpoint
CREATE INDEX "skill_sheet_project_technologies_category_idx" ON "app"."skill_sheet_project_technologies" USING btree ("category");--> statement-breakpoint
CREATE INDEX "skill_sheet_project_technologies_normalized_name_idx" ON "app"."skill_sheet_project_technologies" USING btree ("normalized_name");--> statement-breakpoint
CREATE INDEX "skill_sheet_project_technologies_project_category_idx" ON "app"."skill_sheet_project_technologies" USING btree ("project_id","category");--> statement-breakpoint
CREATE INDEX "skill_sheet_project_technologies_project_category_sort_order_idx" ON "app"."skill_sheet_project_technologies" USING btree ("project_id","category","sort_order");--> statement-breakpoint
CREATE INDEX "skill_sheet_projects_skill_sheet_id_idx" ON "app"."skill_sheet_projects" USING btree ("skill_sheet_id");--> statement-breakpoint
CREATE INDEX "skill_sheet_projects_start_year_month_idx" ON "app"."skill_sheet_projects" USING btree ("start_year_month");--> statement-breakpoint
CREATE INDEX "skill_sheet_projects_end_year_month_idx" ON "app"."skill_sheet_projects" USING btree ("end_year_month");--> statement-breakpoint
CREATE INDEX "skill_sheet_projects_sheet_sort_order_idx" ON "app"."skill_sheet_projects" USING btree ("skill_sheet_id","sort_order");--> statement-breakpoint
CREATE INDEX "skill_sheet_skills_skill_sheet_id_idx" ON "app"."skill_sheet_skills" USING btree ("skill_sheet_id");--> statement-breakpoint
CREATE INDEX "skill_sheet_skills_skill_option_id_idx" ON "app"."skill_sheet_skills" USING btree ("skill_option_id");--> statement-breakpoint
CREATE INDEX "skill_sheet_skills_category_idx" ON "app"."skill_sheet_skills" USING btree ("category");--> statement-breakpoint
CREATE INDEX "skill_sheet_skills_normalized_name_idx" ON "app"."skill_sheet_skills" USING btree ("normalized_name");--> statement-breakpoint
CREATE INDEX "skill_sheet_skills_sheet_category_idx" ON "app"."skill_sheet_skills" USING btree ("skill_sheet_id","category");--> statement-breakpoint
CREATE INDEX "skill_sheet_skills_sheet_category_sort_order_idx" ON "app"."skill_sheet_skills" USING btree ("skill_sheet_id","category","sort_order");