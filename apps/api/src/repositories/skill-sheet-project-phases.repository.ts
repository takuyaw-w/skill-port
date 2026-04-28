import { asc, inArray } from "drizzle-orm";
import { db, type DbClient } from "../db/client.js";
import { skillSheetProjectPhases } from "../db/schema.js";

export async function findSkillSheetProjectPhasesByProjectIds(
  projectIds: string[],
  client: DbClient = db,
) {
  if (projectIds.length === 0) {
    return [];
  }

  return client
    .select()
    .from(skillSheetProjectPhases)
    .where(inArray(skillSheetProjectPhases.projectId, projectIds))
    .orderBy(asc(skillSheetProjectPhases.projectId), asc(skillSheetProjectPhases.sortOrder));
}
