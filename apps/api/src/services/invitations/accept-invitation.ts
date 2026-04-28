import { auth } from "../../auth/auth.js";
import { db } from "../../db/client.js";
import { hashInvitationToken } from "../../lib/invitation-token.js";
import {
  findPendingInvitationByTokenHash,
  markInvitationTokenAsUsed,
} from "../../repositories/employee-invitation-tokens.repository.js";
import { linkEmployeeToUser } from "../../repositories/employees.repository.js";
import type { AcceptInvitationRequest } from "../../schemas/invitations.requests.js";
import { formatEmployeeName } from "../../shared/employee/format-employee-name.js";

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
          familyName: string;
          givenName: string;
          familyNameKana: string | null;
          givenNameKana: string | null;
          birthDate: string | null;
          gender: number;
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

  const invitation = await findPendingInvitationByTokenHash(tokenHash);

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

  const employeeName = formatEmployeeName({
    familyName: invitation.familyName,
    givenName: invitation.givenName,
  });

  const createdUser = await auth.api.createUser({
    body: {
      email: invitation.email,
      password: input.password,
      name: employeeName,
      role: "employee",
    },
  });

  await db.transaction(async (tx) => {
    await linkEmployeeToUser(
      {
        employeeId: invitation.employeeId,
        userId: createdUser.user.id,
      },
      tx,
    );

    await markInvitationTokenAsUsed(
      {
        invitationId: invitation.invitationId,
      },
      tx,
    );
  });

  return {
    ok: true,
    data: {
      user: {
        id: createdUser.user.id,
        email: createdUser.user.email,
        name: createdUser.user.name,
        role: createdUser.user.role,
      },
      employee: {
        id: invitation.employeeId,
        employeeCode: invitation.employeeCode,
        email: invitation.email,
        familyName: invitation.familyName,
        givenName: invitation.givenName,
        familyNameKana: invitation.familyNameKana,
        givenNameKana: invitation.givenNameKana,
        birthDate: invitation.birthDate,
        gender: invitation.gender,
        status: "active",
      },
    },
  };
}
