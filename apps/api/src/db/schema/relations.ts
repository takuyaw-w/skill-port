import { relations } from "drizzle-orm";

import { account, session, user } from "./auth.js";
import { employeeInvitationTokens } from "./employee-invitation-tokens.js";
import { employees } from "./employees.js";
import { skillOptionAliases, skillOptions } from "./skill-options.js";
import {
  skillSheetCertifications,
  skillSheetProjectPhases,
  skillSheetProjects,
  skillSheetProjectTechnologies,
  skillSheets,
  skillSheetSkills,
} from "./skill-sheets.js";

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
  skillSheet: one(skillSheets),
}));

export const employeeInvitationTokenRelations = relations(employeeInvitationTokens, ({ one }) => ({
  employee: one(employees, {
    fields: [employeeInvitationTokens.employeeId],
    references: [employees.id],
  }),
}));

export const skillOptionRelations = relations(skillOptions, ({ many }) => ({
  aliases: many(skillOptionAliases),
  skillSheetSkills: many(skillSheetSkills),
  projectTechnologies: many(skillSheetProjectTechnologies),
}));

export const skillOptionAliasRelations = relations(skillOptionAliases, ({ one }) => ({
  skillOption: one(skillOptions, {
    fields: [skillOptionAliases.skillOptionId],
    references: [skillOptions.id],
  }),
}));

export const skillSheetRelations = relations(skillSheets, ({ one, many }) => ({
  employee: one(employees, {
    fields: [skillSheets.employeeId],
    references: [employees.id],
  }),
  certifications: many(skillSheetCertifications),
  skills: many(skillSheetSkills),
  projects: many(skillSheetProjects),
}));

export const skillSheetCertificationRelations = relations(skillSheetCertifications, ({ one }) => ({
  skillSheet: one(skillSheets, {
    fields: [skillSheetCertifications.skillSheetId],
    references: [skillSheets.id],
  }),
}));

export const skillSheetSkillRelations = relations(skillSheetSkills, ({ one }) => ({
  skillSheet: one(skillSheets, {
    fields: [skillSheetSkills.skillSheetId],
    references: [skillSheets.id],
  }),
  skillOption: one(skillOptions, {
    fields: [skillSheetSkills.skillOptionId],
    references: [skillOptions.id],
  }),
}));

export const skillSheetProjectRelations = relations(skillSheetProjects, ({ one, many }) => ({
  skillSheet: one(skillSheets, {
    fields: [skillSheetProjects.skillSheetId],
    references: [skillSheets.id],
  }),
  technologies: many(skillSheetProjectTechnologies),
  phases: many(skillSheetProjectPhases),
}));

export const skillSheetProjectTechnologyRelations = relations(
  skillSheetProjectTechnologies,
  ({ one }) => ({
    project: one(skillSheetProjects, {
      fields: [skillSheetProjectTechnologies.projectId],
      references: [skillSheetProjects.id],
    }),
    skillOption: one(skillOptions, {
      fields: [skillSheetProjectTechnologies.skillOptionId],
      references: [skillOptions.id],
    }),
  }),
);

export const skillSheetProjectPhaseRelations = relations(skillSheetProjectPhases, ({ one }) => ({
  project: one(skillSheetProjects, {
    fields: [skillSheetProjectPhases.projectId],
    references: [skillSheetProjects.id],
  }),
}));
