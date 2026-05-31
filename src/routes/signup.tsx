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
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </main>
  )
}
