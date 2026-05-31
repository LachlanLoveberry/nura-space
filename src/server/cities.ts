import { GeocodingResponse, type GeocodingResultType } from './schemas'
import { globalCache, type ICache } from './cache'
import { defaultHttpClient, requestJson, type HttpClient } from './http-client'

const DEFAULT_GEOCODE_BASE = 'https://geocoding-api.open-meteo.com'

export async function searchCities(
  query: string,
  count = 10,
  cache: ICache = globalCache,
  httpClient: HttpClient = defaultHttpClient,
  baseUrl = DEFAULT_GEOCODE_BASE
): Promise<GeocodingResultType[]> {
  const key = `geocode:${query}:${count}`
  const cached = cache.get<GeocodingResultType[]>(key)
  if (cached) return cached

  const url = `${baseUrl}/v1/search?name=${encodeURIComponent(query)}&count=${count}&language=en&format=json`
  const json = await requestJson(httpClient, url)

  const parsed = GeocodingResponse.safeParse(json)
  if (!parsed.success) {
    throw new Error('Geocoding response did not match expected shape')
  }

  const results = parsed.data.results ?? []

  // cache for 24 hours
  cache.set(key, results, 24 * 60 * 60 * 1000)
  return results
}
