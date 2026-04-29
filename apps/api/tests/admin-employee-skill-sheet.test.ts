import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { app } from "../src/app.js";
import { cleanupDatabase } from "./helpers/cleanup.js";
import { createTestUser, loginAndGetCookie } from "./helpers/auth.js";
import { uniqueEmail } from "./helpers/test-data.js";
import { EmployeeGender, ProjectPhase, ProjectRole, SkillCategory } from "@skill-port/shared";

function extractInvitationToken(invitationUrl: string) {
  const url = new URL(invitationUrl);
  const token = url.pathname.split("/").at(-1);

  if (!token) {
    throw new Error(`Invitation token was not found in URL: ${invitationUrl}`);
  }

  return token;
}

async function createAdminAndEmployee() {
  const adminEmail = uniqueEmail("admin");
  const adminPassword = "password123";

  const employeeEmail = uniqueEmail("employee");
  const employeePassword = "employee-password123";
  const employeeCode = `EMP-${randomUUID().slice(0, 8)}`;

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
      employeeCode,
      familyName: "Test",
      givenName: "Employee",
      familyNameKana: "テスト",
      givenNameKana: "エンプロイー",
      gender: EmployeeGender.Male,
    }),
  });

  expect(createEmployeeRes.status).toBe(201);

  const createEmployeeBody = await createEmployeeRes.json();
  const token = extractInvitationToken(createEmployeeBody.invitationUrl);

  return {
    adminCookie,
    employeeEmail,
    employeePassword,
    employeeCode,
    employee: createEmployeeBody.employee,
    token,
  };
}

async function acceptInvitationAndLoginEmployee(input: {
  token: string;
  employeeEmail: string;
  employeePassword: string;
}) {
  const acceptRes = await app.request(`/api/invitations/${input.token}/accept`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      password: input.employeePassword,
    }),
  });

  expect(acceptRes.status).toBe(200);

  return loginAndGetCookie(input.employeeEmail, input.employeePassword);
}

describe("admin employee skill sheet API", () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  it("admin can fetch null skill sheet for employee without skill sheet", async () => {
    const { adminCookie, employee } = await createAdminAndEmployee();

    const res = await app.request(`/api/admin/employees/${employee.id}/skill-sheet`, {
      method: "GET",
      headers: {
        cookie: adminCookie,
      },
    });

    expect(res.status).toBe(200);

    const body = await res.json();

    expect(body.employee).toMatchObject({
      id: employee.id,
      employeeCode: employee.employeeCode,
      email: employee.email,
      familyName: "Test",
      givenName: "Employee",
    });
    expect(body.skillSheet).toBeNull();
  });

  it("admin can fetch employee skill sheet", async () => {
    const { adminCookie, employee, employeeEmail, employeePassword, token } =
      await createAdminAndEmployee();

    const employeeCookie = await acceptInvitationAndLoginEmployee({
      token,
      employeeEmail,
      employeePassword,
    });

    const saveRes = await app.request("/api/employee/skill-sheet", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        cookie: employeeCookie,
      },
      body: JSON.stringify({
        publicInitials: "T.E.",
        nearestStation: "大宮",
        experienceLabel: "約5年",
        selfPr: "管理者閲覧テスト",
        certifications: [
          {
            name: "基本情報技術者試験",
            sortOrder: 0,
          },
        ],
        skills: [
          {
            category: SkillCategory.Language,
            name: "TypeScript",
            normalizedName: "typescript",
            sortOrder: 0,
          },
        ],
        projects: [
          {
            startYearMonth: "2020-01",
            endYearMonth: "2021-12",
            name: "業務管理システム開発",
            summary: "社内向け業務管理システムの開発。",
            responsibilities: "フロントエンド実装を担当。",
            role: ProjectRole.Member,
            teamSize: 10,
            sortOrder: 0,
            technologies: [
              {
                category: SkillCategory.Language,
                name: "TypeScript",
                normalizedName: "typescript",
                sortOrder: 0,
              },
            ],
            phases: [
              {
                phase: ProjectPhase.Implementation,
                sortOrder: 0,
              },
            ],
          },
        ],
      }),
    });

    expect(saveRes.status).toBe(200);

    const res = await app.request(`/api/admin/employees/${employee.id}/skill-sheet`, {
      method: "GET",
      headers: {
        cookie: adminCookie,
      },
    });

    expect(res.status).toBe(200);

    const body = await res.json();

    expect(body.employee).toMatchObject({
      id: employee.id,
      employeeCode: employee.employeeCode,
      email: employee.email,
    });

    expect(body.skillSheet).toMatchObject({
      publicInitials: "T.E.",
      nearestStation: "大宮",
      experienceLabel: "約5年",
      selfPr: "管理者閲覧テスト",
    });

    expect(body.skillSheet.certifications).toHaveLength(1);
    expect(body.skillSheet.skills).toHaveLength(1);
    expect(body.skillSheet.projects).toHaveLength(1);
    expect(body.skillSheet.projects[0].technologies).toHaveLength(1);
    expect(body.skillSheet.projects[0].phases).toHaveLength(1);
  });

  it("returns 404 when employee does not exist", async () => {
    const adminEmail = uniqueEmail("admin");
    const adminPassword = "password123";

    await createTestUser({
      email: adminEmail,
      password: adminPassword,
      name: "Admin",
      role: "admin",
    });

    const adminCookie = await loginAndGetCookie(adminEmail, adminPassword);

    const res = await app.request(`/api/admin/employees/${randomUUID()}/skill-sheet`, {
      method: "GET",
      headers: {
        cookie: adminCookie,
      },
    });

    expect(res.status).toBe(404);

    const body = await res.json();

    expect(body).toEqual({
      error: {
        code: "EMPLOYEE_NOT_FOUND",
        message: "Employee not found",
      },
    });
  });

  it("rejects employee access", async () => {
    const { employeeEmail, employeePassword, token, employee } = await createAdminAndEmployee();

    const employeeCookie = await acceptInvitationAndLoginEmployee({
      token,
      employeeEmail,
      employeePassword,
    });

    const res = await app.request(`/api/admin/employees/${employee.id}/skill-sheet`, {
      method: "GET",
      headers: {
        cookie: employeeCookie,
      },
    });

    expect(res.status).toBe(403);
  });

  it("rejects invalid employee id", async () => {
    const adminEmail = uniqueEmail("admin");
    const adminPassword = "password123";

    await createTestUser({
      email: adminEmail,
      password: adminPassword,
      name: "Admin",
      role: "admin",
    });

    const adminCookie = await loginAndGetCookie(adminEmail, adminPassword);

    const res = await app.request("/api/admin/employees/not-a-uuid/skill-sheet", {
      method: "GET",
      headers: {
        cookie: adminCookie,
      },
    });

    expect(res.status).toBe(400);

    const body = await res.json();

    expect(body.error).toMatchObject({
      code: "VALIDATION_ERROR",
      message: "Invalid request body",
    });
  });
});
