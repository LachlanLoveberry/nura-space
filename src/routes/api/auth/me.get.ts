import { createError, defineEventHandler } from 'h3'
import { requireAuth } from '#/server/auth-middleware'
import { userStore } from '#/server/db'
import { UserPublic } from '#/server/schemas'

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const userRec = userStore.findUserById(auth.userId)

  if (!userRec) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'User not found' })
  }

  return UserPublic.parse({
    id: userRec.id,
    email: userRec.email,
    selectedCity: userRec.selectedCity,
  })
})
