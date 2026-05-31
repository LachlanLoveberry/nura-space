import { createError, defineEventHandler } from 'h3'
import { requireAuth } from '#/server/auth-middleware'
import { getUserStore } from '#/server/db'
import { UserPublic } from '#/lib/contracts'

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)
  const userRec = await getUserStore().findUserById(auth.userId)

  if (!userRec) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'User not found',
    })
  }

  return UserPublic.parse({
    id: userRec.id,
    email: userRec.email,
    selectedCity: userRec.selectedCity,
  })
})
