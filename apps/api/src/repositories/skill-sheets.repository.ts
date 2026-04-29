import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import type { DbClient } from "../db/client.js";
import {
  skillSheetProjectPhases,
  skillSheetProjects,
  skillSheetProjectTechnologies,
  skillSheets,
} from "../db/schema.js";
import { findSkillSheetCertificationsBySkillSheetId } from "./skill-sheet-certifications.repository.js";
import { findSkillSheetSkillsBySkillSheetId } from "./skill-sheet-skills.repository.js";
import { findSkillSheetProjectsBySkillSheetId } from "./skill-sheet-projects.repository.js";
import { findSkillSheetProjectTechnologiesByProjectIds } from "./skill-sheet-project-technologies.repository.js";
import { findSkillSheetProjectPhasesByProjectIds } from "./skill-sheet-project-phases.repository.js";

type SkillSheetProject = typeof skillSheetProjects.$inferSelect;
type SkillSheetProjectTechnology = typeof skillSheetProjectTechnologies.$inferSelect;
type SkillSheetProjectPhase = typeof skillSheetProjectPhases.$inferSelect;
type UpsertSkillSheetInput = {
  employeeId: string;
  publicInitials: string;
  nearestStation?: string;
  experienceLabel?: string;
  selfPr?: string;
};

function attachProjectChildren(
  projects: SkillSheetProject[],
  technologies: SkillSheetProjectTechnology[],
  phases: SkillSheetProjectPhase[],
) {
  return projects.map((project) => ({
    ...project,
    technologies: technologies.filter((technology) => technology.projectId === project.id),
    phases: phases.filter((phase) => phase.projectId === project.id),
  }));
}

export async function findSkillSheetByEmployeeId(employeeId: string, client: DbClient = db) {
  const [skillSheet] = await client
    .select()
    .from(skillSheets)
    .where(eq(skillSheets.employeeId, employeeId))
    .limit(1);

  if (!skillSheet) {
    return null;
  }

  const certifications = await findSkillSheetCertificationsBySkillSheetId(skillSheet.id, client);
  const skills = await findSkillSheetSkillsBySkillSheetId(skillSheet.id, client);
  const projects = await findSkillSheetProjectsBySkillSheetId(skillSheet.id, client);

  const projectIds = projects.map((project) => project.id);

  const technologies = await findSkillSheetProjectTechnologiesByProjectIds(projectIds, client);
  const phases = await findSkillSheetProjectPhasesByProjectIds(projectIds, client);

  return {
    ...skillSheet,
    certifications,
    skills,
    projects: attachProjectChildren(projects, technologies, phases),
  };
}

export async function upsertSkillSheetByEmployeeId(
  input: UpsertSkillSheetInput,
  client: DbClient = db,
) {
  const values: typeof skillSheets.$inferInsert = {
    employeeId: input.employeeId,
    publicInitials: input.publicInitials,
    nearestStation: input.nearestStation,
    experienceLabel: input.experienceLabel,
    selfPr: input.selfPr,
  };

  const [skillSheet] = await client
    .insert(skillSheets)
    .values(values)
    .onConflictDoUpdate({
      target: skillSheets.employeeId,
      set: {
        publicInitials: input.publicInitials,
        nearestStation: input.nearestStation,
        experienceLabel: input.experienceLabel,
        selfPr: input.selfPr,
        updatedAt: new Date(),
      },
    })
    .returning();

  return skillSheet;
}
