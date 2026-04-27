import { eq } from "drizzle-orm";

import { db } from "../db/client.js";
import { employees } from "../db/schema.js";

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
type DbClient = typeof db | Transaction;

type CreatePendingEmployeeInput = {
  id: string;
  email: string;
  employeeCode: string;
  fullName: string;
  displayName: string;
};

type LinkEmployeeToUserInput = {
  employeeId: string;
  userId: string;
};

export async function listEmployees(client: DbClient = db) {
  return client.select().from(employees);
}

export async function createPendingEmployee(
  input: CreatePendingEmployeeInput,
  client: DbClient = db,
) {
  const [employee] = await client
    .insert(employees)
    .values({
      id: input.id,
      userId: null,
      email: input.email,
      employeeCode: input.employeeCode,
      fullName: input.fullName,
      displayName: input.displayName,
      status: "pending_invitation",
    })
    .returning();

  return employee;
}

export async function linkEmployeeToUser(
  input: LinkEmployeeToUserInput,
  client: DbClient = db,
) {
  const [employee] = await client
    .update(employees)
    .set({
      userId: input.userId,
      status: "active",
    })
    .where(eq(employees.id, input.employeeId))
    .returning();

  return employee;
}
