import { defineEventHandler, readBody, createError } from 'h3'
import { requireAuth } from '#/server/auth-middleware'
import { userStore } from '#/server/db'
import { z } from 'zod'

const CitySchema = z.object({ name: z.string(), latitude: z.number(), longitude: z.number() })

export default defineEventHandler(async (event) => {
  const auth = requireAuth(event)

  const body = await readBody(event)
  const parsed = CitySchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'Invalid city payload', data: parsed.error.format() })
  }

  const updated = userStore.updateUserCity(auth.userId, parsed.data)
  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: 'User not found' })
  }

  return updated
})
