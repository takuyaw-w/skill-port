import { and, eq, gt } from "drizzle-orm";

import { db } from "../../db/client.js";
import { employeeInvitationTokens, employees } from "../../db/schema.js";
import { hashInvitationToken } from "../../lib/invitation-token.js";

export async function getPendingInvitationByToken(token: string) {
  const tokenHash = hashInvitationToken(token);

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
        gt(employeeInvitationTokens.expiresAt, new Date()),
      ),
    )
    .limit(1);

  return invitation ?? null;
}
