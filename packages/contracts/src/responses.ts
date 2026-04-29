import type { AuthUserResponse } from "./models/auth.js";
import type {
  AdminEmployeeResponse,
  EmployeeResponse,
} from "./models/employees.js";
import type { SkillOptionResponse } from "./models/skill-options.js";
import type {
  NullableSkillSheetResponse,
  SkillSheetResponse,
} from "./models/skill-sheets.js";

export type CurrentEmployeeResponse = {
  user: AuthUserResponse;
  employee: EmployeeResponse;
};

export type EmployeeSkillSheetResponse = {
  skillSheet: NullableSkillSheetResponse;
};

export type SaveEmployeeSkillSheetResponse = {
  skillSheet: SkillSheetResponse;
};

export type ListAdminEmployeesResponse = {
  employees: AdminEmployeeResponse[];
};

export type CreateAdminEmployeeResponse = {
  employee: AdminEmployeeResponse;
  invitationUrl: string;
};

export type AdminEmployeeSkillSheetResponse = {
  employee: EmployeeResponse;
  skillSheet: NullableSkillSheetResponse;
};

export type ListSkillOptionsResponse = {
  skillOptions: SkillOptionResponse[];
};
