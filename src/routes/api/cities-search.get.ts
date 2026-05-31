import { defineEventHandler, getQuery } from 'h3'
import { searchCities } from '#/server/cities'

type CitiesQuery = {
  q?: string
  name?: string
  query?: string
}

export default defineEventHandler(async (event) => {
  const q = getQuery<CitiesQuery>(event)
  const query = q.q ?? q.name ?? q.query
  if (!query || query.length < 2) {
    return { status: 400, body: { error: 'query (q|name) parameter required, min 2 chars' } }
  }

  const results = await searchCities(query, 10)
  return { results }
})
