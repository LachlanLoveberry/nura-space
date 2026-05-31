import { defineWebSocketHandler } from 'nitro'
import { verifyToken } from '#/server/auth'
import { subscribeToCityMessages } from '#/server/live-messages'

function getCookieValue(cookieHeader: string, name: string) {
  const cookies = cookieHeader.split(';')

  for (const cookie of cookies) {
    const [rawKey, ...rawValue] = cookie.trim().split('=')
    if (rawKey === name) {
      return rawValue.join('=')
    }
  }

  return ''
}

function getAuthToken(request: Request) {
  const cookieHeader = request.headers.get('cookie') ?? ''
  const token = getCookieValue(cookieHeader, 'auth_token')

  if (!token) {
    return null
  }

  const decoded = verifyToken(token)
  if (!decoded?.sub) {
    return null
  }

  return decoded
}

export default defineWebSocketHandler({
  upgrade(request) {
    const url = new URL(request.url)
    const city = url.searchParams.get('city')?.trim()
    if (!city) {
      throw new Response('Missing city query parameter', { status: 400 })
    }

    const token = getAuthToken(request)
    if (!token) {
      throw new Response('Unauthorized', { status: 401 })
    }

    return {
      context: {
        city,
        userId: token.sub,
        email: token.email,
      },
    }
  },
  open(peer) {
    const { city } = peer.context as {
      city: string
      unsubscribe?: () => void
    }

    const unsubscribe = subscribeToCityMessages(city, (payload) => {
      peer.send(payload)
    })

    ;(peer.context as {
      city: string
      unsubscribe?: () => void
    }).unsubscribe = unsubscribe
  },
  message(peer, message) {
    const text = message.text().trim()
    if (text === 'ping') {
      peer.send('pong')
      return
    }

    try {
      const data = message.json<{ type?: string }>()
      if (data?.type === 'ping') {
        peer.send('pong')
      }
    } catch {
      // Ignore malformed client messages. The server only needs to push notifications.
    }
  },
  close(peer) {
    const context = peer.context as {
      unsubscribe?: () => void
    }

    context.unsubscribe?.()
  },
})
