import { NormalizedWeather, type NormalizedWeatherType } from '#/lib/contracts'
import { type OpenMeteoForecastType } from './schemas'

export function normalizeWeather(data: OpenMeteoForecastType): NormalizedWeatherType {
  const current = data.current ?? {}
  return NormalizedWeather.parse({
    latitude: data.latitude,
    longitude: data.longitude,
    temperature: current.temperature_2m,
    weatherCode: current.weather_code,
    cloudCover: current.cloud_cover,
    humidity: current.relative_humidity_2m,
    precipitation: current.precipitation,
    timestamp: current.time
  })
}
