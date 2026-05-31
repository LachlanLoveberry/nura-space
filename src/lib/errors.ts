export type ApiErrorDetails = {
  path: string
  status: number
  statusText: string
  payload?: {
    message?: string
    error?: string
  } | null
}

export class ApiError extends Error {
  readonly path: string
  readonly status: number
  readonly statusText: string
  readonly payload?: ApiErrorDetails['payload']

  constructor(message: string, details: ApiErrorDetails) {
    super(message)
    this.name = 'ApiError'
    this.path = details.path
    this.status = details.status
    this.statusText = details.statusText
    this.payload = details.payload
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong.') {
  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  if (typeof error === 'string' && error.trim()) {
    return error
  }

  return fallback
}

export function isExpectedAuthError(error: unknown) {
  return isApiError(error) && (error.status === 401 || error.status === 403 || error.status === 404)
}
