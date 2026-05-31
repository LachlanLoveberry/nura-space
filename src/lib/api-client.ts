type JsonPrimitive = string | number | boolean | null
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }

type ApiErrorPayload = {
  message?: string
  error?: string
}

function getApiOrigin() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }

  if (typeof process !== 'undefined' && process.env.APP_ORIGIN) {
    return process.env.APP_ORIGIN
  }

  return 'http://localhost:3000'
}

export async function apiGetJson<T>(path: string): Promise<T> {
  const response = await fetch(new URL(path, getApiOrigin()), {
    credentials: 'include',
  })

  if (!response.ok) {
    throw await toApiError(response)
  }

  return response.json() as Promise<T>
}

export async function apiSendJson<TResponse, TBody extends JsonValue>(
  path: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  body?: TBody
): Promise<TResponse> {
  const response = await fetch(new URL(path, getApiOrigin()), {
    method,
    credentials: 'include',
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    throw await toApiError(response)
  }

  return response.json() as Promise<TResponse>
}

async function toApiError(response: Response) {
  let payload: ApiErrorPayload | null = null

  try {
    payload = (await response.json()) as ApiErrorPayload
  } catch {
    payload = null
  }

  return new Error(payload?.message ?? payload?.error ?? response.statusText)
}
