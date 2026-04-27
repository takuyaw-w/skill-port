import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app.js";
import { cleanupDatabase } from "./helpers/cleanup.js";
import { createTestUser, loginAndGetCookie } from "./helpers/auth.js";
import { uniqueEmail } from "./helpers/test-data.js";

describe("admin employees API", () => {
  beforeEach(async () => {
    await cleanupDatabase();
  })

  afterEach(async () => {
    await cleanupDatabase()
  })

  it('admin can create employee and receive invitationUrl', async () => {
    const adminEmail = uniqueEmail("admin")
    const adminPassword = "password123"

    await createTestUser({
      email: adminEmail,
      password: adminPassword,
      name: "Admin",
      role: "admin"
    })

    const cookie = await loginAndGetCookie(adminEmail, adminPassword)

    const res = await app.request("/api/admin/employees", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie
      },
      body: JSON.stringify({
        email: "employee@example.com",
        employeeCode: "EMP001",
        fullName: "Test Employee",
        displayName: "Employee"
      })
    })

    expect(res.status).toBe(201);
    const body = await res.json()

    expect(body.employee).toMatchObject({
      email: "employee@example.com",
      employeeCode: "EMP001",
      fullName: "Test Employee",
      displayName: "Employee",
      status: "pending_invitation",
    })

    expect(body.invitationUrl).toContain("/invitation/")
  });

  it("rejects invalid employee request body", async () => {
    const adminEmail = uniqueEmail("admin")
    const adminPassword = "password123"

    await createTestUser({
      email: adminEmail,
      password: adminPassword,
      name: "Admin",
      role: "admin"
    })

    const cookie = await loginAndGetCookie(adminEmail, adminPassword)

    const res = await app.request("/api/admin/employees", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie
      },
      body: JSON.stringify({
        email: "invalid-email",
        employeeCode: "EMP001",
        fullName: "Test Employee"
      }),
    });

    expect(res.status).toBe(400)

    const body = await res.json();

    expect(body.error).toBe("Invalid request body");
    expect(body.issues.length).toBeGreaterThan(0)
  })

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
})
