import type { CityPayload, UserStore, UserRecord } from './user-store'
import crypto from 'node:crypto'

export function createInMemoryUserStore(): UserStore {
  const usersById = new Map<string, UserRecord>()
  const usersByEmail = new Map<string, UserRecord>()

  return {
    async createUser(email: string, passwordHash: string) {
      const id = crypto.randomUUID()
      const user: UserRecord = { id, email, passwordHash, selectedCity: null }
      usersById.set(id, user)
      usersByEmail.set(email, user)
      return { id, email, selectedCity: null }
    },

    async findUserByEmail(email: string) {
      return usersByEmail.get(email) ?? null
    },

    async findUserById(id: string) {
      return usersById.get(id) ?? null
    },

    async updateUserCity(id: string, city: CityPayload) {
      const user = usersById.get(id)
      if (!user) return null
      user.selectedCity = city
      return { id: user.id, email: user.email, selectedCity: user.selectedCity }
    }
  }
}

let activeStore: UserStore = createInMemoryUserStore()

/** Returns the store handlers should use. Swap it in tests via `setUserStore`. */
export function getUserStore(): UserStore {
  return activeStore
}

/** Injection seam: override the active store (e.g. with a test double or DB-backed store). */
export function setUserStore(store: UserStore): void {
  activeStore = store
}
