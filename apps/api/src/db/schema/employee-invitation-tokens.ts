import { index, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { appSchema } from "./app-schema.js";
import { employees } from "./employees.js";

export const employeeInvitationTokens = appSchema.table(
  "employee_invitation_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "cascade" }),

    tokenHash: text("token_hash").notNull().unique(),
    status: text("status").default("pending").notNull(),

    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("employee_invitation_tokens_employee_id_idx").on(table.employeeId)],
);
