import { AuthResponse, type UserPublicType } from '#/lib/contracts'
import { apiGetJson, apiSendJson } from '#/lib/api-client'
import type { LoginFormValues, SignupFormValues } from '#/lib/auth-schemas'
import { getErrorMessage, isApiError, isExpectedAuthError } from '#/lib/errors'
import { createDebugLogger } from '#/lib/debug'

const debugAuth = createDebugLogger('api-auth')

export async function login(input: LoginFormValues) {
  const response = await apiSendJson<{ token: string; user: UserPublicType }, LoginFormValues>(
    '/api/auth/login',
    'POST',
    input
  )
  return AuthResponse.parse(response)
}

export async function signup(input: SignupFormValues) {
  const response = await apiSendJson<
    { token: string; user: UserPublicType },
    Pick<SignupFormValues, 'email' | 'password'>
  >(
    '/api/auth/signup',
    'POST',
    {
      email: input.email,
      password: input.password,
    }
  )
  return AuthResponse.parse(response)
}

export async function currentUser(): Promise<UserPublicType | null> {
  debugAuth('current-user-request', {
    runtime: typeof window === 'undefined' ? 'server' : 'client',
  })

  try {
    const user = await apiGetJson<UserPublicType>('/api/auth/me')
    debugAuth('current-user-response-ok', { hasCity: Boolean(user.selectedCity) })
    return user
  } catch (error) {
    debugAuth('current-user-response-error', {
      status: isApiError(error) ? error.status : undefined,
      message: getErrorMessage(error),
    })

    if (isExpectedAuthError(error)) {
      return null
    }

    throw error
  }
}

export async function logout() {
  return apiSendJson<{ ok: true }, never>('/api/auth/logout', 'POST')
}
