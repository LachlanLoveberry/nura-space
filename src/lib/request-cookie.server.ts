import { getRequestHeader } from '@tanstack/react-start/server'

export function getRequestCookieHeader() {
  return getRequestHeader('cookie') ?? ''
}
