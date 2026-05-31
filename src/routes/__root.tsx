import {
  HeadContent,
  Scripts,
  Link,
  createRootRouteWithContext,
  redirect,
  type ErrorComponentProps,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import { Toaster } from '#/components/ui/sonner'
import { Button } from '#/components/ui/button'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import { ensureCurrentUser, resolveRouteRedirect } from '#/lib/session'
import { getErrorMessage, isApiError } from '#/lib/errors'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ context, location }) => {
    const currentUser = await ensureCurrentUser(context.queryClient)
    const redirectTo = resolveRouteRedirect(location.pathname, currentUser)

    if (redirectTo) {
      throw redirect({ to: redirectTo })
    }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  errorComponent: RootErrorBoundary,
  shellComponent: RootDocument,
})

function RootErrorBoundary({ error, reset }: ErrorComponentProps) {
  const message = getErrorMessage(error, 'The application hit an unexpected error.')
  const apiStatus = isApiError(error) ? `${error.status} ${error.statusText}` : null

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.14),_transparent_40%),linear-gradient(180deg,_#f8fafc_0%,_#e2e8f0_100%)] px-4 py-10 text-slate-900">
      <section className="w-full max-w-2xl rounded-3xl border border-slate-200/80 bg-white p-8 shadow-2xl shadow-slate-300/40">
        <p className="text-sm uppercase tracking-[0.35em] text-sky-700">
          Something went wrong
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          We kept the app alive, but this screen failed to load.
        </h1>
        <p className="mt-4 max-w-prose text-base leading-7 text-slate-600">
          {message}
        </p>
        {apiStatus ? (
          <p className="mt-3 text-sm text-slate-500">
            API status: <span className="font-medium text-slate-700">{apiStatus}</span>
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button type="button" onClick={reset}>
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Go home</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster position="top-right" closeButton richColors />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
