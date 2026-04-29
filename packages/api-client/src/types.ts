export type ApiHttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiQueryValue = string | number | boolean | null | undefined;

export type ApiRequestBody =
  | Record<string, unknown>
  | unknown[]
  | BodyInit
  | null;

export type ApiRequestOptions = {
  method?: ApiHttpMethod;
  query?: Record<string, ApiQueryValue>;
  body?: ApiRequestBody;
};

export type ApiFetcher = <TResponse>(
  path: string,
  options?: ApiRequestOptions,
) => Promise<TResponse>;
