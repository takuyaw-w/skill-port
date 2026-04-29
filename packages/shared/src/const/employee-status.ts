export const EmployeeStatus = {
  PendingInvitation: "pending_invitation",
  Active: "active",
  Inactive: "inactive",
} as const;

export const employeeStatusValues = [
  EmployeeStatus.PendingInvitation,
  EmployeeStatus.Active,
  EmployeeStatus.Inactive,
] as const;

export type EmployeeStatusValue = (typeof employeeStatusValues)[number];

export const employeeStatusLabels: Record<EmployeeStatusValue, string> = {
  [EmployeeStatus.PendingInvitation]: "招待中",
  [EmployeeStatus.Active]: "有効",
  [EmployeeStatus.Inactive]: "無効",
};
