// apps/api/src/routes/admin/employees.routes.ts

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { createEmployeeRequestSchema } from "../../schemas/admin/employees.requests.js";
import { createEmployeeWithInvitation } from "../../services/admin/create-employee-with-invitation.js";
import { listEmployees } from "../../services/admin/list-employees.js";
import { zodErrorResponse } from "../../shared/validation/zod-error-response.js";
import { getEmployeeSkillSheetParamSchema } from "../../schemas/admin/employee-skill-sheet.requests.js";
import { getEmployeeSkillSheet } from "../../services/admin/get-employee-skill-sheet.js";

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

adminEmployeesRoutes.get(
  "/:employeeId/skill-sheet",
  zValidator("param", getEmployeeSkillSheetParamSchema, (result, c) => {
    if (!result.success) {
      return zodErrorResponse(c, result.error);
    }
  }),
  async (c) => {
    const { employeeId } = c.req.valid("param");
    const result = await getEmployeeSkillSheet(employeeId);

    if (!result.ok) {
      switch (result.error) {
        case "EMPLOYEE_NOT_FOUND":
          return c.json({ error: "Employee not found" }, 404);
      }
    }

    return c.json({
      status: "ok",
      employee: result.employee,
      skillSheet: result.skillSheet,
    });
  },
);
