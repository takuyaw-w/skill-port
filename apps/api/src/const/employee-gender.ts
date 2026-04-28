export const EmployeeGender = {
  Unanswered: 0,
  Male: 1,
  Female: 2,
  Other: 3,
} as const;

export type EmployeeGender = (typeof EmployeeGender)[keyof typeof EmployeeGender];

export const employeeGenderLabels: Record<EmployeeGender, string> = {
  [EmployeeGender.Unanswered]: "未回答",
  [EmployeeGender.Male]: "男性",
  [EmployeeGender.Female]: "女性",
  [EmployeeGender.Other]: "その他",
};
