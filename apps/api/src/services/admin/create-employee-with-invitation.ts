import { db } from "../../db/client.js";
import { env } from "../../config/env.js";
import {
  createInvitationExpiresAt,
  generateInvitationToken,
  hashInvitationToken,
} from "../../lib/invitation-token.js";
import { createEmployeeInvitationToken } from "../../repositories/employee-invitation-tokens.repository.js";
import { createPendingEmployee } from "../../repositories/employees.repository.js";
import type { CreateEmployeeRequest } from "../../schemas/admin/employees.requests.js";

export async function createEmployeeWithInvitation(input: CreateEmployeeRequest) {
  const employeeId = globalThis.crypto.randomUUID();
  const invitationToken = generateInvitationToken();

  const employee = await db.transaction(async (tx) => {
    const createdEmployee = await createPendingEmployee(
      {
        id: employeeId,
        email: input.email,
        employeeCode: input.employeeCode,
        fullName: input.fullName,
        displayName: input.displayName ?? input.fullName,
      },
      tx,
    );

    await createEmployeeInvitationToken(
      {
        id: globalThis.crypto.randomUUID(),
        employeeId,
        tokenHash: hashInvitationToken(invitationToken),
        expiresAt: createInvitationExpiresAt(),
      },
      tx,
    );

    return createdEmployee;
  });

  const invitationUrl = `${env.EMPLOYEE_WEB_URL}/invitation/${invitationToken}`;

  return {
    employee,
    invitationUrl,
  };
}
