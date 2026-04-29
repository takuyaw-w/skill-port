import { and, asc, eq, ilike, inArray } from "drizzle-orm";

import { db, type DbClient } from "../db/client.js";
import { skillOptions } from "../db/schema.js";

type ListSkillOptionsInput = {
  category?: string;
  q?: string;
  activeOnly?: boolean;
};

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

export async function listSkillOptions(input: ListSkillOptionsInput, client: DbClient = db) {
  const conditions = [];

  if (input.category) {
    conditions.push(eq(skillOptions.category, input.category));
  }

  if (input.q) {
    const keyword = `%${input.q}%`;

    conditions.push(
      // まずは name / normalizedName のみ検索対象にする
      // aliases 検索は後続で拡張
      ilike(skillOptions.name, keyword),
    );
  }

  if (input.activeOnly ?? true) {
    conditions.push(eq(skillOptions.isActive, true));
  }

  return client
    .select({
      id: skillOptions.id,
      category: skillOptions.category,
      name: skillOptions.name,
      normalizedName: skillOptions.normalizedName,
      description: skillOptions.description,
      sortOrder: skillOptions.sortOrder,
      isActive: skillOptions.isActive,
    })
    .from(skillOptions)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(skillOptions.category), asc(skillOptions.sortOrder), asc(skillOptions.name));
}
