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

type SaveCurrentEmployeeSkillSheetResult =
  | {
    ok: true;
    skillSheet: NonNullable<Awaited<ReturnType<typeof findSkillSheetByEmployeeId>>>;
  }
  | {
    ok: false;
    error: "EMPLOYEE_NOT_FOUND" | "SKILL_SHEET_NOT_FOUND_AFTER_SAVE";
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

  const savedSkillSheet = await db.transaction(async (tx) => {
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
    await replaceSkillSheetSkills(skillSheet.id, input.skills, tx);
    await replaceSkillSheetProjects(skillSheet.id, input.projects, tx);

    return findSkillSheetByEmployeeId(employee.id, tx);
  });

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
}
