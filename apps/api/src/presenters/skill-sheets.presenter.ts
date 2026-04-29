import type {
  NullableSkillSheetResponse,
  SkillSheetCertificationResponse,
  SkillSheetProjectPhaseResponse,
  SkillSheetProjectResponse,
  SkillSheetProjectTechnologyResponse,
  SkillSheetSkillResponse,
} from "@skill-port/contracts";

type SkillSheetLike = {
  id: string;
  employeeId: string;
  publicInitials: string;
  nearestStation: string | null;
  experienceLabel: string | null;
  selfPr: string | null;
  certifications: SkillSheetCertificationLike[];
  skills: SkillSheetSkillLike[];
  projects: SkillSheetProjectLike[];
};

type SkillSheetCertificationLike = {
  id: string;
  name: string;
  sortOrder: number;
};

type SkillSheetSkillLike = {
  id: string;
  skillOptionId: string | null;
  category: string;
  name: string;
  normalizedName: string | null;
  sortOrder: number;
};

type SkillSheetProjectTechnologyLike = {
  id: string;
  skillOptionId: string | null;
  category: string;
  name: string;
  normalizedName: string | null;
  sortOrder: number;
};

type SkillSheetProjectPhaseLike = {
  id: string;
  phase: string;
  sortOrder: number;
};

type SkillSheetProjectLike = {
  id: string;
  startYearMonth: string;
  endYearMonth: string | null;
  name: string;
  summary: string | null;
  responsibilities: string | null;
  role: string | null;
  teamSize: number | null;
  sortOrder: number;
  technologies: SkillSheetProjectTechnologyLike[];
  phases: SkillSheetProjectPhaseLike[];
};

export function presentSkillSheet(skillSheet: SkillSheetLike | null): NullableSkillSheetResponse {
  if (!skillSheet) {
    return null;
  }

  return {
    id: skillSheet.id,
    publicInitials: skillSheet.publicInitials,
    nearestStation: skillSheet.nearestStation,
    experienceLabel: skillSheet.experienceLabel,
    selfPr: skillSheet.selfPr,

    certifications: skillSheet.certifications.map(
      (certification): SkillSheetCertificationResponse => ({
        id: certification.id,
        name: certification.name,
        sortOrder: certification.sortOrder,
      }),
    ),

    skills: skillSheet.skills.map(
      (skill): SkillSheetSkillResponse => ({
        id: skill.id,
        skillOptionId: skill.skillOptionId,
        category: skill.category as SkillSheetSkillResponse["category"],
        name: skill.name,
        normalizedName: skill.normalizedName,
        sortOrder: skill.sortOrder,
      }),
    ),

    projects: skillSheet.projects.map(
      (project): SkillSheetProjectResponse => ({
        id: project.id,
        startYearMonth: project.startYearMonth,
        endYearMonth: project.endYearMonth,
        name: project.name,
        summary: project.summary,
        responsibilities: project.responsibilities,
        role: project.role as SkillSheetProjectResponse["role"],
        teamSize: project.teamSize,
        sortOrder: project.sortOrder,

        technologies: project.technologies.map(
          (technology): SkillSheetProjectTechnologyResponse => ({
            id: technology.id,
            skillOptionId: technology.skillOptionId,
            category: technology.category as SkillSheetProjectTechnologyResponse["category"],
            name: technology.name,
            normalizedName: technology.normalizedName,
            sortOrder: technology.sortOrder,
          }),
        ),

        phases: project.phases.map(
          (phase): SkillSheetProjectPhaseResponse => ({
            id: phase.id,
            phase: phase.phase as SkillSheetProjectPhaseResponse["phase"],
            sortOrder: phase.sortOrder,
          }),
        ),
      }),
    ),
  };
}
