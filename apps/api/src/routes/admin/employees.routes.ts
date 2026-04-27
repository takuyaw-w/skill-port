// apps/api/src/routes/admin/employees.routes.ts

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { createEmployeeRequestSchema } from "../../schemas/admin/employees.requests.js";
import { createEmployeeWithInvitation } from "../../services/admin/create-employee-with-invitation.js";
import { listEmployees } from "../../services/admin/list-employees.js";
import { zodErrorResponse } from "../../shared/validation/zod-error-response.js";

export const adminEmployeesRoutes = new Hono();

adminEmployeesRoutes.get("/", async (c) => {
  const employees = await listEmployees();

  return c.json({
    employees,
  });
});

adminEmployeesRoutes.post(
  "/",
  zValidator("json", createEmployeeRequestSchema, (result, c) => {
    if (!result.success) {
      return zodErrorResponse(c, result.error);
    }
  }),
  async (c) => {
    const body = c.req.valid("json");

    const result = await createEmployeeWithInvitation(body);

    return c.json(result, 201);
  },
);
