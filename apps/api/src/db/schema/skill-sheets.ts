import { index, integer, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

import { appSchema } from "./app-schema.js";
import { employees } from "./employees.js";
import { skillOptions } from "./skill-options.js";

export const skillSheets = appSchema.table(
  "skill_sheets",
  {
    id: uuid("id").primaryKey(),

    employeeId: uuid("employee_id")
      .notNull()
      .unique()
      .references(() => employees.id, { onDelete: "cascade" }),

    publicInitials: text("public_initials").notNull(),
    nearestStation: text("nearest_station"),
    experienceLabel: text("experience_label"),
    selfPr: text("self_pr"),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex("skill_sheets_employee_id_unique").on(table.employeeId)],
);

export const skillSheetCertifications = appSchema.table(
  "skill_sheet_certifications",
  {
    id: uuid("id").primaryKey(),

    skillSheetId: uuid("skill_sheet_id")
      .notNull()
      .references(() => skillSheets.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("skill_sheet_certifications_skill_sheet_id_idx").on(table.skillSheetId),
    index("skill_sheet_certifications_sheet_sort_order_idx").on(
      table.skillSheetId,
      table.sortOrder,
    ),
  ],
);

export const skillSheetSkills = appSchema.table(
  "skill_sheet_skills",
  {
    id: uuid("id").primaryKey(),

    skillSheetId: uuid("skill_sheet_id")
      .notNull()
      .references(() => skillSheets.id, { onDelete: "cascade" }),

    skillOptionId: uuid("skill_option_id").references(() => skillOptions.id, {
      onDelete: "set null",
    }),

    category: text("category").notNull(),
    name: text("name").notNull(),
    normalizedName: text("normalized_name"),

    sortOrder: integer("sort_order").default(0).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("skill_sheet_skills_skill_sheet_id_idx").on(table.skillSheetId),
    index("skill_sheet_skills_skill_option_id_idx").on(table.skillOptionId),
    index("skill_sheet_skills_category_idx").on(table.category),
    index("skill_sheet_skills_normalized_name_idx").on(table.normalizedName),
    index("skill_sheet_skills_sheet_category_idx").on(table.skillSheetId, table.category),
    index("skill_sheet_skills_sheet_category_sort_order_idx").on(
      table.skillSheetId,
      table.category,
      table.sortOrder,
    ),
  ],
);

export const skillSheetProjects = appSchema.table(
  "skill_sheet_projects",
  {
    id: uuid("id").primaryKey(),

    skillSheetId: uuid("skill_sheet_id")
      .notNull()
      .references(() => skillSheets.id, { onDelete: "cascade" }),

    startYearMonth: text("start_year_month").notNull(),
    endYearMonth: text("end_year_month"),

    name: text("name").notNull(),
    summary: text("summary"),
    responsibilities: text("responsibilities"),

    role: text("role"),
    teamSize: integer("team_size"),

    sortOrder: integer("sort_order").default(0).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("skill_sheet_projects_skill_sheet_id_idx").on(table.skillSheetId),
    index("skill_sheet_projects_start_year_month_idx").on(table.startYearMonth),
    index("skill_sheet_projects_end_year_month_idx").on(table.endYearMonth),
    index("skill_sheet_projects_sheet_sort_order_idx").on(table.skillSheetId, table.sortOrder),
  ],
);

export const skillSheetProjectTechnologies = appSchema.table(
  "skill_sheet_project_technologies",
  {
    id: uuid("id").primaryKey(),

    projectId: uuid("project_id")
      .notNull()
      .references(() => skillSheetProjects.id, { onDelete: "cascade" }),

    skillOptionId: uuid("skill_option_id").references(() => skillOptions.id, {
      onDelete: "set null",
    }),

    category: text("category").notNull(),
    name: text("name").notNull(),
    normalizedName: text("normalized_name"),

    sortOrder: integer("sort_order").default(0).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("skill_sheet_project_technologies_project_id_idx").on(table.projectId),
    index("skill_sheet_project_technologies_skill_option_id_idx").on(table.skillOptionId),
    index("skill_sheet_project_technologies_category_idx").on(table.category),
    index("skill_sheet_project_technologies_normalized_name_idx").on(table.normalizedName),
    index("skill_sheet_project_technologies_project_category_idx").on(
      table.projectId,
      table.category,
    ),
    index("skill_sheet_project_technologies_project_category_sort_order_idx").on(
      table.projectId,
      table.category,
      table.sortOrder,
    ),
  ],
);

export const skillSheetProjectPhases = appSchema.table(
  "skill_sheet_project_phases",
  {
    id: uuid("id").primaryKey(),

    projectId: uuid("project_id")
      .notNull()
      .references(() => skillSheetProjects.id, { onDelete: "cascade" }),

    phase: text("phase").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("skill_sheet_project_phases_project_id_idx").on(table.projectId),
    index("skill_sheet_project_phases_phase_idx").on(table.phase),
    index("skill_sheet_project_phases_project_sort_order_idx").on(table.projectId, table.sortOrder),
    uniqueIndex("skill_sheet_project_phases_project_phase_unique").on(table.projectId, table.phase),
  ],
);
