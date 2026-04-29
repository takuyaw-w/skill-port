// apps/api/src/routes/admin/employees.routes.ts

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { createEmployeeRequestSchema } from "../../schemas/admin/employees.requests.js";
import { createEmployeeWithInvitation } from "../../services/admin/create-employee-with-invitation.js";
import { listEmployees } from "../../services/admin/list-employees.js";
import { zodErrorResponse } from "../../shared/validation/zod-error-response.js";
import { getEmployeeSkillSheetParamSchema } from "../../schemas/admin/employee-skill-sheet.requests.js";
import { getEmployeeSkillSheet } from "../../services/admin/get-employee-skill-sheet.js";
import {
  presentAdminEmployee,
  presentEmployee,
  presentEmployees,
} from "../../presenters/employees.presenter.js";
import { presentSkillSheet } from "../../presenters/skill-sheets.presenter.js";
import { createdResponse, errorResponse, jsonResponse } from "../../shared/http/json-response.js";

export const adminEmployeesRoutes = new Hono();

adminEmployeesRoutes.get("/", async (c) => {
  const employees = await listEmployees();

  return jsonResponse(c, {
    employees: presentEmployees(employees),
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

    return createdResponse(c, {
      employee: presentAdminEmployee(result.employee),
      invitationUrl: result.invitationUrl,
    });
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
          return errorResponse(c, 404, "EMPLOYEE_NOT_FOUND", "Employee not found");
      }
    }

    return jsonResponse(c, {
      employee: presentEmployee(result.employee),
      skillSheet: presentSkillSheet(result.skillSheet),
    });
  },
);
