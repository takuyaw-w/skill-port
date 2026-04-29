import type { Context, Next } from "hono";

import { auth } from "../auth/auth.js";
import { errorResponse } from "../shared/http/json-response.js";
import type { AppVariables } from "../types/hono.js";

export async function requireAuth(c: Context<{ Variables: AppVariables }>, next: Next) {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return errorResponse(c, 401, "UNAUTHORIZED", "Unauthorized");
  }

  c.set("user", session.user);

  return next();
}
