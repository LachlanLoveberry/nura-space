import { defineEventHandler, deleteCookie } from 'h3'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth_token', {
    path: '/',
  })

  return { ok: true }
})
