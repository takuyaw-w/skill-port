// apps/api/tests/helpers/auth.ts

import { auth } from "../../src/auth/auth.js";
import { app } from "../../src/app.js";

type CreateTestUserInput = {
  email: string;
  password: string;
  name: string;
  role: "admin" | "employee";
};

export async function createTestUser(input: CreateTestUserInput) {
  return auth.api.createUser({
    body: {
      email: input.email,
      password: input.password,
      name: input.name,
      role: input.role,
    },
  });
}

export async function loginAndGetCookie(email: string, password: string) {
  const res = await app.request("/api/auth/sign-in/email", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Login failed: ${res.status} ${body}`);
  }

  const setCookie = res.headers.get("set-cookie");

  if (!setCookie) {
    throw new Error("Login succeeded but set-cookie header was missing");
  }

  return setCookie;
}
