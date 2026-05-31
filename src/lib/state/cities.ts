import { useQuery } from '@tanstack/react-query'
import { searchCities } from '#/lib/api/cities'
import { queryKeys } from '#/lib/query-keys'

export function useCitySearchQuery(query: string) {
  return useQuery({
    queryKey: queryKeys.cities.search(query),
    queryFn: () => searchCities(query),
    enabled: query.trim().length >= 2,
    staleTime: 24 * 60 * 60 * 1000,
  })
}
