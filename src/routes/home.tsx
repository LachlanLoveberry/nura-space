import { createRoute } from '@tanstack/react-router'
import { Route as RootRoute } from './__root'

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/home',
  component: HomePage,
})

function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_42%),linear-gradient(180deg,_#020617_0%,_#111827_100%)] px-4 py-10 text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center justify-center">
        <section className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-blue-950/30 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Weather home</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Your selected city and live weather will land here.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            The home route only becomes available once a user is signed in and a city has already been saved on the account.
          </p>
        </section>
      </div>
    </main>
  )
}
