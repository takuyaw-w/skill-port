import { db } from "../src/db/client.js";
import { skillSheets } from "../src/db/schema.js";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { cleanupDatabase } from "./helpers/cleanup.js";
import { createTestUser, loginAndGetCookie } from "./helpers/auth.js";
import { uniqueEmail } from "./helpers/test-data.js";

describe("admin employees API", () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  it("admin can create employee and receive invitationUrl", async () => {
    const adminEmail = uniqueEmail("admin");
    const adminPassword = "password123";

    await createTestUser({
      email: adminEmail,
      password: adminPassword,
      name: "Admin",
      role: "admin",
    });

    const cookie = await loginAndGetCookie(adminEmail, adminPassword);

    const res = await app.request("/api/admin/employees", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie,
      },
      body: JSON.stringify({
        email: "employee@example.com",
        employeeCode: "EMP001",
        familyName: "Test",
        givenName: "Employee",
        familyNameKana: "テスト",
        givenNameKana: "エンプロイー",
        gender: 1,
      }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();

    expect(body.employee).toMatchObject({
      email: "employee@example.com",
      employeeCode: "EMP001",
      familyName: "Test",
      givenName: "Employee",
      familyNameKana: "テスト",
      givenNameKana: "エンプロイー",
      gender: 1,
      status: "pending_invitation",
    });

    expect(body.invitationUrl).toContain("/invitation/");
  });

  it("rejects invalid employee request body", async () => {
    const adminEmail = uniqueEmail("admin");
    const adminPassword = "password123";

    await createTestUser({
      email: adminEmail,
      password: adminPassword,
      name: "Admin",
      role: "admin",
    });

    const cookie = await loginAndGetCookie(adminEmail, adminPassword);

    const res = await app.request("/api/admin/employees", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie,
      },
      body: JSON.stringify({
        email: "invalid-email",
        employeeCode: "EMP001",
        familyName: "Test",
        givenName: "Employee",
      }),
    });

    expect(res.status).toBe(400);

    const body = await res.json();

    expect(body.error).toBe("Invalid request body");
    expect(body.issues.length).toBeGreaterThan(0);
  });

  it("employee cannot access admin endpoint", async () => {
    const employeeEmail = uniqueEmail("employee");
    const employeePassword = "password123";

    await createTestUser({
      email: employeeEmail,
      password: employeePassword,
      name: "Employee",
      role: "employee",
    });

    const cookie = await loginAndGetCookie(employeeEmail, employeePassword);

    const res = await app.request("/api/admin/me", {
      method: "GET",
      headers: {
        cookie,
      },
    });

    expect(res.status).toBe(403);
  });

  it("admin can list employees with hasSkillSheet", async () => {
    const adminEmail = uniqueEmail("admin");
    const adminPassword = "password123";

    await createTestUser({
      email: adminEmail,
      password: adminPassword,
      name: "Admin",
      role: "admin",
    });

    const cookie = await loginAndGetCookie(adminEmail, adminPassword);

    const firstEmployeeRes = await app.request("/api/admin/employees", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie,
      },
      body: JSON.stringify({
        email: uniqueEmail("employee-a"),
        employeeCode: "EMP001",
        familyName: "Skill",
        givenName: "Exists",
        familyNameKana: "スキル",
        givenNameKana: "アリ",
        gender: 1,
      }),
    });

    expect(firstEmployeeRes.status).toBe(201);

    const firstEmployeeBody = await firstEmployeeRes.json();

    const secondEmployeeRes = await app.request("/api/admin/employees", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie,
      },
      body: JSON.stringify({
        email: uniqueEmail("employee-b"),
        employeeCode: "EMP002",
        familyName: "Skill",
        givenName: "None",
        familyNameKana: "スキル",
        givenNameKana: "ナシ",
        gender: 2,
      }),
    });

    expect(secondEmployeeRes.status).toBe(201);

    await db.insert(skillSheets).values({
      employeeId: firstEmployeeBody.employee.id,
      publicInitials: "S.E.",
      nearestStation: "大宮",
      experienceLabel: "約5年",
      selfPr: "test",
    });

    const listRes = await app.request("/api/admin/employees", {
      method: "GET",
      headers: {
        cookie,
      },
    });

    expect(listRes.status).toBe(200);

    const body = await listRes.json();

    expect(body.employees).toHaveLength(2);

    expect(body.employees[0]).toMatchObject({
      employeeCode: "EMP001",
      familyName: "Skill",
      givenName: "Exists",
      hasSkillSheet: true,
    });

    expect(body.employees[1]).toMatchObject({
      employeeCode: "EMP002",
      familyName: "Skill",
      givenName: "None",
      hasSkillSheet: false,
    });
  });

  it("employee cannot list employees", async () => {
    const employeeEmail = uniqueEmail("employee");
    const employeePassword = "password123";

    await createTestUser({
      email: employeeEmail,
      password: employeePassword,
      name: "Employee",
      role: "employee",
    });

    const cookie = await loginAndGetCookie(employeeEmail, employeePassword);

    const res = await app.request("/api/admin/employees", {
      method: "GET",
      headers: {
        cookie,
      },
    });

    expect(res.status).toBe(403);
  });
});
