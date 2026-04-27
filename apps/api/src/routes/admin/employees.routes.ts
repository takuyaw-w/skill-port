import { zValidator } from '@hono/zod-validator'
import { Hono } from "hono";
import { db } from "../../db/client.js";
import { employees, employeeInvitationTokens } from "../../db/schema.js";
import { createInvitationExpiresAt, generateInvitationToken, hashInvitationToken, generateTemporaryPassword } from "@/src/lib/invitation-token.js";
import { env } from "../../config/env.js";
import { createEmployeeRequestSchema } from '@/src/schemas/admin/employees.requests.js';
import { zodErrorResponse } from '@/src/shared/validation/zod-error-response.js';

export const adminEmployeesRoutes = new Hono()

adminEmployeesRoutes.get("/", async (c) => {
  const rows = await db.select().from(employees);

  return c.json({
    employees: rows
  })
})

adminEmployeesRoutes.post(
  "/",
  zValidator("json", createEmployeeRequestSchema, (result, c) => {
    if (!result.success) {
      return zodErrorResponse(c, result.error);
    }
  }),
  async (c) => {
    const body = await c.req.valid("json")

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



