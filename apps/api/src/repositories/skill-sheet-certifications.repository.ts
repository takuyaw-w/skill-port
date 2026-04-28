import { asc, eq } from "drizzle-orm";
import { db } from "../db/client.js";
import type { DbClient } from "../db/client.js";
import { skillSheetCertifications } from "../db/schema.js";

type CreateSkillSheetCertificationInput = {
  name: string;
  sortOrder?: number;
}

export async function findSkillSheetCertificationsBySkillSheetId(
  skillSheetId: string,
  client: DbClient = db,
) {
  return client
    .select()
    .from(skillSheetCertifications)
    .where(eq(skillSheetCertifications.skillSheetId, skillSheetId))
    .orderBy(asc(skillSheetCertifications.sortOrder));
}

export async function replaceSkillSheetCertifications(
  skillSheetId: string,
  inputs: CreateSkillSheetCertificationInput[],
  client: DbClient = db
) {
  await client
    .delete(skillSheetCertifications)
    .where(eq(skillSheetCertifications.skillSheetId, skillSheetId))

  if (inputs.length === 0) {
    return []
  }

  return client
    .insert(skillSheetCertifications)
    .values(
      inputs.map((input, index) => ({
        skillSheetId,
        name: input.name,
        sortOrder: input.sortOrder ?? index
      }))
    )
    .returning()
}
