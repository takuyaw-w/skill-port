import type { Context, Next } from "hono";
import { auth } from "../auth/auth.js";
import type { AppVariables } from "../types/hono.js";

export async function requireEmployee(c: Context<{ Variables: AppVariables }>, next: Next) {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (session.user.role !== "employee") {
    return c.json({ error: "Forbidden" }, 403);
  }

  c.set("user", session.user);

  return next();
}
