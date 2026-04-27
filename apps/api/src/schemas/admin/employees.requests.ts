import { z } from 'zod'

export const createEmployeeRequestSchema = z
  .object({
    email: z.email(),
    employeeCode: z.string().trim().min(1).max(64),
    fullName: z.string().trim().min(1).max(100),
    displayName: z.string().trim().min(1).max(100).optional(),
    name: z.string().trim().min(1).max(100).optional(),
  }).strict()

export type CreateEmployeeRequest = z.infer<typeof createEmployeeRequestSchema>
