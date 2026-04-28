import { asc, inArray } from "drizzle-orm";
import { db, type DbClient } from "../db/client.js";
import { skillSheetProjectPhases } from "../db/schema.js";

type CreateSkillSheetProjectPhaseInput = {
  phase: string;
  sortOrder?: number;
};

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

export async function createSkillSheetProjectPhases(
  projectId: string,
  inputs: CreateSkillSheetProjectPhaseInput[],
  client: DbClient = db,
) {
  if (inputs.length === 0) {
    return [];
  }

  return client
    .insert(skillSheetProjectPhases)
    .values(
      inputs.map((input, index) => ({
        projectId,
        phase: input.phase,
        sortOrder: input.sortOrder ?? index,
      })),
    )
    .returning();
}
