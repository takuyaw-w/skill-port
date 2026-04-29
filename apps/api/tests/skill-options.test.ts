import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { app } from "../src/app.js";
import { db } from "../src/db/client.js";
import { skillOptions } from "../src/db/schema.js";
import { cleanupDatabase } from "./helpers/cleanup.js";
import { createTestUser, loginAndGetCookie } from "./helpers/auth.js";
import { uniqueEmail } from "./helpers/test-data.js";

async function createLoggedInUser(role: "admin" | "employee") {
  const email = uniqueEmail(role);
  const password = "password123";

  await createTestUser({
    email,
    password,
    name: role,
    role,
  });

  const cookie = await loginAndGetCookie(email, password);

  return {
    email,
    cookie,
  };
}

async function seedSkillOptions() {
  await db.insert(skillOptions).values([
    {
      category: "language",
      name: "TypeScript",
      normalizedName: "typescript",
      sortOrder: 10,
      isActive: true,
    },
    {
      category: "language",
      name: "JavaScript",
      normalizedName: "javascript",
      sortOrder: 20,
      isActive: true,
    },
    {
      category: "framework",
      name: "Vue.js",
      normalizedName: "vue",
      sortOrder: 10,
      isActive: true,
    },
    {
      category: "framework",
      name: "Deprecated Framework",
      normalizedName: "deprecated_framework",
      sortOrder: 99,
      isActive: false,
    },
  ]);
}

describe("skill options API", () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  it("rejects unauthenticated request", async () => {
    const res = await app.request("/api/skill-options", {
      method: "GET",
    });

    expect(res.status).toBe(401);

    const body = await res.json();

    expect(body).toEqual({
      error: "Unauthorized",
    });
  });

  it("employee can list active skill options", async () => {
    await seedSkillOptions();

    const { cookie } = await createLoggedInUser("employee");

    const res = await app.request("/api/skill-options", {
      method: "GET",
      headers: {
        cookie,
      },
    });

    expect(res.status).toBe(200);

    const body = await res.json();

    expect(body.status).toBe("ok");
    expect(body.skillOptions).toHaveLength(3);
    expect(body.skillOptions.map((option: { name: string }) => option.name)).toEqual([
      "Vue.js",
      "TypeScript",
      "JavaScript",
    ]);
  });

  it("admin can list active skill options", async () => {
    await seedSkillOptions();

    const { cookie } = await createLoggedInUser("admin");

    const res = await app.request("/api/skill-options", {
      method: "GET",
      headers: {
        cookie,
      },
    });

    expect(res.status).toBe(200);

    const body = await res.json();

    expect(body.status).toBe("ok");
    expect(body.skillOptions).toHaveLength(3);
  });

  it("filters skill options by category", async () => {
    await seedSkillOptions();

    const { cookie } = await createLoggedInUser("employee");

    const res = await app.request("/api/skill-options?category=framework", {
      method: "GET",
      headers: {
        cookie,
      },
    });

    expect(res.status).toBe(200);

    const body = await res.json();

    expect(body.skillOptions).toHaveLength(1);
    expect(body.skillOptions[0]).toMatchObject({
      category: "framework",
      name: "Vue.js",
      normalizedName: "vue",
    });
  });

  it("can include inactive skill options", async () => {
    await seedSkillOptions();

    const { cookie } = await createLoggedInUser("employee");

    const res = await app.request("/api/skill-options?activeOnly=false", {
      method: "GET",
      headers: {
        cookie,
      },
    });

    expect(res.status).toBe(200);

    const body = await res.json();

    expect(body.skillOptions).toHaveLength(4);
    expect(body.skillOptions.some((option: { isActive: boolean }) => !option.isActive)).toBe(true);
  });

  it("filters skill options by keyword", async () => {
    await seedSkillOptions();

    const { cookie } = await createLoggedInUser("employee");

    const res = await app.request("/api/skill-options?q=Type", {
      method: "GET",
      headers: {
        cookie,
      },
    });

    expect(res.status).toBe(200);

    const body = await res.json();

    expect(body.skillOptions).toHaveLength(1);
    expect(body.skillOptions[0]).toMatchObject({
      name: "TypeScript",
      normalizedName: "typescript",
    });
  });
});
