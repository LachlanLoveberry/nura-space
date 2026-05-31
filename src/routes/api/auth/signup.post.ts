import { defineEventHandler, readBody, createError } from 'h3'
import { SignupRequest, AuthResponse } from '#/server/schemas'
import { userStore } from '#/server/db'
import { hashPassword, createToken } from '#/server/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = SignupRequest.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Invalid request', data: parsed.error.format() })
  }

  const { email, password } = parsed.data
  const existing = userStore.findUserByEmail(email)
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Conflict', message: 'User already exists' })
  }

  const passwordHash = await hashPassword(password)
  const user = await userStore.createUser(email, passwordHash)
  const token = createToken({ sub: user.id, email: user.email })

  return AuthResponse.parse({ token, user })
})
