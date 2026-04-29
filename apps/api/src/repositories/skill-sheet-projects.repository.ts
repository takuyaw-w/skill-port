import { asc, eq } from "drizzle-orm";
import { db, type DbClient } from "../db/client.js";
import { skillSheetProjects } from "../db/schema.js";
import { createSkillSheetProjectPhases } from "./skill-sheet-project-phases.repository.js";
import { createSkillSheetProjectTechnologies } from "./skill-sheet-project-technologies.repository.js";

type CreateSkillSheetProjectInput = {
  startYearMonth: string;
  endYearMonth?: string | null;

  name: string;
  summary?: string;
  responsibilities?: string;

  role?: "leader" | "member" | "other" | null;
  teamSize?: number | null;
  sortOrder?: number;

  technologies: {
    skillOptionId?: string | null;
    category: string;
    name: string;
    normalizedName?: string | null;
    sortOrder?: number;
  }[];

  phases: {
    phase: string;
    sortOrder?: number;
  }[];
};

export async function findSkillSheetProjectsBySkillSheetId(
  skillSheetId: string,
  client: DbClient = db,
) {
  return client
    .select()
    .from(skillSheetProjects)
    .where(eq(skillSheetProjects.skillSheetId, skillSheetId))
    .orderBy(asc(skillSheetProjects.sortOrder));
}

export async function replaceSkillSheetProjects(
  skillSheetId: string,
  inputs: CreateSkillSheetProjectInput[],
  client: DbClient = db,
) {
  await client
    .delete(skillSheetProjects)
    .where(eq(skillSheetProjects.skillSheetId, skillSheetId));

  const createdProjects = [];

  for (const [index, input] of inputs.entries()) {
    const [project] = await client
      .insert(skillSheetProjects)
      .values({
        skillSheetId,
        startYearMonth: input.startYearMonth,
        endYearMonth: input.endYearMonth ?? null,
        name: input.name,
        summary: input.summary,
        responsibilities: input.responsibilities,
        role: input.role ?? null,
        teamSize: input.teamSize ?? null,
        sortOrder: input.sortOrder ?? index,
      })
      .returning();

    if (!project) {
      throw new Error("Failed to create skill sheet project.");
    }

    await createSkillSheetProjectTechnologies(project.id, input.technologies, client);
    await createSkillSheetProjectPhases(project.id, input.phases, client);

    createdProjects.push(project);
  }

  return createdProjects;
}
