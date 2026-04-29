import { Hono } from "hono";
import { requireEmployee } from "../middleware/require-employee.js";
import { getCurrentEmployee } from "../services/employee/get-current-employee.js";
import type { AppVariables } from "../types/hono.js";
import { getCurrentEmployeeSkillSheet } from "../services/employee/get-current-employee-skill-sheet.js";
import { zValidator } from "@hono/zod-validator";
import { saveSkillSheetRequestSchema } from "../schemas/employee/skill-sheet.requests.js";
import { zodErrorResponse } from "../shared/validation/zod-error-response.js";
import { saveCurrentEmployeeSkillSheet } from "../services/employee/save-current-employee-skill-sheet.js";
import { presentAuthUser } from "../presenters/auth.presenter.js";
import { presentEmployee } from "../presenters/employees.presenter.js";
import { presentSkillSheet } from "../presenters/skill-sheets.presenter.js";
import { errorResponse, jsonResponse } from "../shared/http/json-response.js";

export const employeeRoutes = new Hono<{ Variables: AppVariables }>();

employeeRoutes.use("*", requireEmployee);

employeeRoutes.get("/me", async (c) => {
  const user = c.get("user");

  const result = await getCurrentEmployee(user.id);

  if (!result.ok) {
    return errorResponse(c, 404, "EMPLOYEE_NOT_FOUND", "Employee not found");
  }

  return jsonResponse(c, {
    user: presentAuthUser(user),
    employee: presentEmployee(result.employee),
  });
});

employeeRoutes.get("/skill-sheet", async (c) => {
  const user = c.get("user");

  const result = await getCurrentEmployeeSkillSheet(user.id);

  if (!result.ok) {
    return errorResponse(c, 404, "EMPLOYEE_NOT_FOUND", "Employee not found");
  }

  return jsonResponse(c, {
    skillSheet: presentSkillSheet(result.skillSheet),
  });
});

employeeRoutes.put(
  "/skill-sheet",
  zValidator("json", saveSkillSheetRequestSchema, (result, c) => {
    if (!result.success) {
      return zodErrorResponse(c, result.error);
    }
  }),
  async (c) => {
    const user = c.get("user");
    const body = c.req.valid("json");

    const result = await saveCurrentEmployeeSkillSheet(user.id, body);

    if (!result.ok) {
      switch (result.error) {
        case "EMPLOYEE_NOT_FOUND":
          return errorResponse(c, 404, "EMPLOYEE_NOT_FOUND", "Employee not found");

        case "SKILL_OPTION_NOT_FOUND":
          return errorResponse(c, 400, "SKILL_OPTION_NOT_FOUND", "Skill option not found", {
            skillOptionId: result.skillOptionId,
          });

        case "SKILL_SHEET_NOT_FOUND_AFTER_SAVE":
          return errorResponse(
            c,
            500,
            "SKILL_SHEET_NOT_FOUND_AFTER_SAVE",
            "Skill sheet not found after save",
          );
      }
    }

    return jsonResponse(c, {
      skillSheet: presentSkillSheet(result.skillSheet),
    });
  },
);
