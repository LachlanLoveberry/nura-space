import { createRoute } from '@tanstack/react-router'
import { Route as RootRoute } from './__root'
import { LoginForm } from '#/components/login-form.tsx'

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/login',
  component: LoginPage,
})

function LoginPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.18),_transparent_42%),linear-gradient(180deg,_#0f172a_0%,_#111827_100%)] px-4 py-10 text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-orange-950/30 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.35em] text-orange-300">Welcome back</p>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Log in to resume your saved city and weather view.
            </h1>
            <p className="max-w-lg text-base leading-7 text-slate-300">
              The router checks your session before each destination so authenticated users skip the login flow automatically.
            </p>
          </section>
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-2 shadow-2xl shadow-slate-950/40 backdrop-blur">
            <LoginForm className="border-0 bg-transparent shadow-none" />
          </div>
        </div>
      </div>
    </main>
  )
}
