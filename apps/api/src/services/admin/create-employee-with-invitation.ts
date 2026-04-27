import { env } from "../../config/env.js";
import { db } from '../../db/client.js'
import { employeeInvitationTokens, employees } from "../../db/schema.js";
import { createInvitationExpiresAt, generateInvitationToken, hashInvitationToken } from "../../lib/invitation-token.js";
import type { CreateEmployeeRequest } from "../../schemas/admin/employees.requests.js";

export async function createEmployeeWithInvitation(
  input: CreateEmployeeRequest
) {
  const employeeId = globalThis.crypto.randomUUID()

  const [employee] = await db
    .insert(employees)
    .values({
      id: employeeId,
      userId: null,
      email: input.email,
      employeeCode: input.employeeCode,
      fullName: input.fullName,
      displayName: input.displayName ?? input.fullName,
      status: "pending_invitation",
    })
    .returning();

  const invitationToken = generateInvitationToken();

  await db.insert(employeeInvitationTokens).values({
    id: globalThis.crypto.randomUUID(),
    employeeId,
    tokenHash: hashInvitationToken(invitationToken),
    status: "pending",
    expiresAt: createInvitationExpiresAt(),
  });

  const invitationUrl = `${env.EMPLOYEE_WEB_URL}/invitation/${invitationToken}`;

  return {
    employee,
    invitationUrl,
  };
}
