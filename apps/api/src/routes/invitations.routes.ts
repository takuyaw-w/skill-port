import { and, eq, gt } from "drizzle-orm";
import { Hono } from "hono";
import { auth } from "../auth/auth.js";
import { db } from "../db/client.js";
import { employeeInvitationTokens, employees, user } from "../db/schema.js";
import { hashInvitationToken } from "../lib/invitation-token.js";

export const invitationRoutes = new Hono()

invitationRoutes.get("/:token", async (c) => {
  const token = c.req.param("token")
  const tokenHash = hashInvitationToken(token)

  const [invitation] = await db
    .select({
      invitationId: employeeInvitationTokens.id,
      invitationStatus: employeeInvitationTokens.status,
      expiresAt: employeeInvitationTokens.expiresAt,

      employeeId: employees.id,
      employeeCode: employees.employeeCode,
      fullName: employees.fullName,
      displayName: employees.displayName,
      employeeStatus: employees.status,

      userId: user.id,
      email: user.email,
      name: user.name,
    })
    .from(employeeInvitationTokens)
    .innerJoin(employees, eq(employeeInvitationTokens.employeeId, employees.id))
    .innerJoin(user, eq(employees.userId, user.id))
    .where(
      and(
        eq(employeeInvitationTokens.tokenHash, tokenHash),
        eq(employeeInvitationTokens.status, "pending"),
        gt(employeeInvitationTokens.expiresAt, new Date())
      )
    )
    .limit(1);

  if (!invitation) {
    return c.json({
      error: "Invitation not found or expired",
    }, 404)
  }

  return c.json({
    invitation: {
      id: invitation.invitationId,
      expiresAt: invitation.expiresAt
    },
    employee: {
      id: invitation.employeeId,
      employeeCode: invitation.employeeCode,
      fullName: invitation.fullName,
      displayName: invitation.displayName,
      status: invitation.employeeStatus
    },
    user: {
      id: invitation.userId,
      email: invitation.email,
      name: invitation.name
    }
  })
})

invitationRoutes.post("/:token/accept", async (c) => {
  const token = c.req.param("token")
  const tokenHash = hashInvitationToken(token)

  const body = await c.req.json<{ password: string }>();

  if (body.password.length < 8) {
    return c.json({
      error: "Password must be at least 8 characters"
    }, 400)
  }

  const [invitation] = await db
    .select({
      invitationId: employeeInvitationTokens.id,
      employeeId: employees.id,
      userId: user.id
    })
    .from(employeeInvitationTokens)
    .innerJoin(employees, eq(employeeInvitationTokens.employeeId, employees.id))
    .innerJoin(user, eq(employees.userId, user.id))
    .where(
      and(
        eq(employeeInvitationTokens.tokenHash, tokenHash),
        eq(employeeInvitationTokens.status, "pending"),
        gt(employeeInvitationTokens.expiresAt, new Date()),
      )
    )
    .limit(1)

  if (!invitation) {
    return c.json({
      error: "Invitation not found or expired"
    }, 404)
  }

  await auth.api.setUserPassword({
    body: {
      userId: invitation.userId,
      newPassword: body.password
    }
  })

  await db.transaction(async (tx) => {
    await tx
      .update(employeeInvitationTokens)
      .set({
        status: "used",
        usedAt: new Date()
      })
      .where(eq(employeeInvitationTokens.id, invitation.invitationId));

    await tx
      .update(employees)
      .set({
        status: "active"
      })
      .where(eq(employees.id, invitation.employeeId))
  });

  return c.json({
    status: 'ok'
  })
})
