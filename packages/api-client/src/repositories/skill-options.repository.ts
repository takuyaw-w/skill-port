import type { ListSkillOptionsResponse } from '@skill-port/contracts'
import type { SkillCategoryValue } from '@skill-port/shared'

import type { ApiFetcher } from '../types.js'

export type ListSkillOptionsParams = {
  category: SkillCategoryValue;
  q?: string;
  activeOnly?: boolean
}

export function createSkillOptionsRepository(fetcher: ApiFetcher) {
  return {
    list(params: ListSkillOptionsParams) {
      return fetcher<ListSkillOptionsResponse>("/api/skill-options", {
        method: "GET",
        query: params
      })
    }
  }
}
