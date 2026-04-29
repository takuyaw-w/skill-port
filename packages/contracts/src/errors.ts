export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "EMPLOYEE_NOT_FOUND"
  | "SKILL_OPTION_NOT_FOUND"
  | "SKILL_SHEET_NOT_FOUND_AFTER_SAVE";

export type ApiErrorResponse<TDetails extends Record<string, unknown> = Record<string, never>> = {
  error: {
    code: ApiErrorCode;
    message: string;
  } & TDetails;
};

export type ValidationErrorIssue = {
  path: string;
  code: string;
  message: string;
};

export type ValidationErrorResponse = ApiErrorResponse<{
  issues: ValidationErrorIssue[];
}>;
