import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { app } from "../src/app.js";
import { cleanupDatabase } from "./helpers/cleanup.js";
import { createTestUser, loginAndGetCookie } from "./helpers/auth.js";
import { uniqueEmail } from "./helpers/test-data.js";

function extractInvitationToken(invitationUrl: string) {
  const url = new URL(invitationUrl);
  return url.pathname.split("/").at(-1);
}

async function createInvitedEmployeeAndLogin() {
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

  const employeeCode = `EMP-${randomUUID().slice(0, 8)}`;

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
      gender: 1,
    }),
  });

  expect(createEmployeeRes.status).toBe(201);

  const createEmployeeBody = await createEmployeeRes.json();
  const token = extractInvitationToken(createEmployeeBody.invitationUrl);

  expect(token).toBeTruthy();

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

  const employeeCookie = await loginAndGetCookie(employeeEmail, employeePassword);

  return {
    adminCookie,
    employeeCookie,
    employeeEmail,
    employeePassword,
    employeeCode,
  };
}

describe("employee skill sheet API", () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  it("returns null when current employee has no skill sheet", async () => {
    const { employeeCookie } = await createInvitedEmployeeAndLogin();

    const res = await app.request("/api/employee/skill-sheet", {
      method: "GET",
      headers: {
        cookie: employeeCookie,
      },
    });

    expect(res.status).toBe(200);

    const body = await res.json();

    expect(body).toEqual({
      status: "ok",
      skillSheet: null,
    });
  });

  it("employee can save and fetch own skill sheet", async () => {
    const { employeeCookie } = await createInvitedEmployeeAndLogin();

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
        selfPr: "Vue.js / TypeScript を中心としたフロントエンド開発を得意としています。",
        certifications: [
          {
            name: "基本情報技術者試験",
            sortOrder: 0,
          },
        ],
        skills: [
          {
            category: "language",
            name: "TypeScript",
            normalizedName: "typescript",
            sortOrder: 0,
          },
          {
            category: "framework",
            name: "Vue.js",
            normalizedName: "vue",
            sortOrder: 0,
          },
        ],
        projects: [
          {
            startYearMonth: "2020-01",
            endYearMonth: "2021-12",
            name: "業務管理システム開発",
            summary: "社内向け業務管理システムの開発。",
            responsibilities: "フロントエンド実装、API連携、単体テストを担当。",
            role: "member",
            teamSize: 10,
            sortOrder: 0,
            technologies: [
              {
                category: "language",
                name: "TypeScript",
                normalizedName: "typescript",
                sortOrder: 0,
              },
              {
                category: "framework",
                name: "Vue.js",
                normalizedName: "vue",
                sortOrder: 1,
              },
              {
                category: "database",
                name: "PostgreSQL",
                normalizedName: "postgresql",
                sortOrder: 2,
              },
            ],
            phases: [
              {
                phase: "basic_design",
                sortOrder: 0,
              },
              {
                phase: "implementation",
                sortOrder: 1,
              },
              {
                phase: "unit_test",
                sortOrder: 2,
              },
            ],
          },
        ],
      }),
    });

    expect(saveRes.status).toBe(200);

    const saveBody = await saveRes.json();

    expect(saveBody.status).toBe("ok");
    expect(saveBody.skillSheet).toMatchObject({
      publicInitials: "T.E.",
      nearestStation: "大宮",
      experienceLabel: "約5年",
      selfPr: "Vue.js / TypeScript を中心としたフロントエンド開発を得意としています。",
    });

    expect(saveBody.skillSheet.certifications).toHaveLength(1);
    expect(saveBody.skillSheet.certifications[0]).toMatchObject({
      name: "基本情報技術者試験",
      sortOrder: 0,
    });

    expect(saveBody.skillSheet.skills).toHaveLength(2);
    expect(saveBody.skillSheet.skills[0]).toMatchObject({
      category: "language",
      name: "TypeScript",
      normalizedName: "typescript",
      sortOrder: 0,
    });

    expect(saveBody.skillSheet.projects).toHaveLength(1);
    expect(saveBody.skillSheet.projects[0]).toMatchObject({
      startYearMonth: "2020-01",
      endYearMonth: "2021-12",
      name: "業務管理システム開発",
      role: "member",
      teamSize: 10,
      sortOrder: 0,
    });

    expect(saveBody.skillSheet.projects[0].technologies).toHaveLength(3);
    expect(saveBody.skillSheet.projects[0].phases).toHaveLength(3);

    const getRes = await app.request("/api/employee/skill-sheet", {
      method: "GET",
      headers: {
        cookie: employeeCookie,
      },
    });

    expect(getRes.status).toBe(200);

    const getBody = await getRes.json();

    expect(getBody.status).toBe("ok");
    expect(getBody.skillSheet).toMatchObject({
      id: saveBody.skillSheet.id,
      publicInitials: "T.E.",
      nearestStation: "大宮",
      experienceLabel: "約5年",
    });

    expect(getBody.skillSheet.certifications).toHaveLength(1);
    expect(getBody.skillSheet.skills).toHaveLength(2);
    expect(getBody.skillSheet.projects).toHaveLength(1);
    expect(getBody.skillSheet.projects[0].technologies).toHaveLength(3);
    expect(getBody.skillSheet.projects[0].phases).toHaveLength(3);
  });

  it("employee can replace own skill sheet children by saving again", async () => {
    const { employeeCookie } = await createInvitedEmployeeAndLogin();

    const firstSaveRes = await app.request("/api/employee/skill-sheet", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        cookie: employeeCookie,
      },
      body: JSON.stringify({
        publicInitials: "T.E.",
        nearestStation: "大宮",
        experienceLabel: "約5年",
        selfPr: "first",
        certifications: [
          {
            name: "基本情報技術者試験",
          },
        ],
        skills: [
          {
            category: "language",
            name: "TypeScript",
            normalizedName: "typescript",
          },
          {
            category: "framework",
            name: "Vue.js",
            normalizedName: "vue",
          },
        ],
        projects: [
          {
            startYearMonth: "2020-01",
            endYearMonth: "2021-12",
            name: "旧プロジェクト",
            technologies: [
              {
                category: "language",
                name: "TypeScript",
                normalizedName: "typescript",
              },
            ],
            phases: [
              {
                phase: "implementation",
              },
            ],
          },
        ],
      }),
    });

    expect(firstSaveRes.status).toBe(200);

    const secondSaveRes = await app.request("/api/employee/skill-sheet", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        cookie: employeeCookie,
      },
      body: JSON.stringify({
        publicInitials: "T.E.",
        nearestStation: "浦和",
        experienceLabel: "約6年",
        selfPr: "second",
        certifications: [],
        skills: [
          {
            category: "language",
            name: "JavaScript",
            normalizedName: "javascript",
          },
        ],
        projects: [],
      }),
    });

    expect(secondSaveRes.status).toBe(200);

    const getRes = await app.request("/api/employee/skill-sheet", {
      method: "GET",
      headers: {
        cookie: employeeCookie,
      },
    });

    expect(getRes.status).toBe(200);

    const body = await getRes.json();

    expect(body.skillSheet).toMatchObject({
      publicInitials: "T.E.",
      nearestStation: "浦和",
      experienceLabel: "約6年",
      selfPr: "second",
    });

    expect(body.skillSheet.certifications).toHaveLength(0);
    expect(body.skillSheet.skills).toHaveLength(1);
    expect(body.skillSheet.skills[0]).toMatchObject({
      category: "language",
      name: "JavaScript",
      normalizedName: "javascript",
    });
    expect(body.skillSheet.projects).toHaveLength(0);
  });

  it("rejects invalid project period", async () => {
    const { employeeCookie } = await createInvitedEmployeeAndLogin();

    const res = await app.request("/api/employee/skill-sheet", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        cookie: employeeCookie,
      },
      body: JSON.stringify({
        publicInitials: "T.E.",
        certifications: [],
        skills: [],
        projects: [
          {
            startYearMonth: "2021-12",
            endYearMonth: "2020-01",
            name: "不正な期間のプロジェクト",
            technologies: [],
            phases: [],
          },
        ],
      }),
    });

    expect(res.status).toBe(400);

    const body = await res.json();

    expect(body.error).toBe("Invalid request body");
    expect(body.issues.length).toBeGreaterThan(0);
  });

  it("rejects unauthenticated request", async () => {
    const res = await app.request("/api/employee/skill-sheet", {
      method: "GET",
    });

    expect(res.status).toBe(401);
  });
});
