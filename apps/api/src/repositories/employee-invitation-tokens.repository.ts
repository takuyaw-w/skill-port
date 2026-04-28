import { and, eq, gt } from "drizzle-orm";

import { db } from "../db/client.js";
import { employeeInvitationTokens, employees } from "../db/schema.js";

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
type DbClient = typeof db | Transaction;

type CreateEmployeeInvitationTokenInput = {
  employeeId: string;
  tokenHash: string;
  expiresAt: Date;
};

type MarkInvitationTokenAsUsedInput = {
  invitationId: string;
};

export async function createEmployeeInvitationToken(
  input: CreateEmployeeInvitationTokenInput,
  client: DbClient = db,
) {
  const [invitationToken] = await client
    .insert(employeeInvitationTokens)
    .values({
      employeeId: input.employeeId,
      tokenHash: input.tokenHash,
      status: "pending",
      expiresAt: input.expiresAt,
    })
    .returning();

  return invitationToken;
}

export async function findPendingInvitationByTokenHash(tokenHash: string, client: DbClient = db) {
  const [invitation] = await client
    .select({
      invitationId: employeeInvitationTokens.id,
      invitationStatus: employeeInvitationTokens.status,
      expiresAt: employeeInvitationTokens.expiresAt,

      employeeId: employees.id,
      employeeCode: employees.employeeCode,
      email: employees.email,
      familyName: employees.familyName,
      givenName: employees.givenName,
      familyNameKana: employees.familyNameKana,
      givenNameKana: employees.givenNameKana,
      birthDate: employees.birthDate,
      gender: employees.gender,
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

  return invitation ?? null;
}

export async function markInvitationTokenAsUsed(
  input: MarkInvitationTokenAsUsedInput,
  client: DbClient = db,
) {
  const [invitationToken] = await client
    .update(employeeInvitationTokens)
    .set({
      status: "used",
      usedAt: new Date(),
    })
    .where(eq(employeeInvitationTokens.id, input.invitationId))
    .returning();

  return invitationToken;
}
