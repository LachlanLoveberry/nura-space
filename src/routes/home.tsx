import { createRoute } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ChevronDown,
  Cloud,
  CloudRain,
  Droplets,
  RefreshCw,
  Thermometer,
} from 'lucide-react'
import { Route as RootRoute } from './__root'
import { Button } from '#/components/ui/button.tsx'
import { Card, CardContent } from '#/components/ui/card.tsx'
import { CityCombobox } from '#/components/city-combobox.tsx'
import { useLogoutMutation } from '#/lib/state/auth'
import { useWeatherQuery } from '#/lib/state/weather'
import { useLiveMessagesSocket } from '#/lib/state/live-messages'
import { currentUserQueryOptions } from '#/lib/session'
import { queryKeys } from '#/lib/query-keys'
import { describeWeatherCode } from '#/lib/weather-codes'
import { cn } from '#/lib/utils.ts'

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/home',
  component: HomePage,
})

function HomePage() {
  const queryClient = useQueryClient()
  const currentUser = useQuery(currentUserQueryOptions())
  const logoutMutation = useLogoutMutation()
  const city = currentUser.data?.selectedCity ?? null
  useLiveMessagesSocket(city?.name ?? null)
  const weatherQuery = useWeatherQuery(
    city?.latitude ?? Number.NaN,
    city?.longitude ?? Number.NaN
  )

  const weather = weatherQuery.data
  const summary =
    typeof weather?.weatherCode === 'number'
      ? describeWeatherCode(weather.weatherCode)
      : null

  function refreshWeather() {
    if (city) {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.weather.current(city.latitude, city.longitude),
      })
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-4 py-12">
      <div className="w-full max-w-3xl space-y-8">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Current weather
            </p>
            <CityCombobox
              placeholder="Search a city"
              triggerClassName="group inline-flex items-center gap-2 text-left"
              renderTrigger={({ isOpen }) => (
                <h1 className="display-title flex items-center gap-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  <span>{city?.name ?? 'Your city'}</span>
                  <ChevronDown
                    className={cn(
                      'size-7 shrink-0 text-muted-foreground transition-transform group-hover:text-foreground',
                      isOpen && 'rotate-180'
                    )}
                  />
                </h1>
              )}
            />
            <p className="text-sm text-muted-foreground">
              {city ? (
                <>
                  {summary ? `${summary} · ` : ''}
                  {city.latitude.toFixed(2)}, {city.longitude.toFixed(2)}
                </>
              ) : (
                'Choose a city to see its current conditions.'
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!city || weatherQuery.isFetching}
              onClick={refreshWeather}
            >
              <RefreshCw
                className={cn(weatherQuery.isFetching && 'animate-spin')}
              />
              Refresh
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={logoutMutation.isPending}
              onClick={() => logoutMutation.mutate()}
            >
              {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
            </Button>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <WeatherMetric
            icon={<Thermometer className="size-5" />}
            label="Temperature"
            loading={weatherQuery.isLoading}
            value={
              typeof weather?.temperature === 'number'
                ? `${Math.round(weather.temperature)}°C`
                : 'N/A'
            }
          />
          <WeatherMetric
            icon={<Droplets className="size-5" />}
            label="Humidity"
            loading={weatherQuery.isLoading}
            value={
              typeof weather?.humidity === 'number'
                ? `${Math.round(weather.humidity)}%`
                : 'N/A'
            }
          />
          <WeatherMetric
            icon={<Cloud className="size-5" />}
            label="Cloud cover"
            loading={weatherQuery.isLoading}
            value={
              typeof weather?.cloudCover === 'number'
                ? `${Math.round(weather.cloudCover)}%`
                : 'N/A'
            }
          />
          <WeatherMetric
            icon={<CloudRain className="size-5" />}
            label="Precipitation"
            loading={weatherQuery.isLoading}
            value={
              typeof weather?.precipitation === 'number'
                ? `${weather.precipitation.toFixed(1)} mm`
                : 'N/A'
            }
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            {weatherQuery.isError
              ? 'Weather unavailable'
              : weatherQuery.isFetching
                ? 'Refreshing…'
                : weather?.timestamp
                  ? `Last updated ${weather.timestamp}`
                  : 'Cached for up to 10 minutes'}
          </span>
          <span>Live alerts on for {city?.name ?? 'your city'}</span>
        </div>

        {weatherQuery.isError ? (
          <p className="text-sm text-destructive">
            {(weatherQuery.error as Error).message}
          </p>
        ) : null}
      </div>
    </main>
  )
}

function WeatherMetric({
  icon,
  label,
  value,
  loading,
}: {
  icon: React.ReactNode
  label: string
  value: string
  loading: boolean
}) {
  return (
    <Card className="gap-0 py-0">
      <CardContent className="flex items-center gap-4 px-5 py-5">
        <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </span>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight text-foreground">
            {loading ? '…' : value}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
