import { beforeEach, afterEach, describe, expect, it } from "vitest";

import { app } from "../src/app.js";
import { cleanupDatabase } from "./helpers/cleanup.js";
import { createTestUser, loginAndGetCookie } from "./helpers/auth.js";

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

  it("employee can accept invitation and login", async () => {
    const adminEmail = "admin@example.com";
    const adminPassword = "password123";

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
        email: "employee@example.com",
        employeeCode: "EMP001",
        fullName: "Test Employee",
        displayName: "Employee",
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

    const acceptRes = await app.request(`/api/invitations/${token}/accept`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        password: "employee-password123",
      }),
    });

    expect(acceptRes.status).toBe(200);

    const acceptBody = await acceptRes.json();

    expect(acceptBody.status).toBe("ok");
    expect(acceptBody.user).toMatchObject({
      email: "employee@example.com",
      role: "employee",
    });

    const reusedInvitationRes = await app.request(`/api/invitations/${token}`, {
      method: "GET",
    });

    expect(reusedInvitationRes.status).toBe(404);

    const employeeCookie = await loginAndGetCookie(
      "employee@example.com",
      "employee-password123",
    );

    const adminMeRes = await app.request("/api/admin/me", {
      method: "GET",
      headers: {
        cookie: employeeCookie,
      },
    });

    expect(adminMeRes.status).toBe(403);
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

    expect(body.error).toBe("Invalid request body");
  });
});
