import { inArray } from "drizzle-orm";
import { db, type DbClient } from "../db/client.js";
import { skillOptions } from "../db/schema.js";

export async function findSkillOptionsByIds(ids: string[], client: DbClient = db) {
  if (ids.length === 0) {
    return [];
  }

  return client
    .select({
      id: skillOptions.id,
      category: skillOptions.category,
      name: skillOptions.name,
      normalizedName: skillOptions.normalizedName,
      isActive: skillOptions.isActive,
    })
    .from(skillOptions)
    .where(inArray(skillOptions.id, ids));
}
