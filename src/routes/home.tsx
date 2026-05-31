import { createRoute } from '@tanstack/react-router'
import { Route as RootRoute } from './__root'
import { Button } from '#/components/ui/button.tsx'
import { useLogoutMutation } from '#/lib/state/auth'
import { useWeatherQuery } from '#/lib/state/weather'
import { currentUserQueryOptions } from '#/lib/session'
import { useQuery } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '#/lib/query-keys'
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
  const weatherQuery = useWeatherQuery(
    city?.latitude ?? Number.NaN,
    city?.longitude ?? Number.NaN
  )

  const weather = weatherQuery.data

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_42%),linear-gradient(180deg,_#020617_0%,_#111827_100%)] px-4 py-10 text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center justify-center">
        <section className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-blue-950/30 backdrop-blur">
          <div className="flex flex-col gap-6 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Weather home</p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {city?.name ?? 'Your city'} at a glance
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300">
                Current weather for your selected city, kept in sync with the shared session state.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (city) {
                    void queryClient.invalidateQueries({
                      queryKey: queryKeys.weather.current(
                        city.latitude,
                        city.longitude
                      ),
                    })
                  }
                }}
              >
                Refresh data
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={logoutMutation.isPending}
                onClick={() => {
                  logoutMutation.mutate()
                }}
              >
                {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <WeatherMetric
              label="Temperature"
              value={
                weatherQuery.isLoading
                  ? 'Loading...'
                  : typeof weather?.temperature === 'number'
                    ? `${Math.round(weather.temperature)}°C`
                    : 'N/A'
              }
              tone="from-sky-500/25 to-cyan-400/10"
            />
            <WeatherMetric
              label="Humidity"
              value={
                weatherQuery.isLoading
                  ? 'Loading...'
                  : typeof weather?.humidity === 'number'
                    ? `${Math.round(weather.humidity)}%`
                    : 'N/A'
              }
              tone="from-emerald-500/25 to-teal-400/10"
            />
            <WeatherMetric
              label="Cloud cover"
              value={
                weatherQuery.isLoading
                  ? 'Loading...'
                  : typeof weather?.cloudCover === 'number'
                    ? `${Math.round(weather.cloudCover)}%`
                    : 'N/A'
              }
              tone="from-indigo-500/25 to-violet-400/10"
            />
            <WeatherMetric
              label="Precipitation"
              value={
                weatherQuery.isLoading
                  ? 'Loading...'
                  : typeof weather?.precipitation === 'number'
                    ? `${weather.precipitation.toFixed(1)} mm`
                    : 'N/A'
              }
              tone="from-amber-500/25 to-orange-400/10"
            />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Selected city</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {city?.name ?? 'No city'}
                  </h2>
                </div>
                <div className="text-right text-sm text-slate-400">
                  {city ? (
                    <>
                      <p>{city.latitude.toFixed(2)}, {city.longitude.toFixed(2)}</p>
                      <p className="mt-1">Weather updated with the latest cached reading</p>
                    </>
                  ) : (
                    <p>No city assigned yet.</p>
                  )}
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoCard label="Weather code" value={weather?.weatherCode?.toString() ?? 'N/A'} />
                <InfoCard label="Last updated" value={weather?.timestamp ?? 'N/A'} />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Status</p>
              <div className="mt-4 space-y-4 text-sm leading-6 text-slate-300">
                <p>
                  Session:{' '}
                  <span className="font-medium text-white">
                    {currentUser.isLoading ? 'Loading' : currentUser.data ? 'Signed in' : 'Missing'}
                  </span>
                </p>
                <p>
                  Weather data:{' '}
                  <span className="font-medium text-white">
                    {weatherQuery.isFetching ? 'Refreshing' : weatherQuery.isError ? 'Error' : 'Ready'}
                  </span>
                </p>
                <p>
                  Cached response:{' '}
                  <span className="font-medium text-white">10 minutes</span>
                </p>
              </div>
            </div>
          </div>

          {weatherQuery.isError ? (
            <p className="mt-6 text-sm text-red-400">
              {(weatherQuery.error as Error).message}
            </p>
          ) : null}
        </section>
      </div>
    </main>
  )
}

function WeatherMetric({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: string
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-gradient-to-br p-5 shadow-lg',
        tone
      )}
    >
      <p className="text-sm uppercase tracking-[0.3em] text-slate-300">{label}</p>
      <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm uppercase tracking-[0.25em] text-slate-400">{label}</p>
      <p className="mt-3 text-lg font-medium text-white">{value}</p>
    </div>
  )
}
