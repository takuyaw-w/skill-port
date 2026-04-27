import { findEmployeeByUserId } from "../../repositories/employees.repository.js";

type GetCurrentEmployeeResult =
  | {
    ok: true;
    employee: {
      id: string;
      userId: string | null;
      email: string;
      employeeCode: string;
      fullName: string;
      displayName: string;
      status: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }
  | {
    ok: false;
    error: "EMPLOYEE_NOT_FOUND";
  };

export async function getCurrentEmployee(userId: string): Promise<GetCurrentEmployeeResult> {
  const employee = await findEmployeeByUserId(userId)

  if (!employee) {
    return {
      ok: false,
      error: "EMPLOYEE_NOT_FOUND"
    }
  }

  return {
    ok: true,
    employee
  }
}
