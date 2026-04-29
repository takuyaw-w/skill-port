import type {
  ProjectPhaseValue,
  ProjectRoleValue,
  SkillCategoryValue,
} from "@skill-port/shared";

export type SkillSheetCertificationResponse = {
  id: string;
  name: string;
  sortOrder: number;
};

export type SkillSheetSkillResponse = {
  id: string;
  skillOptionId: string | null;
  category: SkillCategoryValue;
  name: string;
  normalizedName: string | null;
  sortOrder: number;
};

export type SkillSheetProjectTechnologyResponse = {
  id: string;
  skillOptionId: string | null;
  category: SkillCategoryValue;
  name: string;
  normalizedName: string | null;
  sortOrder: number;
};

export type SkillSheetProjectPhaseResponse = {
  id: string;
  phase: ProjectPhaseValue;
  sortOrder: number;
};

export type SkillSheetProjectResponse = {
  id: string;
  startYearMonth: string;
  endYearMonth: string | null;
  name: string;
  summary: string | null;
  responsibilities: string | null;
  role: ProjectRoleValue | null;
  teamSize: number | null;
  sortOrder: number;
  technologies: SkillSheetProjectTechnologyResponse[];
  phases: SkillSheetProjectPhaseResponse[];
};

export type SkillSheetResponse = {
  id: string;
  publicInitials: string;
  nearestStation: string | null;
  experienceLabel: string | null;
  selfPr: string | null;
  certifications: SkillSheetCertificationResponse[];
  skills: SkillSheetSkillResponse[];
  projects: SkillSheetProjectResponse[];
};

export type NullableSkillSheetResponse = SkillSheetResponse | null;
