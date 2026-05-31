import type { UserPublicType } from '#/lib/contracts'

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
  findUserByEmail(email: string): Promise<UserRecord | null>
  findUserById(id: string): Promise<UserRecord | null>
  updateUserCity(id: string, city: CityPayload): Promise<UserPublicType | null>
}
