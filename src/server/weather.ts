import { OpenMeteoForecast, type NormalizedWeatherType } from './schemas'
import { normalizeWeather } from './normalizer'
import { defaultHttpClient, requestJson, type HttpClient } from './http-client'
import { globalCache, type ICache } from './cache'

const DEFAULT_BASE = process.env.OPEN_METEO_BASE_URL || 'https://api.open-meteo.com'

export async function fetchWeather(
  latitude: number,
  longitude: number,
  cache: ICache = globalCache,
  httpClient: HttpClient = defaultHttpClient,
  baseUrl = DEFAULT_BASE
): Promise<NormalizedWeatherType> {
  const key = `weather:${latitude.toFixed(4)},${longitude.toFixed(4)}`
  const cached = cache.get<NormalizedWeatherType>(key)
  if (cached) return cached

  const url = `${baseUrl}/v1/forecast?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}&current=temperature_2m,weather_code,cloud_cover,relative_humidity_2m,precipitation&timezone=auto`
  const json = await requestJson(httpClient, url)

  const parsed = OpenMeteoForecast.safeParse(json)
  if (!parsed.success) {
    throw new Error('Open-Meteo forecast response did not match expected shape')
  }

  const normalized = normalizeWeather(parsed.data)
  cache.set(key, normalized, 10 * 60 * 1000)
  return normalized
}
