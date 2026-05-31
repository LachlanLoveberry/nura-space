import { useDeferredValue, useState } from 'react'
import { createRoute } from '@tanstack/react-router'
import { Route as RootRoute } from './__root'
import { useCitySearchQuery } from '#/lib/state/cities'
import { useSelectedCityMutation } from '#/lib/state/user'
import { Input } from '#/components/ui/input.tsx'
import { cn } from '#/lib/utils.ts'

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/select-city',
  component: SelectCityPage,
})

function SelectCityPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const deferredSearchTerm = useDeferredValue(searchTerm)
  const citySearch = useCitySearchQuery(deferredSearchTerm)
  const saveCityMutation = useSelectedCityMutation()

  const results = citySearch.data ?? []

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.16),_transparent_42%),linear-gradient(180deg,_#07111f_0%,_#0f172a_100%)] px-4 py-10 text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <section className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-emerald-950/30 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Step 2</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-5">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Pick a city to continue.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300">
                Search for a city, then select one of the suggestions to save it to your account. The router will
                re-check your session and move you to the dashboard automatically.
              </p>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-200" htmlFor="city-search">
                  Search cities
                </label>
                <Input
                  id="city-search"
                  type="search"
                  value={searchTerm}
                  placeholder="Type at least 2 letters"
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
                <p className="text-sm text-slate-400">
                  {citySearch.isFetching
                    ? 'Searching the geocoding service...'
                    : deferredSearchTerm.trim().length >= 2
                      ? `${results.length} result${results.length === 1 ? '' : 's'}`
                      : 'Start typing to search.'}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
              {results.length ? (
                <div className="grid gap-3">
                  {results.map((city) => {
                    const busy =
                      saveCityMutation.isPending &&
                      saveCityMutation.variables?.latitude === city.latitude &&
                      saveCityMutation.variables?.longitude === city.longitude

                    return (
                      <button
                        key={`${city.name}-${city.latitude}-${city.longitude}`}
                        type="button"
                        onClick={() =>
                          saveCityMutation.mutate({
                            name: city.name,
                            latitude: city.latitude,
                            longitude: city.longitude,
                          })
                        }
                        className={cn(
                          'flex w-full items-start justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-sky-300/60 hover:bg-white/10',
                          busy && 'border-sky-300/70 bg-sky-400/10'
                        )}
                      >
                        <div>
                          <p className="text-lg font-semibold text-white">{city.name}</p>
                          <p className="mt-1 text-sm text-slate-400">
                            {city.country ?? 'Unknown country'} · {city.latitude.toFixed(2)}, {city.longitude.toFixed(2)}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-sky-300">
                          {busy ? 'Saving...' : 'Select'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 text-center">
                  <div className="max-w-sm space-y-2">
                    <p className="text-lg font-medium text-white">No city selected yet</p>
                    <p className="text-sm leading-6 text-slate-400">
                      Search for a location above. Matching results will appear here.
                    </p>
                  </div>
                </div>
              )}
              {saveCityMutation.isError ? (
                <p className="mt-3 text-sm text-red-400">
                  {(saveCityMutation.error as Error).message}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
