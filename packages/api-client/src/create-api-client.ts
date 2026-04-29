import { createSkillOptionsRepository } from "./repositories/skill-options.repository.js";
import type { ApiFetcher } from "./types.js";

export function createApiClient(fetcher: ApiFetcher) {
  return {
    skillOptions: createSkillOptionsRepository(fetcher)
  }
}

export type ApiClient = ReturnType<typeof createApiClient>
