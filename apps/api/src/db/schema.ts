import { pgSchema, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const appSchema = pgSchema('app')

export const healthChecks = appSchema.table('health_checks', {
  id: uuid("id").primaryKey(),
  message: text("message").notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
})
