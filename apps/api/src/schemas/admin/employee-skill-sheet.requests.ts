import { z } from "zod";

export const getEmployeeSkillSheetParamSchema = z
  .object({
    employeeId: z.uuid(),
  })
  .strict();

export type GetEmployeeSkillSheetParam = z.infer<typeof getEmployeeSkillSheetParamSchema>;
