import fetch from 'node-fetch'
import { z } from 'zod'

const forecastSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  current: z.object({
    temperature_2m: z.number().optional(),
    weather_code: z.number().optional(),
    cloud_cover: z.number().optional(),
    relative_humidity_2m: z.number().optional(),
    precipitation: z.number().optional(),
    time: z.string().optional()
  }).optional()
})

const geocodeSchema = z.object({
  results: z.array(z.object({
    id: z.number().optional(),
    name: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    country: z.string().optional()
  }))
})

async function testForecast() {
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current=temperature_2m,weather_code,cloud_cover,relative_humidity_2m,precipitation&timezone=auto'
  const res = await fetch(url)
  const json = await res.json()
  const parsed = forecastSchema.safeParse(json)
  console.log('Forecast valid:', parsed.success)
  if (!parsed.success) console.error(parsed.error.format())
}

async function testGeocode() {
  const url = 'https://geocoding-api.open-meteo.com/v1/search?name=New%20York&count=5&language=en&format=json'
  const res = await fetch(url)
  const json = await res.json()
  const parsed = geocodeSchema.safeParse(json)
  console.log('Geocode valid:', parsed.success)
  if (!parsed.success) console.error(parsed.error.format())
}

async function main() {
  await testForecast()
  await testGeocode()
}

main().catch(err => { console.error(err); process.exit(1) })
