import { Hono } from "hono";
import { requireEmployee } from "../middleware/require-employee.js";
import { getCurrentEmployee } from "../services/employee/get-current-employee.js";
import type { AppVariables } from "../types/hono.js";
import { getCurrentEmployeeSkillSheet } from "../services/employee/get-current-employee-skill-sheet.js";
import { zValidator } from "@hono/zod-validator";
import { saveSkillSheetRequestSchema } from "../schemas/employee/skill-sheet.requests.js";
import { zodErrorResponse } from "../shared/validation/zod-error-response.js";
import { saveCurrentEmployeeSkillSheet } from "../schemas/employee/save-current-employee-skill-sheet.js";

export const employeeRoutes = new Hono<{ Variables: AppVariables }>();

employeeRoutes.use("*", requireEmployee);

employeeRoutes.get("/me", async (c) => {
  const user = c.get("user");

  const result = await getCurrentEmployee(user.id);

  if (!result.ok) {
    return c.json({ error: "Employee not found" }, 404);
  }

  return c.json({
    status: "ok",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    employee: {
      id: result.employee.id,
      employeeCode: result.employee.employeeCode,
      email: result.employee.email,
      familyName: result.employee.familyName,
      givenName: result.employee.givenName,
      familyNameKana: result.employee.familyNameKana,
      givenNameKana: result.employee.givenNameKana,
      birthDate: result.employee.birthDate,
      gender: result.employee.gender,
      status: result.employee.status,
    },
  });
});

employeeRoutes.get('/skill-sheet', async (c) => {
  const user = c.get('user')

  const result = await getCurrentEmployeeSkillSheet(user.id)

  if (!result.ok) {
    return c.json({ error: "Employee not found." }, 404)
  }

  return c.json({
    status: "ok",
    skillSheet: result.skillSheet
  })
})

employeeRoutes.put(
  '/skill-sheet',
  zValidator("json", saveSkillSheetRequestSchema, (result, c) => {
    if (!result.success) {
      return zodErrorResponse(c, result.error)
    }
  }),
  async (c) => {
    const user = c.get("user")
    const body = c.req.valid("json")

    const result = await saveCurrentEmployeeSkillSheet(user.id, body)

    if (!result.ok) {
      switch (result.error) {
        case "EMPLOYEE_NOT_FOUND":
          return c.json({ error: "Employee not found" }, 404)
        case "SKILL_SHEET_NOT_FOUND_AFTER_SAVE":
          return c.json({ error: "Skill sheet not found after save" }, 500)
      }
    }

    return c.json({
      status: "ok",
      skillSheet: result.skillSheet
    })
  }
)
