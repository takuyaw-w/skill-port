import type { SkillOptionResponse } from "@skill-port/contracts";

type SkillOptionLike = {
  id: string;
  category: string;
  name: string;
  normalizedName: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
};

export function presentSkillOption(skillOption: SkillOptionLike): SkillOptionResponse {
  return {
    id: skillOption.id,
    category: skillOption.category as SkillOptionResponse["category"],
    name: skillOption.name,
    normalizedName: skillOption.normalizedName,
    description: skillOption.description,
    sortOrder: skillOption.sortOrder,
    isActive: skillOption.isActive,
  };
}

export function presentSkillOptions(skillOptions: SkillOptionLike[]): SkillOptionResponse[] {
  return skillOptions.map(presentSkillOption);
}
