import { defineEventHandler, readBody, createError } from 'h3'
import { LoginRequest, AuthResponse } from '#/server/schemas'
import { userStore } from '#/server/db'
import { verifyPassword, createToken } from '#/server/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = LoginRequest.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Invalid request', data: parsed.error.format() })
  }

  const { email, password } = parsed.data
  const userRec = userStore.findUserByEmail(email)
  if (!userRec) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: 'Invalid credentials' })
  }

  const ok = await verifyPassword(password, userRec.passwordHash)
  if (!ok) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: 'Invalid credentials' })
  }

  const user = { id: userRec.id, email: userRec.email, selectedCity: userRec.selectedCity }
  const token = createToken({ sub: user.id, email: user.email })
  return AuthResponse.parse({ token, user })
})
