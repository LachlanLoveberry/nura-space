import { createError, defineEventHandler, readBody, setCookie } from 'h3'
import { LoginRequest, AuthResponse } from '#/lib/contracts'
import { getUserStore } from '#/server/db'
import { verifyPassword, createToken } from '#/server/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = LoginRequest.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid request',
      data: parsed.error.format(),
    })
  }

  const { email, password } = parsed.data
  const userStore = getUserStore()
  const userRec = await userStore.findUserByEmail(email)
  if (!userRec) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Invalid credentials',
    })
  }

  const ok = await verifyPassword(password, userRec.passwordHash)
  if (!ok) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Invalid credentials',
    })
  }

  const user = {
    id: userRec.id,
    email: userRec.email,
    selectedCity: userRec.selectedCity,
  }
  const token = createToken({ sub: user.id, email: user.email })
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return AuthResponse.parse({ token, user })
})
