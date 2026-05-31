import type { CityPayload, UserStore, UserRecord } from './user-store'
import crypto from 'node:crypto'

const usersById = new Map<string, UserRecord>()
const usersByEmail = new Map<string, UserRecord>()

export const userStore: UserStore = {
  async createUser(email: string, passwordHash: string) {
    const id = crypto.randomUUID()
    const user: UserRecord = { id, email, passwordHash, selectedCity: null }
    usersById.set(id, user)
    usersByEmail.set(email, user)
    return { id, email, selectedCity: null }
  },

  findUserByEmail(email: string) {
    return usersByEmail.get(email) ?? null
  },

  findUserById(id: string) {
    return usersById.get(id) ?? null
  },

  updateUserCity(id: string, city: CityPayload) {
    const user = usersById.get(id)
    if (!user) return null
    user.selectedCity = city
    return { id: user.id, email: user.email, selectedCity: user.selectedCity }
  }
}
