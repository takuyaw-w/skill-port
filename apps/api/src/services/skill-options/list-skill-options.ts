import { listSkillOptions as listSkillOptionsRepository } from "../../repositories/skill-options.repository.js";
import type { ListSkillOptionsQuery } from "../../schemas/skill-options.requests.js";

export async function listSkillOptions(input: ListSkillOptionsQuery) {
  return listSkillOptionsRepository({
    category: input.category,
    q: input.q,
    activeOnly: input.activeOnly,
  });
}
