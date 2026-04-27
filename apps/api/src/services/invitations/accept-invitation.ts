import { and, eq, gt } from "drizzle-orm";

import { auth } from "../../auth/auth.js";
import { db } from "../../db/client.js";
import { employeeInvitationTokens, employees } from "../../db/schema.js";
import { hashInvitationToken } from "../../lib/invitation-token.js";
import type { AcceptInvitationRequest } from "../../schemas/invitations.requests.js";

type AcceptInvitationErrorCode =
  | "INVITATION_NOT_FOUND_OR_EXPIRED"
  | "EMPLOYEE_ALREADY_LINKED"
  | "EMPLOYEE_NOT_PENDING_INVITATION";

type AcceptInvitationResult =
  | {
    ok: true;
    data: {
      user: {
        id: string;
        email: string;
        name: string;
        role: string | null | undefined;
      };
      employee: {
        id: string;
        employeeCode: string;
        email: string;
        fullName: string;
        displayName: string | null;
        status: "active";
      };
    };
  }
  | {
    ok: false;
    error: AcceptInvitationErrorCode;
  };

export async function acceptInvitation(
  token: string,
  input: AcceptInvitationRequest,
): Promise<AcceptInvitationResult> {
  const tokenHash = hashInvitationToken(token);

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
    return {
      ok: false,
      error: "INVITATION_NOT_FOUND_OR_EXPIRED",
    };
  }

  if (invitation.employeeUserId) {
    return {
      ok: false,
      error: "EMPLOYEE_ALREADY_LINKED",
    };
  }

  if (invitation.employeeStatus !== "pending_invitation") {
    return {
      ok: false,
      error: "EMPLOYEE_NOT_PENDING_INVITATION",
    };
  }

  const result = await auth.api.createUser({
    body: {
      email: invitation.email,
      password: input.password,
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

  return {
    ok: true,
    data: {
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
    },
  };
}
