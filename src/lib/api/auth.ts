import { AuthResponse, type UserPublicType } from '#/server/schemas'
import { apiGetJson, apiSendJson } from '#/lib/api-client'
import type { LoginFormValues, SignupFormValues } from '#/lib/auth-schemas'

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

export async function currentUser() {
  return apiGetJson<UserPublicType>('/api/auth/me')
}

export async function logout() {
  return apiSendJson<{ ok: true }, never>('/api/auth/logout', 'POST')
}
