import { Hono } from "hono";
import { db } from "../../db/client.js";
import { employees } from "../../db/schema.js";

export const adminEmployeesRoutes = new Hono()

adminEmployeesRoutes.get("/", async (c) => {
  const rows = await db.select().from(employees);

  return c.json({
    employees: rows
  })
})

adminEmployeesRoutes.post("/", async (c) => {
  const body = await c.req.json<{
    userId: string;
    employeeCode: string;
    fullName: string;
    displayName?: string;
  }>()

  const id = globalThis.crypto.randomUUID()

  const [employee] = await db
    .insert(employees)
    .values({
      id,
      userId: body.userId,
      employeeCode: body.employeeCode,
      fullName: body.fullName,
      displayName: body.displayName,
      status: "active"
    })
    .returning()

  return c.json({ employee }, 201)
})
