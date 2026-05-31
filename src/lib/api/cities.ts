import { GeocodingResponse, type GeocodingResultType } from '#/lib/contracts'
import { apiGetJson } from '#/lib/api-client'

type CitiesSearchResponse = {
  results: GeocodingResultType[]
}

export async function searchCities(query: string) {
  const response = await apiGetJson<CitiesSearchResponse>(
    `/api/cities-search?q=${encodeURIComponent(query)}`
  )
  const parsed = GeocodingResponse.parse(response)
  return parsed.results ?? []
}
