import { createMiddleware, createServerFn } from '@tanstack/react-start'
import { queryOptions } from '@tanstack/react-query'
import { UserPublic, type UserPublicType } from '#/server/schemas'

function getAppOrigin() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }

  if (typeof process !== 'undefined' && process.env.APP_ORIGIN) {
    return process.env.APP_ORIGIN
  }

  return 'http://localhost:3000'
}

function getCookieValue(cookieHeader: string, name: string) {
  const cookies = cookieHeader.split(';')
  for (const cookie of cookies) {
    const [rawKey, ...rawValue] = cookie.trim().split('=')
    if (rawKey === name) {
      return rawValue.join('=')
    }
  }

  return ''
}

const authRequestMiddleware = createMiddleware({ type: 'request' }).server(
  ({ request, next }) => {
    return next({
      context: {
        cookieHeader: request.headers.get('cookie') ?? '',
      },
    })
  }
)

const currentUserServerFn = createServerFn({ method: 'GET' })
  .middleware([authRequestMiddleware])
  .handler(async ({ context }) => {
    const token = getCookieValue(context.cookieHeader ?? '', 'auth_token')
    if (!token) {
      return null
    }

    const response = await fetch(new URL('/api/auth/me', getAppOrigin()), {
      headers: {
        cookie: context.cookieHeader ?? '',
      },
    })

    if (response.status === 401) {
      return null
    }

    if (!response.ok) {
      throw new Error('Failed to load the current user')
    }

    const json = await response.json()
    return UserPublic.parse(json)
  })

export function getHomePath(user: Pick<UserPublicType, 'selectedCity'>) {
  return user.selectedCity ? '/home' : '/select-city'
}

export function resolveRouteRedirect(
  pathname: string,
  user: UserPublicType | null
) {
  if (!user) {
    return pathname === '/signup' ? null : '/signup'
  }

  if (pathname === '/signup' || pathname === '/login') {
    return getHomePath(user)
  }

  if (!user.selectedCity && pathname !== '/select-city') {
    return '/select-city'
  }

  if (user.selectedCity && pathname === '/select-city') {
    return getHomePath(user)
  }

  if (pathname === '/') {
    return getHomePath(user)
  }

  return null
}

export const currentUserQueryOptions = () =>
  queryOptions({
    queryKey: ['auth', 'current-user'],
    queryFn: () => currentUserServerFn(),
    staleTime: 0,
  })

export async function ensureCurrentUser(queryClient: {
  fetchQuery: (options: ReturnType<typeof currentUserQueryOptions>) => Promise<UserPublicType | null>
}) {
  return queryClient.fetchQuery(currentUserQueryOptions())
}
