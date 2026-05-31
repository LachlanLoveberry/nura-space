import { createError, defineEventHandler, getHeader, readBody, type H3Event } from 'h3'
import { LiveMessageInput } from '#/lib/live-messages'
import { publishLiveMessage } from '#/server/live-messages'

function getPushSecret() {
  return process.env.LIVE_MESSAGE_SECRET ?? 'dev-live-message-secret'
}

function getProvidedSecret(event: H3Event) {
  const headerSecret =
    getHeader(event, 'x-live-message-secret') ??
    getHeader(event, 'authorization')?.replace(/^Bearer\s+/i, '') ??
    ''

  return headerSecret.trim()
}

export default defineEventHandler(async (event) => {
  const expectedSecret = getPushSecret()
  const providedSecret = getProvidedSecret(event)

  if (!providedSecret || providedSecret !== expectedSecret) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Missing or invalid live message secret',
    })
  }

  const body = await readBody(event)
  const parsed = LiveMessageInput.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid live message payload',
      data: parsed.error.format(),
    })
  }

  return publishLiveMessage(parsed.data)
})
