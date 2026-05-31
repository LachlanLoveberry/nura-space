import { z } from 'zod'

// Server-only schemas describing the raw shape of upstream (Open-Meteo) responses.
// Shared client/server contracts live in `#/lib/contracts`.

export const OpenMeteoCurrent = z.object({
  temperature_2m: z.number().optional(),
  weather_code: z.number().optional(),
  cloud_cover: z.number().optional(),
  relative_humidity_2m: z.number().optional(),
  precipitation: z.number().optional(),
  time: z.string().optional()
})

export const OpenMeteoForecast = z.object({
  latitude: z.number(),
  longitude: z.number(),
  elevation: z.number().optional(),
  generationtime_ms: z.number().optional(),
  utc_offset_seconds: z.number().optional(),
  timezone: z.string().optional(),
  current: OpenMeteoCurrent.optional()
})

export type OpenMeteoForecastType = z.infer<typeof OpenMeteoForecast>
