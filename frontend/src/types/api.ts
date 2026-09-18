/**
 * Centralized API error model for BidCraft.
 *
 * Every API call in the application rejects with an `ApiError` instead of a
 * raw Axios error, ensuring every consumer (component, hook, page) gets a
 * consistent, typed error with a user-facing message.
 */

/** Discriminated error codes mapped from HTTP status codes. */
export type ApiErrorCode =
  | "NETWORK_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "VALIDATION_ERROR"
  | "SERVER_ERROR"
  | "SERVICE_UNAVAILABLE"
  | "NOT_IMPLEMENTED"
  | "UNKNOWN"

/** Field-level validation error returned by Spring Boot. */
export interface ApiValidationError {
  field: string
  message: string
}

/**
 * Typed API error that replaces raw Axios errors throughout the app.
 * Contains both a technical `message` (for logging) and a `userMessage`
 * (for displaying in the UI).
 */
export class ApiError extends Error {
  public readonly status: number
  public readonly code: ApiErrorCode
  public readonly userMessage: string
  public readonly validationErrors?: ApiValidationError[]

  constructor(opts: {
    status: number
    code: ApiErrorCode
    message: string
    userMessage: string
    validationErrors?: ApiValidationError[]
  }) {
    super(opts.message)
    this.name = "ApiError"
    this.status = opts.status
    this.code = opts.code
    this.userMessage = opts.userMessage
    this.validationErrors = opts.validationErrors
  }
}

/** Default user-facing messages per error code. */
const USER_MESSAGES: Record<ApiErrorCode, string> = {
  NETWORK_ERROR: "Cannot connect to the server. Please check your connection.",
  UNAUTHORIZED: "Your session has expired. Please sign in again.",
  FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  CONFLICT: "This action conflicts with existing data.",
  VALIDATION_ERROR: "Please check your input and try again.",
  SERVER_ERROR: "Something went wrong on our end. Please try again later.",
  SERVICE_UNAVAILABLE: "This service is temporarily unavailable. Please try again later.",
  NOT_IMPLEMENTED: "This feature is not yet available.",
  UNKNOWN: "An unexpected error occurred.",
}

/** Maps an HTTP status code to a typed error code. */
function statusToCode(status: number): ApiErrorCode {
  switch (status) {
    case 400:
      return "VALIDATION_ERROR"
    case 401:
      return "UNAUTHORIZED"
    case 403:
      return "FORBIDDEN"
    case 404:
      return "NOT_FOUND"
    case 409:
      return "CONFLICT"
    case 500:
      return "SERVER_ERROR"
    case 503:
      return "SERVICE_UNAVAILABLE"
    default:
      if (status >= 400 && status < 500) return "VALIDATION_ERROR"
      if (status >= 500) return "SERVER_ERROR"
      return "UNKNOWN"
  }
}

/**
 * Converts any thrown value (Axios error, generic Error, string) into a
 * typed `ApiError`.  This is called in the Axios response interceptor so
 * every rejected promise carries an `ApiError`.
 */
export function parseApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  // Axios errors have a `response` property when the server replied
  const axiosError = error as {
    response?: {
      status: number
      data?: { message?: string; errors?: ApiValidationError[] }
    }
    request?: unknown
    message?: string
  }

  if (axiosError.response) {
    const status = axiosError.response.status
    const code = statusToCode(status)
    const serverMessage = axiosError.response.data?.message
    const validationErrors = axiosError.response.data?.errors

    return new ApiError({
      status,
      code,
      message: serverMessage || axiosError.message || `HTTP ${status}`,
      userMessage: serverMessage || USER_MESSAGES[code],
      validationErrors,
    })
  }

  // Request was made but no response was received (network error / timeout)
  if (axiosError.request) {
    return new ApiError({
      status: 0,
      code: "NETWORK_ERROR",
      message: axiosError.message || "Network error",
      userMessage: USER_MESSAGES.NETWORK_ERROR,
    })
  }

  // Fallback for non-Axios errors
  const msg = error instanceof Error ? error.message : String(error)
  return new ApiError({
    status: 0,
    code: "UNKNOWN",
    message: msg,
    userMessage: USER_MESSAGES.UNKNOWN,
  })
}

/**
 * Extracts a user-facing message from any error, including `ApiError`.
 * Useful in components that catch errors generically.
 */
export function getUserMessage(error: unknown): string {
  if (error instanceof ApiError) return error.userMessage
  if (error instanceof Error) return error.message
  return USER_MESSAGES.UNKNOWN
}

/** Generic paginated response matching Spring Boot conventions. */
export interface PaginatedResponse<T> {
  items: T[]
  totalElements: number
  page: number
  size: number
  totalPages: number
}
