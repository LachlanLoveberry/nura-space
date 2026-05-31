import type { UserPublicType } from './schemas'

export type CityPayload = {
  name: string
  latitude: number
  longitude: number
}

export type UserRecord = {
  id: string
  email: string
  passwordHash: string
  selectedCity: UserPublicType['selectedCity']
}

export interface UserStore {
  createUser(email: string, passwordHash: string): Promise<UserPublicType>
  findUserByEmail(email: string): UserRecord | null
  findUserById(id: string): UserRecord | null
  updateUserCity(id: string, city: CityPayload): UserPublicType | null
}
