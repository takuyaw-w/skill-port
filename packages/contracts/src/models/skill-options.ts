import type { SkillCategoryValue } from "@skill-port/shared";

export type SkillOptionResponse = {
  id: string;
  category: SkillCategoryValue;
  name: string;
  normalizedName: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
};
