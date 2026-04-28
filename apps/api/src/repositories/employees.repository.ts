import { eq } from "drizzle-orm";

import { db } from "../db/client.js";
import type { DbClient, Transaction } from "../db/client.js";
import { employees } from "../db/schema.js";
import type { EmployeeGender } from "../const/employee-gender.js";
import { EmployeeGender as EmployeeGenderValue } from "../const/employee-gender.js";

type CreatePendingEmployeeInput = {
  email: string;
  employeeCode: string;
  familyName: string;
  givenName: string;
  familyNameKana?: string;
  givenNameKana?: string;
  birthDate?: string;
  gender?: EmployeeGender;
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
  const values: typeof employees.$inferInsert = {
    userId: null,
    email: input.email,
    employeeCode: input.employeeCode,
    familyName: input.familyName,
    givenName: input.givenName,
    gender: input.gender ?? EmployeeGenderValue.Unanswered,
    status: "pending_invitation",
  };

  if (input.familyNameKana !== undefined) {
    values.familyNameKana = input.familyNameKana;
  }

  if (input.givenNameKana !== undefined) {
    values.givenNameKana = input.givenNameKana;
  }

  if (input.birthDate !== undefined) {
    values.birthDate = input.birthDate;
  }

  const [employee] = await client.insert(employees).values(values).returning();

  return employee;
}

export async function linkEmployeeToUser(input: LinkEmployeeToUserInput, client: DbClient = db) {
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

export async function findEmployeeByUserId(userId: string, client: DbClient = db) {
  const [employee] = await client
    .select({
      id: employees.id,
      userId: employees.userId,
      email: employees.email,
      employeeCode: employees.employeeCode,
      familyName: employees.familyName,
      givenName: employees.givenName,
      familyNameKana: employees.familyNameKana,
      givenNameKana: employees.givenNameKana,
      birthDate: employees.birthDate,
      gender: employees.gender,
      status: employees.status,
      createdAt: employees.createdAt,
      updatedAt: employees.updatedAt,
    })
    .from(employees)
    .where(eq(employees.userId, userId))
    .limit(1);
  return employee ?? null;
}
