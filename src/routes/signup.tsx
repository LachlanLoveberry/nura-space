import { createRoute } from '@tanstack/react-router'
import { Route as RootRoute } from './__root'
import { SignupForm } from '#/components/signup-form.tsx'

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/signup',
  component: SignupPage,
})

function SignupPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_42%),linear-gradient(180deg,_#08131f_0%,_#0b1220_100%)] px-4 py-10 text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-sky-950/30 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Nura Space</p>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Create your account and unlock the weather dashboard.
            </h1>
            <p className="max-w-lg text-base leading-7 text-slate-300">
              Sign up once, choose your city, and the router will keep you on the right page as your session changes.
            </p>
          </section>
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-2 shadow-2xl shadow-slate-950/40 backdrop-blur">
            <SignupForm className="border-0 bg-transparent shadow-none" />
          </div>
        </div>
      </div>
    </main>
  )
}
