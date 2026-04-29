import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { app } from "../src/app.js";
import { cleanupDatabase } from "./helpers/cleanup.js";
import { createTestUser, loginAndGetCookie } from "./helpers/auth.js";
import { uniqueEmail } from "./helpers/test-data.js";
import { db } from "../src/db/client.js";
import { skillOptions } from "../src/db/schema.js";
import { EmployeeGender } from "../src/const/employee-gender.js";
import { ProjectPhase } from "../src/const/project-phase.js";
import { ProjectRole } from "../src/const/project-role.js";
import { SkillCategory } from "../src/const/skill-category.js";

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
      gender: EmployeeGender.Male,
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
            category: SkillCategory.Language,
            name: "TypeScript",
            normalizedName: "typescript",
            sortOrder: 0,
          },
          {
            category: SkillCategory.Framework,
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
              {
                category: SkillCategory.Framework,
                name: "Vue.js",
                normalizedName: "vue",
                sortOrder: 1,
              },
              {
                category: SkillCategory.Database,
                name: "PostgreSQL",
                normalizedName: "postgresql",
                sortOrder: 2,
              },
            ],
            phases: [
              {
                phase: ProjectPhase.BasicDesign,
                sortOrder: 0,
              },
              {
                phase: ProjectPhase.Implementation,
                sortOrder: 1,
              },
              {
                phase: ProjectPhase.UnitTest,
                sortOrder: 2,
              },
            ],
          },
        ],
      }),
    });

    expect(saveRes.status).toBe(200);

    const saveBody = await saveRes.json();

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
      category: SkillCategory.Language,
      name: "TypeScript",
      normalizedName: "typescript",
      sortOrder: 0,
    });

    expect(saveBody.skillSheet.projects).toHaveLength(1);
    expect(saveBody.skillSheet.projects[0]).toMatchObject({
      startYearMonth: "2020-01",
      endYearMonth: "2021-12",
      name: "業務管理システム開発",
      role: ProjectRole.Member,
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
            category: SkillCategory.Language,
            name: "TypeScript",
            normalizedName: "typescript",
          },
          {
            category: SkillCategory.Framework,
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
                category: SkillCategory.Language,
                name: "TypeScript",
                normalizedName: "typescript",
              },
            ],
            phases: [
              {
                phase: ProjectPhase.Implementation,
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
            category: SkillCategory.Language,
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

    expect(body.error).toMatchObject({
      code: "VALIDATION_ERROR",
      message: "Invalid request body",
    });
    expect(body.error.issues.length).toBeGreaterThan(0);
  });

  it("rejects unauthenticated request", async () => {
    const res = await app.request("/api/employee/skill-sheet", {
      method: "GET",
    });

    expect(res.status).toBe(401);
  });

  it("uses skill option snapshot when skillOptionId is provided", async () => {
    const { employeeCookie } = await createInvitedEmployeeAndLogin();

    const [skillOption] = await db
      .insert(skillOptions)
      .values({
        category: SkillCategory.Framework,
        name: "Vue.js",
        normalizedName: "vue",
        sortOrder: 0,
        isActive: true,
      })
      .onConflictDoUpdate({
        target: [skillOptions.category, skillOptions.normalizedName],
        set: {
          name: "Vue.js",
          sortOrder: 0,
          isActive: true,
          updatedAt: new Date(),
        },
      })
      .returning();

    expect(skillOption).toBeTruthy();

    const saveRes = await app.request("/api/employee/skill-sheet", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        cookie: employeeCookie,
      },
      body: JSON.stringify({
        publicInitials: "T.E.",
        certifications: [],
        skills: [
          {
            skillOptionId: skillOption.id,
            category: SkillCategory.Database,
            name: "PostgreSQL",
            normalizedName: "postgresql",
          },
        ],
        projects: [
          {
            startYearMonth: "2020-01",
            endYearMonth: "2021-12",
            name: "マスタ補完テスト",
            technologies: [
              {
                skillOptionId: skillOption.id,
                category: SkillCategory.Database,
                name: "PostgreSQL",
                normalizedName: "postgresql",
              },
            ],
            phases: [],
          },
        ],
      }),
    });

    expect(saveRes.status).toBe(200);

    const body = await saveRes.json();

    expect(body.skillSheet.skills).toHaveLength(1);
    expect(body.skillSheet.skills[0]).toMatchObject({
      skillOptionId: skillOption.id,
      category: SkillCategory.Framework,
      name: "Vue.js",
      normalizedName: "vue",
    });

    expect(body.skillSheet.projects).toHaveLength(1);
    expect(body.skillSheet.projects[0].technologies).toHaveLength(1);
    expect(body.skillSheet.projects[0].technologies[0]).toMatchObject({
      skillOptionId: skillOption.id,
      category: SkillCategory.Framework,
      name: "Vue.js",
      normalizedName: "vue",
    });
  });

  it("rejects unknown skillOptionId", async () => {
    const { employeeCookie } = await createInvitedEmployeeAndLogin();

    const unknownSkillOptionId = randomUUID();

    const res = await app.request("/api/employee/skill-sheet", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        cookie: employeeCookie,
      },
      body: JSON.stringify({
        publicInitials: "T.E.",
        certifications: [],
        skills: [
          {
            skillOptionId: unknownSkillOptionId,
            category: SkillCategory.Language,
            name: "Unknown",
            normalizedName: "unknown",
          },
        ],
        projects: [],
      }),
    });

    expect(res.status).toBe(400);

    const body = await res.json();

    expect(body).toMatchObject({
      error: {
        code: "SKILL_OPTION_NOT_FOUND",
        message: "Skill option not found",
        skillOptionId: unknownSkillOptionId,
      },
    });
  });
});
