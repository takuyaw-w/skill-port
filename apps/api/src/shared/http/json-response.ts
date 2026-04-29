import type { Context } from "hono";

type ErrorDetails = Record<string, unknown>;

export function jsonResponse<TBody>(c: Context, body: TBody) {
  return c.json(body);
}

export function createdResponse<TBody>(c: Context, body: TBody) {
  return c.json(body, 201);
}

export function errorResponse(
  c: Context,
  statusCode: 400 | 401 | 403 | 404 | 409 | 500,
  code: string,
  message: string,
  details?: ErrorDetails,
) {
  return c.json(
    {
      error: {
        code,
        message,
        ...details,
      },
    },
    statusCode,
  );
}
