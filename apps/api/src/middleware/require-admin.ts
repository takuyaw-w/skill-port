import type { Context, Next } from "hono";

import { auth } from "../auth/auth.js";
import { errorResponse } from "../shared/http/json-response.js";

export async function requireAdmin(c: Context, next: Next) {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return errorResponse(c, 401, "UNAUTHORIZED", "Unauthorized");
  }

  if (session.user.role !== "admin") {
    return errorResponse(c, 403, "FORBIDDEN", "Forbidden");
  }

  return next();
}
