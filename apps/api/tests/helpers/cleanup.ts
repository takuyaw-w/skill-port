import { db } from "../../src/db/client.js";
import {
  account,
  employeeInvitationTokens,
  employees,
  healthChecks,
  session,
  skillOptionAliases,
  skillOptions,
  skillSheetCertifications,
  skillSheetProjectPhases,
  skillSheetProjects,
  skillSheetProjectTechnologies,
  skillSheets,
  skillSheetSkills,
  user,
  verification,
} from "../../src/db/schema.js";

export async function cleanupDatabase() {
  await db.delete(skillSheetProjectPhases);
  await db.delete(skillSheetProjectTechnologies);
  await db.delete(skillSheetProjects);
  await db.delete(skillSheetSkills);
  await db.delete(skillSheetCertifications);
  await db.delete(skillSheets);

  await db.delete(skillOptionAliases);
  await db.delete(skillOptions);

  await db.delete(employeeInvitationTokens);
  await db.delete(employees);

  await db.delete(session);
  await db.delete(account);
  await db.delete(verification);
  await db.delete(user);

  await db.delete(healthChecks);
}
