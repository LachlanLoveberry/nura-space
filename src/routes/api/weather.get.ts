import { defineEventHandler, getQuery } from 'h3'
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
    return { status: 400, body: { error: 'latitude and longitude query parameters are required' } }
  }

  const latitude = parseFloat(lat)
  const longitude = parseFloat(lon)
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return { status: 400, body: { error: 'Invalid latitude or longitude' } }
  }

  const data = await fetchWeather(latitude, longitude)
  return data
})
