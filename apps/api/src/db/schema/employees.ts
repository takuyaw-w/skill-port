import { text, timestamp, uuid } from "drizzle-orm/pg-core";

import { appSchema } from "./app-schema.js";
import { user } from "./auth.js";

export const employees = appSchema.table("employees", {
  id: uuid("id").primaryKey(),

  userId: text("user_id")
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),

  email: text("email").notNull().unique(),
  employeeCode: text("employee_code").notNull().unique(),
  fullName: text("full_name").notNull(),
  displayName: text("display_name").notNull(),

  status: text("status").default("active").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
