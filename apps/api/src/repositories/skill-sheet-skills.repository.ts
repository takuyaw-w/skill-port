import { asc, eq } from "drizzle-orm";
import { db } from "../db/client.js";
import type { DbClient, Transaction } from "../db/client.js";
import { skillSheetSkills } from "../db/schema.js";

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
