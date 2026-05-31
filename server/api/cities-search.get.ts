import { defineEventHandler, getQuery } from 'h3'
import { searchCities } from '#/server/cities'

type CitySearchQuery = {
  query?: string
  q?: string
}

export default defineEventHandler(async (event) => {
  const q = getQuery<CitySearchQuery>(event)
  const query = (q.query ?? q.q ?? '').trim()

  if (!query) {
    return { results: [] }
  }

  const results = await searchCities(query)
  return { results }
})
