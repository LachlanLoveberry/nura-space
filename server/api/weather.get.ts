import { createError, defineEventHandler, getQuery } from 'h3'
import { fetchWeather } from '#/server/weather'

type WeatherQuery = {
  latitude?: string
  longitude?: string
  lat?: string
  lon?: string
}

export default defineEventHandler(async (event) => {
  const q = getQuery<WeatherQuery>(event)
  const lat = q.latitude ?? q.lat
  const lon = q.longitude ?? q.lon
  if (!lat || !lon) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'latitude and longitude query parameters are required',
    })
  }

  const latitude = parseFloat(lat)
  const longitude = parseFloat(lon)
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid latitude or longitude',
    })
  }

  const data = await fetchWeather(latitude, longitude)
  return data
})
