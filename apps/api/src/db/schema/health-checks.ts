import { text, timestamp, uuid } from "drizzle-orm/pg-core";
import { appSchema } from "./app-schema.js";

export const healthChecks = appSchema.table("health_checks", {
  id: uuid("id").primaryKey().defaultRandom(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
