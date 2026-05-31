type CacheEntry<T> = { value: T; expiresAt: number }

export interface ICache {
  get<T>(key: string): T | null
  set<T>(key: string, value: T, ttlMs?: number): void
  del(key: string): void
  clear(): void
}

export class SimpleCache implements ICache {
  private map = new Map<string, CacheEntry<any>>()

  constructor(private defaultTtlMs = 10 * 60 * 1000) {}

  get<T>(key: string): T | null {
    const entry = this.map.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
      this.map.delete(key)
      return null
    }
    return entry.value as T
  }

  set<T>(key: string, value: T, ttlMs?: number) {
    const ttl = ttlMs ?? this.defaultTtlMs
    this.map.set(key, { value, expiresAt: Date.now() + ttl })
  }

  del(key: string) {
    this.map.delete(key)
  }

  clear() {
    this.map.clear()
  }
}

export const globalCache = new SimpleCache()
