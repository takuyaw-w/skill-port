import { asc, inArray } from "drizzle-orm";
import { db, type DbClient } from "../db/client.js";
import { skillSheetProjectTechnologies } from "../db/schema.js";

type CreateSkillSheetProjectTechnologyInput = {
  skillOptionId?: string | null;
  category: string;
  name: string;
  normalizedName?: string | null;
  sortOrder?: number;
};

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

export async function createSkillSheetProjectTechnologies(
  projectId: string,
  inputs: CreateSkillSheetProjectTechnologyInput[],
  client: DbClient = db,
) {
  if (inputs.length === 0) {
    return [];
  }

  return client
    .insert(skillSheetProjectTechnologies)
    .values(
      inputs.map((input, index) => ({
        projectId,
        skillOptionId: input.skillOptionId ?? null,
        category: input.category,
        name: input.name,
        normalizedName: input.normalizedName ?? null,
        sortOrder: input.sortOrder ?? index,
      })),
    )
    .returning();
}
