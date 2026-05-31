import { createError, getCookie, getHeader, type H3Event } from 'h3'
import { verifyToken } from './auth'

export type AuthPayload = { userId: string; email: string }

export function requireAuth(event: H3Event): AuthPayload {
  const auth = getHeader(event, 'authorization') ?? ''
  const headerToken = auth.replace(/^Bearer\s+/i, '')
  const cookieToken = getCookie(event, 'auth_token') ?? ''
  const token = headerToken || cookieToken
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: 'Missing authorization token' })
  }

  const decoded = verifyToken(token)
  if (!decoded || !decoded.sub) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: 'Invalid or expired token' })
  }

  return {
    userId: String(decoded.sub),
    email: String(decoded.email ?? '')
  }
}
