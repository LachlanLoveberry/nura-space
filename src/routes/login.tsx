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
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  )
}
