import type { Context } from "hono";

import type { ValidationErrorResponse } from "../../types/api-errors.js";

type ValidationIssue = {
  path: readonly PropertyKey[];
  code: string;
  message: string;
};

type ValidationErrorLike = {
  issues: readonly ValidationIssue[];
};

export function zodErrorResponse(c: Context, error: ValidationErrorLike) {
  const body: ValidationErrorResponse = {
    error: {
      code: "VALIDATION_ERROR",
      message: "Invalid request body",
      issues: error.issues.map((issue) => ({
        path: issue.path.map(String).join("."),
        code: issue.code,
        message: issue.message,
      })),
    },
  };

  return c.json(body, 400);
}
