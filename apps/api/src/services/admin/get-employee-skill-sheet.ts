import { findEmployeeById } from "../../repositories/employees.repository.js";
import { findSkillSheetByEmployeeId } from "../../repositories/skill-sheets.repository.js";

type GetEmployeeSkillSheetResult =
  | {
      ok: true;
      employee: NonNullable<Awaited<ReturnType<typeof findEmployeeById>>>;
      skillSheet: Awaited<ReturnType<typeof findSkillSheetByEmployeeId>>;
    }
  | {
      ok: false;
      error: "EMPLOYEE_NOT_FOUND";
    };

export async function getEmployeeSkillSheet(
  employeeId: string,
): Promise<GetEmployeeSkillSheetResult> {
  const employee = await findEmployeeById(employeeId);

  if (!employee) {
    return {
      ok: false,
      error: "EMPLOYEE_NOT_FOUND",
    };
  }

  const skillSheet = await findSkillSheetByEmployeeId(employee.id);

  return {
    ok: true,
    employee,
    skillSheet,
  };
}
