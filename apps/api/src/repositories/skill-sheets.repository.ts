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

  const [certifications, skills, projects] = await Promise.all([
    findSkillSheetCertificationsBySkillSheetId(skillSheet.id, client),
    findSkillSheetSkillsBySkillSheetId(skillSheet.id, client),
    findSkillSheetProjectsBySkillSheetId(skillSheet.id, client),
  ]);

  const projectIds = projects.map((project) => project.id);

  const [technologies, phases] = await Promise.all([
    findSkillSheetProjectTechnologiesByProjectIds(projectIds, client),
    findSkillSheetProjectPhasesByProjectIds(projectIds, client),
  ]);

  return {
    ...skillSheet,
    certifications,
    skills,
    projects: attachProjectChildren(projects, technologies, phases),
  };
}
