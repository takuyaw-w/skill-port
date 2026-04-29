export type ApiHttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiQueryValue = string | number | boolean | null | undefined;

export type ApiRequestOptions = {
  method?: ApiHttpMethod;
  query?: Record<string, ApiQueryValue>;
  body?: unknown;
};

export type ApiFetcher = <TResponse>(
  path: string,
  options?: ApiRequestOptions,
) => Promise<TResponse>;
