import { Hono } from "hono";
import { auth } from "../auth/auth.js";
import { requireEmployee } from "../middleware/require-employee.js";
import { getCurrentEmployee } from "../services/employee/get-current-employee.js";
import type { AppVariables } from "../types/hono.js";

export const employeeRoutes = new Hono<{ Variables: AppVariables }>()

employeeRoutes.use("*", requireEmployee)

employeeRoutes.get("/me", async (c) => {
  const user = c.get("user")

  const result = await getCurrentEmployee(user.id);

  if (!result.ok) {
    return c.json({ error: "Employee not found" }, 404)
  }

  return c.json({
    status: 'ok',
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
      fullName: result.employee.fullName,
      displayName: result.employee.displayName,
      status: result.employee.status
    }
  })
})
