import { findSkillSheetByEmployeeId } from "../../repositories/skill-sheets.repository.js";

type GetCurrentEmployeeSkillSheetResult =
  | {
    ok: true;
    skillSheet: Awaited<ReturnType<typeof findSkillSheetByEmployeeId>>;
  }
  | {
    ok: false;
    error: "EMPLOYEE_NOT_FOUND";
  };

export async function getCurrentEmployeeSkillSheet(
  userId: string
): Promise<GetCurrentEmployeeSkillSheetResult> {
  const employee = await findSkillSheetByEmployeeId(userId)

  if (!employee) {
    return {
      ok: false,
      error: "EMPLOYEE_NOT_FOUND"
    }
  }

  const skillSheet = await findSkillSheetByEmployeeId(employee.id)

  return {
    ok: true,
    skillSheet
  }
}
