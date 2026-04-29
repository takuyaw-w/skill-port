import { db } from "../../db/client.js";
import { findEmployeeByUserId } from "../../repositories/employees.repository.js";
import { replaceSkillSheetCertifications } from "../../repositories/skill-sheet-certifications.repository.js";
import { replaceSkillSheetProjects } from "../../repositories/skill-sheet-projects.repository.js";
import { replaceSkillSheetSkills } from "../../repositories/skill-sheet-skills.repository.js";
import {
  findSkillSheetByEmployeeId,
  upsertSkillSheetByEmployeeId,
} from "../../repositories/skill-sheets.repository.js";
import type { SaveSkillSheetRequest } from "../../schemas/employee/skill-sheet.requests.js";
import { resolveSkillOptionSnapshots } from "../skill-options/resolve-skill-option-snapshots.js";

type SavedSkillSheet = NonNullable<Awaited<ReturnType<typeof findSkillSheetByEmployeeId>>>;

type SaveCurrentEmployeeSkillSheetResult =
  | {
      ok: true;
      skillSheet: SavedSkillSheet;
    }
  | {
      ok: false;
      error: "EMPLOYEE_NOT_FOUND" | "SKILL_SHEET_NOT_FOUND_AFTER_SAVE" | "SKILL_OPTION_NOT_FOUND";
      skillOptionId?: string;
    };

type SaveSkillSheetTransactionResult =
  | {
      ok: true;
      skillSheet: SavedSkillSheet;
    }
  | {
      ok: false;
      error: "SKILL_SHEET_NOT_FOUND_AFTER_SAVE" | "SKILL_OPTION_NOT_FOUND";
      skillOptionId?: string;
    };

export async function saveCurrentEmployeeSkillSheet(
  userId: string,
  input: SaveSkillSheetRequest,
): Promise<SaveCurrentEmployeeSkillSheetResult> {
  const employee = await findEmployeeByUserId(userId);

  if (!employee) {
    return {
      ok: false,
      error: "EMPLOYEE_NOT_FOUND",
    };
  }

  const result = await db.transaction(async (tx): Promise<SaveSkillSheetTransactionResult> => {
    const resolvedSkills = await resolveSkillOptionSnapshots(input.skills, tx);

    if (!resolvedSkills.ok) {
      return {
        ok: false,
        error: "SKILL_OPTION_NOT_FOUND",
        skillOptionId: resolvedSkills.skillOptionId,
      };
    }

    const projects = [];

    for (const project of input.projects) {
      const resolvedTechnologies = await resolveSkillOptionSnapshots(project.technologies, tx);

      if (!resolvedTechnologies.ok) {
        return {
          ok: false,
          error: "SKILL_OPTION_NOT_FOUND",
          skillOptionId: resolvedTechnologies.skillOptionId,
        };
      }

      projects.push({
        ...project,
        technologies: resolvedTechnologies.values,
      });
    }

    const skillSheet = await upsertSkillSheetByEmployeeId(
      {
        employeeId: employee.id,
        publicInitials: input.publicInitials,
        nearestStation: input.nearestStation,
        experienceLabel: input.experienceLabel,
        selfPr: input.selfPr,
      },
      tx,
    );

    await replaceSkillSheetCertifications(skillSheet.id, input.certifications, tx);
    await replaceSkillSheetSkills(skillSheet.id, resolvedSkills.values, tx);
    await replaceSkillSheetProjects(skillSheet.id, projects, tx);

    const savedSkillSheet = await findSkillSheetByEmployeeId(employee.id, tx);

    if (!savedSkillSheet) {
      return {
        ok: false,
        error: "SKILL_SHEET_NOT_FOUND_AFTER_SAVE",
      };
    }

    return {
      ok: true,
      skillSheet: savedSkillSheet,
    };
  });

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    skillSheet: result.skillSheet,
  };
}
