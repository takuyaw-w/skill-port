import { z } from "zod";

import { EmployeeGender } from "../../const/employee-gender.js";

export const employeeGenderSchema = z.union([
  z.literal(EmployeeGender.Unanswered),
  z.literal(EmployeeGender.Male),
  z.literal(EmployeeGender.Female),
  z.literal(EmployeeGender.Other),
]);

export const createEmployeeRequestSchema = z
  .object({
    email: z.email(),
    employeeCode: z.string().trim().min(1).max(64),
    familyName: z.string().trim().min(1).max(50),
    givenName: z.string().trim().min(1).max(50),
    familyNameKana: z.string().trim().min(1).max(50).optional(),
    givenNameKana: z.string().trim().min(1).max(50).optional(),
    birthDate: z.iso.date().optional(),
    gender: employeeGenderSchema.optional(),
  })
  .strict();

export type CreateEmployeeRequest = z.infer<typeof createEmployeeRequestSchema>;
