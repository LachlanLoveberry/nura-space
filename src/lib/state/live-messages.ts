import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import {
  LiveMessagePayload,
  normalizeCityKey,
  type LiveMessagePayloadType,
} from '#/lib/live-messages'

function getWebSocketUrl(city: string) {
  const isSecure = window.location.protocol === 'https:'
  const url = new URL('/api/live-messages', window.location.origin)
  url.protocol = isSecure ? 'wss:' : 'ws:'
  url.searchParams.set('city', city)
  return url.toString()
}

function toastFromPayload(payload: LiveMessagePayloadType) {
  const title = payload.title?.trim() || payload.city
  const description = payload.message.trim()
  const toastOptions = {
    id: payload.id,
    description,
  }

  switch (payload.severity) {
    case 'success':
      toast.success(title, toastOptions)
      return
    case 'warning':
      toast.warning(title, toastOptions)
      return
    case 'error':
      toast.error(title, toastOptions)
      return
    case 'info':
      toast.info(title, toastOptions)
      return
    default:
      toast(title, toastOptions)
  }
}

export function useLiveMessagesSocket(city: string | null) {
  const socketRef = useRef<WebSocket | null>(null)
  const cityKeyRef = useRef<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (!city) {
      if (socketRef.current) {
        socketRef.current.close(1000, 'No city selected')
        socketRef.current = null
      }
      cityKeyRef.current = null
      return
    }

    const nextCityKey = normalizeCityKey(city)
    if (cityKeyRef.current === nextCityKey && socketRef.current) {
      return
    }

    if (socketRef.current) {
      socketRef.current.close(1000, 'City changed')
      socketRef.current = null
    }

    cityKeyRef.current = nextCityKey
    const socket = new WebSocket(getWebSocketUrl(city))
    socketRef.current = socket
    // Tracks whether this socket was torn down by us (navigation, city change,
    // unmount) rather than failing on its own.
    let disposed = false

    socket.addEventListener('message', async (event) => {
      const raw = typeof event.data === 'string' ? event.data : await event.data.text()

      if (!raw) {
        return
      }

      if (raw === 'pong') {
        return
      }

      try {
        const parsed = LiveMessagePayload.parse(JSON.parse(raw))
        toastFromPayload(parsed)
      } catch {
        toast(raw, { description: `Live update for ${city}` })
      }
    })

    socket.addEventListener('error', () => {
      // Closing a still-CONNECTING socket (which happens when an effect tears
      // down during data-based navigation) makes the browser emit an `error`
      // event even though nothing actually failed. Only surface the outage for
      // the socket that is still the active one and wasn't torn down by us.
      if (disposed || socketRef.current !== socket) {
        return
      }
      toast.error('Live updates disconnected', {
        description: `The realtime channel for ${city} is unavailable right now.`,
      })
    })

    socket.addEventListener('close', () => {
      if (socketRef.current === socket) {
        socketRef.current = null
      }
    })

    return () => {
      disposed = true
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close(1000, 'Component unmounted')
      }
      if (socketRef.current === socket) {
        socketRef.current = null
      }
    }
  }, [city])
}
