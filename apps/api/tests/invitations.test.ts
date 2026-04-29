import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { app } from "../src/app.js";
import { cleanupDatabase } from "./helpers/cleanup.js";
import { createTestUser, loginAndGetCookie } from "./helpers/auth.js";
import { uniqueEmail } from "./helpers/test-data.js";

function extractInvitationToken(invitationUrl: string) {
  const url = new URL(invitationUrl);
  return url.pathname.split("/").at(-1);
}

describe("invitations API", () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  it("employee can accept invitation, login, and fetch current employee", async () => {
    const adminEmail = uniqueEmail("admin");
    const adminPassword = "password123";

    const employeeEmail = uniqueEmail("employee");
    const employeePassword = "employee-password123";

    await createTestUser({
      email: adminEmail,
      password: adminPassword,
      name: "Admin",
      role: "admin",
    });

    const adminCookie = await loginAndGetCookie(adminEmail, adminPassword);

    const createEmployeeRes = await app.request("/api/admin/employees", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: adminCookie,
      },
      body: JSON.stringify({
        email: employeeEmail,
        employeeCode: "EMP001",
        familyName: "Test",
        givenName: "Employee",
        familyNameKana: "テスト",
        givenNameKana: "エンプロイー",
        gender: 1,
      }),
    });

    expect(createEmployeeRes.status).toBe(201);

    const createEmployeeBody = await createEmployeeRes.json();
    const token = extractInvitationToken(createEmployeeBody.invitationUrl);

    expect(token).toBeTruthy();

    const invitationRes = await app.request(`/api/invitations/${token}`, {
      method: "GET",
    });

    expect(invitationRes.status).toBe(200);

    const invitationBody = await invitationRes.json();

    expect(invitationBody.employee).toMatchObject({
      employeeCode: "EMP001",
      familyName: "Test",
      givenName: "Employee",
      familyNameKana: "テスト",
      givenNameKana: "エンプロイー",
      gender: 1,
      status: "pending_invitation",
    });

    const acceptRes = await app.request(`/api/invitations/${token}/accept`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        password: employeePassword,
      }),
    });

    expect(acceptRes.status).toBe(200);

    const acceptBody = await acceptRes.json();

    expect(acceptBody.status).toBe("ok");
    expect(acceptBody.user).toMatchObject({
      email: employeeEmail,
      role: "employee",
    });
    expect(acceptBody.employee).toMatchObject({
      email: employeeEmail,
      employeeCode: "EMP001",
      familyName: "Test",
      givenName: "Employee",
      familyNameKana: "テスト",
      givenNameKana: "エンプロイー",
      gender: 1,
      status: "active",
    });

    const reusedInvitationRes = await app.request(`/api/invitations/${token}`, {
      method: "GET",
    });

    expect(reusedInvitationRes.status).toBe(404);

    const employeeCookie = await loginAndGetCookie(employeeEmail, employeePassword);

    const employeeMeRes = await app.request("/api/employee/me", {
      method: "GET",
      headers: {
        cookie: employeeCookie,
      },
    });

    expect(employeeMeRes.status).toBe(200);

    const employeeMeBody = await employeeMeRes.json();

    expect(employeeMeBody.user).toMatchObject({
      email: employeeEmail,
      role: "employee",
    });
    expect(employeeMeBody.employee).toMatchObject({
      email: employeeEmail,
      employeeCode: "EMP001",
      familyName: "Test",
      givenName: "Employee",
      familyNameKana: "テスト",
      givenNameKana: "エンプロイー",
      gender: 1,
      status: "active",
    });

    const adminMeRes = await app.request("/api/admin/me", {
      method: "GET",
      headers: {
        cookie: employeeCookie,
      },
    });

    expect(adminMeRes.status).toBe(403);

    const adminEmployeeMeRes = await app.request("/api/employee/me", {
      method: "GET",
      headers: {
        cookie: adminCookie,
      },
    });

    expect(adminEmployeeMeRes.status).toBe(403);
  });

  it("rejects short password when accepting invitation", async () => {
    const res = await app.request("/api/invitations/dummy-token/accept", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        password: "short",
      }),
    });

    expect(res.status).toBe(400);

    const body = await res.json();

    expect(body.error).toMatchObject({
      code: "VALIDATION_ERROR",
      message: "Invalid request body",
    });
  });
});
