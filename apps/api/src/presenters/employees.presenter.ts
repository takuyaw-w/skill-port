import type {
  AdminEmployeeResponse,
  EmployeeResponse,
} from "@skill-port/contracts";

type EmployeeLike = {
  id: string;
  userId?: string | null;
  email: string;
  employeeCode: string;
  familyName: string;
  givenName: string;
  familyNameKana: string | null;
  givenNameKana: string | null;
  birthDate: string | null;
  gender: number;
  status: string;
  hasSkillSheet?: boolean;
};

export function presentEmployee(employee: EmployeeLike): EmployeeResponse {
  return {
    id: employee.id,
    employeeCode: employee.employeeCode,
    email: employee.email,
    familyName: employee.familyName,
    givenName: employee.givenName,
    familyNameKana: employee.familyNameKana,
    givenNameKana: employee.givenNameKana,
    birthDate: employee.birthDate,
    gender: employee.gender as EmployeeResponse["gender"],
    status: employee.status as EmployeeResponse["status"],
  };
}

export function presentAdminEmployee(employee: EmployeeLike): AdminEmployeeResponse {
  return {
    ...presentEmployee(employee),
    hasSkillSheet: employee.hasSkillSheet ?? false,
  };
}

export function presentEmployees(employees: EmployeeLike[]): AdminEmployeeResponse[] {
  return employees.map(presentAdminEmployee);
}
