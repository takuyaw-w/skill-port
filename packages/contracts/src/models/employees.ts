import type { EmployeeGenderValue, EmployeeStatusValue } from "@skill-port/shared";

export type EmployeeResponse = {
  id: string;
  employeeCode: string;
  email: string;
  familyName: string;
  givenName: string;
  familyNameKana: string | null;
  givenNameKana: string | null;
  birthDate: string | null;
  gender: EmployeeGenderValue;
  status: EmployeeStatusValue;
};

export type AdminEmployeeResponse = EmployeeResponse & {
  hasSkillSheet: boolean;
};
