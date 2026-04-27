import { Hono } from "hono";
import { db } from "../../db/client.js";
import { employees } from "../../db/schema.js";
import { auth } from "../../auth/auth.js";

export const adminEmployeesRoutes = new Hono()

adminEmployeesRoutes.get("/", async (c) => {
  const rows = await db.select().from(employees);

  return c.json({
    employees: rows
  })
})

adminEmployeesRoutes.post("/", async (c) => {
  const body = await c.req.json<{
    email: string;
    password: string;
    name: string;
    employeeCode: string;
    fullName: string;
    displayName?: string;
  }>()

  const result = await auth.api.createUser({
    body: {
      email: body.email,
      password: body.password,
      name: body.name,
      role: "employee"
    }
  })

  const id = globalThis.crypto.randomUUID()

  const [employee] = await db
    .insert(employees)
    .values({
      id,
      userId: result.user.id,
      employeeCode: body.employeeCode,
      fullName: body.fullName,
      displayName: body.displayName ?? body.fullName,
      status: "active"
    })
    .returning()

  return c.json({
    user: {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
    },
    employee,
  }, 201)
})


