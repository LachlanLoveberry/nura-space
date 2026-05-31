import { createRoute } from '@tanstack/react-router'
import { Route as RootRoute } from './__root'

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/select-city',
  component: SelectCityPage,
})

function SelectCityPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.16),_transparent_42%),linear-gradient(180deg,_#07111f_0%,_#0f172a_100%)] px-4 py-10 text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl items-center justify-center">
        <section className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-emerald-950/30 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Step 2</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Pick a city to continue.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            This route only stays visible while the account is signed in and no city has been saved yet.
          </p>
        </section>
      </div>
    </main>
  )
}
