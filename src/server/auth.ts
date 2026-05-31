import bcrypt from 'bcrypt'
import jwt, { type JwtPayload } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const JWT_EXPIRES_IN = '7d'

export type TokenPayload = JwtPayload & {
  sub: string
  email: string
}

export async function hashPassword(password: string) {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function createToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { complete: false })
    if (typeof decoded !== 'object' || decoded === null) {
      return null
    }

    const sub = decoded.sub
    const email = decoded.email
    if (typeof sub !== 'string' || typeof email !== 'string') {
      return null
    }

    return { ...decoded, sub, email }
  } catch {
    return null
  }
}
