import { asc, eq } from "drizzle-orm";
import { db } from "../db/client.js";
import type { DbClient, Transaction } from "../db/client.js";
import { skillSheetCertifications } from "../db/schema.js";

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
