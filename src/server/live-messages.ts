import { randomUUID } from 'node:crypto'
import {
  LiveMessageInput,
  LiveMessagePayload,
  normalizeCityKey,
  type LiveMessageInputType,
  type LiveMessagePayloadType,
} from '#/lib/live-messages'

type Listener = (payload: LiveMessagePayloadType) => void

const RECENT_LIMIT = 10

/**
 * Owns per-city listener registries and recent-message history. Kept behind a
 * factory so the global instance below can be swapped for a real pub/sub
 * backend (e.g. Redis) without touching callers.
 */
export function createCityMessageHub() {
  const listenersByCity = new Map<string, Set<Listener>>()
  const recentMessagesByCity = new Map<string, LiveMessagePayloadType[]>()

  function getListenerSet(cityKey: string) {
    const existing = listenersByCity.get(cityKey)
    if (existing) {
      return existing
    }

    const created = new Set<Listener>()
    listenersByCity.set(cityKey, created)
    return created
  }

  function publish(input: LiveMessageInputType) {
    const parsed = LiveMessageInput.parse(input)
    const cityKey = normalizeCityKey(parsed.city)
    const payload = LiveMessagePayload.parse({
      id: randomUUID(),
      city: parsed.city,
      cityKey,
      title: parsed.title ?? parsed.city,
      message: parsed.message,
      severity: parsed.severity ?? 'info',
      createdAt: new Date().toISOString(),
    })

    const recentMessages = [...(recentMessagesByCity.get(cityKey) ?? []), payload].slice(-RECENT_LIMIT)
    recentMessagesByCity.set(cityKey, recentMessages)

    for (const listener of getListenerSet(cityKey)) {
      listener(payload)
    }

    return payload
  }

  function subscribe(city: string, listener: Listener) {
    const cityKey = normalizeCityKey(city)
    const listeners = getListenerSet(cityKey)
    listeners.add(listener)

    return () => {
      listeners.delete(listener)

      if (listeners.size === 0) {
        listenersByCity.delete(cityKey)
      }
    }
  }

  function recent(city: string, limit = RECENT_LIMIT) {
    const cityKey = normalizeCityKey(city)
    return (recentMessagesByCity.get(cityKey) ?? []).slice(-limit)
  }

  return { publish, subscribe, recent }
}

const hub = createCityMessageHub()

export function publishLiveMessage(input: LiveMessageInputType) {
  return hub.publish(input)
}

export function subscribeToCityMessages(city: string, listener: Listener) {
  return hub.subscribe(city, listener)
}

export function getRecentCityMessages(city: string, limit = RECENT_LIMIT) {
  return hub.recent(city, limit)
}
