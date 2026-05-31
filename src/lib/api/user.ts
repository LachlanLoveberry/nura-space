import { UserPublic, type UserPublicType } from '#/server/schemas'
import { apiSendJson } from '#/lib/api-client'

export type CityPayload = {
  name: string
  latitude: number
  longitude: number
}

export async function updateSelectedCity(city: CityPayload) {
  const response = await apiSendJson<UserPublicType, CityPayload>(
    '/api/user/selected-city',
    'PUT',
    city
  )
  return UserPublic.parse(response)
}
