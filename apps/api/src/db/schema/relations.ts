import { relations } from "drizzle-orm";

import { account, session, user } from "./auth.js";
import { employeeInvitationTokens } from "./employee-invitation-tokens.js";
import { employees } from "./employees.js";

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const employeeRelations = relations(employees, ({ one, many }) => ({
  user: one(user, {
    fields: [employees.userId],
    references: [user.id],
  }),
  invitationTokens: many(employeeInvitationTokens),
}));

export const employeeInvitationTokenRelations = relations(
  employeeInvitationTokens,
  ({ one }) => ({
    employee: one(employees, {
      fields: [employeeInvitationTokens.employeeId],
      references: [employees.id],
    }),
  }),
);
