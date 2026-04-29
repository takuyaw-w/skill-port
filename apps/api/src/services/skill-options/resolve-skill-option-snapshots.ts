import type { DbClient } from "../../db/client.js";
import { findSkillOptionsByIds } from "../../repositories/skill-options.repository.js";

type SkillOptionLikeInput = {
  skillOptionId?: string | null;
  category: string;
  name: string;
  normalizedName?: string | null;
  sortOrder?: number;
};

type ResolvedSkillOptionSnapshot = {
  skillOptionId?: string | null;
  category: string;
  name: string;
  normalizedName?: string | null;
  sortOrder?: number;
};

type ResolveSkillOptionSnapshotsResult =
  | {
      ok: true;
      values: ResolvedSkillOptionSnapshot[];
    }
  | {
      ok: false;
      error: "SKILL_OPTION_NOT_FOUND";
      skillOptionId: string;
    };

export async function resolveSkillOptionSnapshots(
  inputs: SkillOptionLikeInput[],
  client: DbClient,
): Promise<ResolveSkillOptionSnapshotsResult> {
  const skillOptionIds = [
    ...new Set(
      inputs.map((input) => input.skillOptionId).filter((id): id is string => Boolean(id)),
    ),
  ];

  const options = await findSkillOptionsByIds(skillOptionIds, client);
  const optionsById = new Map(options.map((option) => [option.id, option]));

  const values: ResolvedSkillOptionSnapshot[] = [];

  for (const input of inputs) {
    if (!input.skillOptionId) {
      values.push({
        skillOptionId: null,
        category: input.category,
        name: input.name,
        normalizedName: input.normalizedName ?? null,
        sortOrder: input.sortOrder,
      });
      continue;
    }

    const option = optionsById.get(input.skillOptionId);

    if (!option) {
      return {
        ok: false,
        error: "SKILL_OPTION_NOT_FOUND",
        skillOptionId: input.skillOptionId,
      };
    }

    values.push({
      skillOptionId: option.id,
      category: option.category,
      name: option.name,
      normalizedName: option.normalizedName,
      sortOrder: input.sortOrder,
    });
  }

  return {
    ok: true,
    values,
  };
}
