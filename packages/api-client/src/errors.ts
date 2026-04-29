import type { ApiErrorCode, ApiErrorResponse } from "@skill-port/contracts";

export class ApiClientError extends Error {
  readonly name = "ApiClientError";

  readonly statusCode: number;
  readonly code: ApiErrorCode | "UNKNOWN_ERROR";
  readonly response?: ApiErrorResponse;

  constructor(params: {
    statusCode: number;
    code: ApiErrorCode | "UNKNOWN_ERROR";
    message: string;
    response?: ApiErrorResponse;
  }) {
    super(params.message);

    this.statusCode = params.statusCode;
    this.code = params.code;
    this.response = params.response;
  }
}

export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const maybeResponse = value as {
    error?: {
      code?: unknown;
      message?: unknown;
    };
  };

  return (
    typeof maybeResponse.error === "object" &&
    maybeResponse.error !== null &&
    typeof maybeResponse.error.code === "string" &&
    typeof maybeResponse.error.message === "string"
  );
}
