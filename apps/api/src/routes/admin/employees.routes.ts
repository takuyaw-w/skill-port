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
import type {
  AdminEmployeeSkillSheetResponse,
  CreateAdminEmployeeResponse,
  ListAdminEmployeesResponse,
} from "../../types/api-responses.js";

export const adminEmployeesRoutes = new Hono();

adminEmployeesRoutes.get("/", async (c) => {
  const employees = await listEmployees();

  const response: ListAdminEmployeesResponse = {
    employees: presentEmployees(employees),
  };

  return jsonResponse(c, response);
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

    const response: CreateAdminEmployeeResponse = {
      employee: presentAdminEmployee(result.employee),
      invitationUrl: result.invitationUrl,
    };

    return createdResponse(c, response);
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

    const response: AdminEmployeeSkillSheetResponse = {
      employee: presentEmployee(result.employee),
      skillSheet: presentSkillSheet(result.skillSheet),
    };

    return jsonResponse(c, response);
  },
);
