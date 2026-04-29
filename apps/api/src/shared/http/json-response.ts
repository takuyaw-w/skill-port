import type { Context } from "hono";

import type { ApiErrorCode, ApiErrorResponse } from "../../types/api-errors.js";

type ErrorDetails = Record<string, unknown>;

export function jsonResponse<TBody>(c: Context, body: TBody) {
  return c.json(body);
}

export function createdResponse<TBody>(c: Context, body: TBody) {
  return c.json(body, 201);
}

export function errorResponse<TDetails extends ErrorDetails>(
  c: Context,
  statusCode: 400 | 401 | 403 | 404 | 409 | 500,
  code: ApiErrorCode,
  message: string,
  details?: TDetails,
) {
  const body: ApiErrorResponse<TDetails> = {
    error: {
      code,
      message,
      ...(details ?? ({} as TDetails)),
    },
  };

  return c.json(body, statusCode);
}
