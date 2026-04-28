import { text, timestamp, uuid, date, smallint } from "drizzle-orm/pg-core";

import { appSchema } from "./app-schema.js";
import { user } from "./auth.js";

export const employees = appSchema.table("employees", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: text("user_id")
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),

  email: text("email").notNull().unique(),
  employeeCode: text("employee_code").notNull().unique(),

  familyName: text("family_name").notNull(),
  givenName: text("given_name").notNull(),
  familyNameKana: text("family_name_kana"),
  givenNameKana: text("given_name_kana"),

  birthDate: date("birth_date", { mode: "string" }),
  gender: smallint("gender").default(0).notNull(),

  status: text("status").default("active").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
