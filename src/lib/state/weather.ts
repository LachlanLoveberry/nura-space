import { useQuery } from '@tanstack/react-query'
import { getWeather } from '#/lib/api/weather'
import { queryKeys } from '#/lib/query-keys'

export function useWeatherQuery(latitude: number, longitude: number) {
  return useQuery({
    queryKey: queryKeys.weather.current(latitude, longitude),
    queryFn: () => getWeather(latitude, longitude),
    enabled: Number.isFinite(latitude) && Number.isFinite(longitude),
    staleTime: 10 * 60 * 1000,
  })
}
