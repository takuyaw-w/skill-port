import { Hono } from "hono";
import { db } from "../../db/client.js";
import { employees, employeeInvitationTokens } from "../../db/schema.js";
import { auth } from "../../auth/auth.js";
import { createInvitationExpiresAt, generateInvitationToken, hashInvitationToken, generateTemporaryPassword } from "@/src/lib/invitation-token.js";
import { env } from "../../config/env.js";
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
    name: string;
    employeeCode: string;
    fullName: string;
    displayName?: string;
  }>()

  const employeeId = globalThis.crypto.randomUUID()

  const [employee] = await db
    .insert(employees)
    .values({
      id: employeeId,
      userId: null,
      email: body.email,
      employeeCode: body.employeeCode,
      fullName: body.fullName,
      displayName: body.displayName ?? body.fullName,
      status: "pending_invitation"
    })
    .returning()

  const invitationToken = generateInvitationToken();

  await db.insert(employeeInvitationTokens).values({
    id: globalThis.crypto.randomUUID(),
    employeeId,
    tokenHash: hashInvitationToken(invitationToken),
    status: "pending",
    expiresAt: createInvitationExpiresAt()
  })

  const invitationUrl = `${env.EMPLOYEE_WEB_URL}/invitation/${invitationToken}`

  return c.json({
    employee,
    invitationUrl,
  }, 201)
})



