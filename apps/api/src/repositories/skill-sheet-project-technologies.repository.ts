import { asc, inArray } from "drizzle-orm";
import { db, type DbClient } from "../db/client.js";
import { skillSheetProjectTechnologies } from "../db/schema.js";

export async function findSkillSheetProjectTechnologiesByProjectIds(
  projectIds: string[],
  client: DbClient = db,
) {
  if (projectIds.length === 0) {
    return [];
  }

  return client
    .select()
    .from(skillSheetProjectTechnologies)
    .where(inArray(skillSheetProjectTechnologies.projectId, projectIds))
    .orderBy(
      asc(skillSheetProjectTechnologies.projectId),
      asc(skillSheetProjectTechnologies.category),
      asc(skillSheetProjectTechnologies.sortOrder),
    );
}
