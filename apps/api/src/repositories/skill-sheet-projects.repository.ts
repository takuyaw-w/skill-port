import { asc, eq } from "drizzle-orm";
import { db } from "../db/client.js";
import type { DbClient, Transaction } from "../db/client.js";
import { skillSheetProjects } from "../db/schema.js";

export async function findSkillSheetProjectsBySkillSheetId(
  skillSheetId: string,
  client: DbClient = db,
) {
  return client
    .select()
    .from(skillSheetProjects)
    .where(eq(skillSheetProjects.skillSheetId, skillSheetId))
    .orderBy(asc(skillSheetProjects.sortOrder));
}
