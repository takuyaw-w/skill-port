import type { Context } from "hono";
import type { ZodError } from "zod";

export function zodErrorResponse(c: Context, error: ZodError) {
  return c.json({
    error: "Invalid request body",
    issues: error.issues.map(issue => ({
      path: issue.path.map(String).join("."),
      code: issue.code,
      message: issue.message,
    })),
  }, 400)
}
