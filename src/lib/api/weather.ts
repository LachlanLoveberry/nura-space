import { NormalizedWeather, type NormalizedWeatherType } from '#/lib/contracts'
import { apiGetJson } from '#/lib/api-client'

export async function getWeather(latitude: number, longitude: number) {
  const response = await apiGetJson<NormalizedWeatherType>(
    `/api/weather?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`
  )
  return NormalizedWeather.parse(response)
}
