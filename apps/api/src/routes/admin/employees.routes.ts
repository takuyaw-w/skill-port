import { zValidator } from '@hono/zod-validator'
import { Hono } from "hono";
import { db } from "../../db/client.js";
import { employees } from "../../db/schema.js";
import { createEmployeeRequestSchema } from '../../schemas/admin/employees.requests.js';
import { zodErrorResponse } from '../../shared/validation/zod-error-response.js';
import { createEmployeeWithInvitation } from '../../services/admin/create-employee-with-invitation.js';

export const adminEmployeesRoutes = new Hono()

adminEmployeesRoutes.get("/", async (c) => {
  const rows = await db.select().from(employees);

  return c.json({
    employees: rows
  })
})

adminEmployeesRoutes.post(
  "/",
  zValidator("json", createEmployeeRequestSchema, (result, c) => {
    if (!result.success) {
      return zodErrorResponse(c, result.error);
    }
  }),
  async (c) => {
    const body = await c.req.valid("json")

    const result = await createEmployeeWithInvitation(body)

    return c.json(result, 201)
  })



