import { z } from "zod";

export const employeeGenderSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
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
