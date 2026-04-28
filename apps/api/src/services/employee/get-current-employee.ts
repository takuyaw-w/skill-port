import { findEmployeeByUserId } from "../../repositories/employees.repository.js";

type GetCurrentEmployeeResult =
  | {
      ok: true;
      employee: {
        id: string;
        userId: string | null;
        email: string;
        employeeCode: string;
        familyName: string;
        givenName: string;
        familyNameKana: string | null;
        givenNameKana: string | null;
        birthDate: string | null;
        gender: number;
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
  const employee = await findEmployeeByUserId(userId);

  if (!employee) {
    return {
      ok: false,
      error: "EMPLOYEE_NOT_FOUND",
    };
  }

  return {
    ok: true,
    employee,
  };
}
