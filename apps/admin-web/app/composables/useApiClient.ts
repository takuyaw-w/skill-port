import { ApiClientError, createApiClient, isApiErrorResponse } from '@skill-port/api-client'

export function useApiClient() {
  const config = useRuntimeConfig()

  return createApiClient(async (path, options) => {
    try {
      return await $fetch(path, {
        baseURL: config.public.apiDatabaseUrl,
        method: options?.method,
        query: options?.query,
        body: options?.body,
        credentials: "include"
      })
    } catch (error) {
      const fetchError = error as {
        statusCode?: number;
        status?: number;
        data?: unknown,
        message?: string;
      }

      const statusCode = fetchError.statusCode ?? fetchError.status ?? 500;

      if (isApiErrorResponse(fetchError.data)) {
        throw new ApiClientError({
          statusCode,
          code: fetchError.data.error.code,
          message: fetchError.data.error.message,
          response: fetchError.data
        })
      }

      throw new ApiClientError({
        statusCode,
        code: "UNKNOWN_ERROR",
        message: fetchError.message ?? "Unknown API client error",
      })
    }
  })
}
