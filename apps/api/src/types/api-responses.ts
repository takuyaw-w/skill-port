import type { AuthUserResponse } from "../presenters/auth.presenter.js";
import type { AdminEmployeeResponse, EmployeeResponse } from "../presenters/employees.presenter.js";
import type { SkillOptionResponse } from "../presenters/skill-options.presenter.js";
import type { NullableSkillSheetResponse } from "../presenters/skill-sheets.presenter.js";

export type CurrentEmployeeResponse = {
  user: AuthUserResponse;
  employee: EmployeeResponse;
};

export type EmployeeSkillSheetResponse = {
  skillSheet: NullableSkillSheetResponse;
};

export type SaveEmployeeSkillSheetResponse = {
  skillSheet: Exclude<NullableSkillSheetResponse, null>;
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
