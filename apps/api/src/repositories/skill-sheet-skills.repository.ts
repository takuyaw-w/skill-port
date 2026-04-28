import { asc, eq } from "drizzle-orm";
import { db } from "../db/client.js";
import type { DbClient } from "../db/client.js";
import { skillSheetSkills } from "../db/schema.js";

type CreateSkillSheetSkillInput = {
  skillOptionId?: string | null;
  category: string;
  name: string;
  normalizedName?: string | null;
  sortOrder?: number;
};

export async function findSkillSheetSkillsBySkillSheetId(
  skillSheetId: string,
  client: DbClient = db,
) {
  return client
    .select()
    .from(skillSheetSkills)
    .where(eq(skillSheetSkills.skillSheetId, skillSheetId))
    .orderBy(asc(skillSheetSkills.sortOrder));
}

export async function replaceSkillSheetSkills(
  skillSheetId: string,
  inputs: CreateSkillSheetSkillInput[],
  client: DbClient = db,
) {
  await client
    .delete(skillSheetSkills)
    .where(eq(skillSheetSkills.skillSheetId, skillSheetId));

  if (inputs.length === 0) {
    return [];
  }

  return client
    .insert(skillSheetSkills)
    .values(
      inputs.map((input, index) => ({
        skillSheetId,
        skillOptionId: input.skillOptionId ?? null,
        category: input.category,
        name: input.name,
        normalizedName: input.normalizedName ?? null,
        sortOrder: input.sortOrder ?? index,
      })),
    )
    .returning();
}
