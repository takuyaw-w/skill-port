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
    })
    .from(employeeInvitationTokens)
    .innerJoin(employees, eq(employeeInvitationTokens.employeeId, employees.id))
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
  })
})

invitationRoutes.post("/:token/accept", async (c) => {
  const token = c.req.param("token");
  const tokenHash = hashInvitationToken(token);

  const body = await c.req.json<{
    password: string;
  }>();

  if (body.password.length < 8) {
    return c.json(
      {
        error: "Password must be at least 8 characters",
      },
      400,
    );
  }

  const [invitation] = await db
    .select({
      invitationId: employeeInvitationTokens.id,
      employeeId: employees.id,
      employeeCode: employees.employeeCode,
      email: employees.email,
      fullName: employees.fullName,
      displayName: employees.displayName,
      employeeStatus: employees.status,
      employeeUserId: employees.userId,
    })
    .from(employeeInvitationTokens)
    .innerJoin(employees, eq(employeeInvitationTokens.employeeId, employees.id))
    .where(
      and(
        eq(employeeInvitationTokens.tokenHash, tokenHash),
        eq(employeeInvitationTokens.status, "pending"),
        gt(employeeInvitationTokens.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (!invitation) {
    return c.json(
      {
        error: "Invitation not found or expired",
      },
      404,
    );
  }

  if (invitation.employeeUserId) {
    return c.json(
      {
        error: "Employee is already linked to a user",
      },
      409,
    );
  }

  if (invitation.employeeStatus !== "pending_invitation") {
    return c.json(
      {
        error: "Employee is not pending invitation",
      },
      409,
    );
  }

  const result = await auth.api.createUser({
    body: {
      email: invitation.email,
      password: body.password,
      name: invitation.fullName,
      role: "employee",
    },
  });

  await db.transaction(async (tx) => {
    await tx
      .update(employees)
      .set({
        userId: result.user.id,
        status: "active",
      })
      .where(eq(employees.id, invitation.employeeId));

    await tx
      .update(employeeInvitationTokens)
      .set({
        status: "used",
        usedAt: new Date(),
      })
      .where(eq(employeeInvitationTokens.id, invitation.invitationId));
  });

  return c.json({
    status: "ok",
    user: {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
    },
    employee: {
      id: invitation.employeeId,
      employeeCode: invitation.employeeCode,
      email: invitation.email,
      fullName: invitation.fullName,
      displayName: invitation.displayName,
      status: "active",
    },
  });
});
