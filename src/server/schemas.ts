import { z } from 'zod'

export const SignupRequest = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const LoginRequest = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

export const UserPublic = z.object({
  id: z.string(),
  email: z.string().email(),
  selectedCity: z
    .object({
      name: z.string(),
      latitude: z.number(),
      longitude: z.number()
    })
    .nullable()
})

export const AuthResponse = z.object({
  token: z.string(),
  user: UserPublic
})

// Open-Meteo forecast response (current object)
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

export const NormalizedWeather = z.object({
  latitude: z.number(),
  longitude: z.number(),
  temperature: z.number().optional(),
  weatherCode: z.number().optional(),
  cloudCover: z.number().optional(),
  humidity: z.number().optional(),
  precipitation: z.number().optional(),
  timestamp: z.string().optional()
})

export const GeocodingResult = z.object({
  id: z.number().optional(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  country: z.string().optional(),
  timezone: z.string().optional()
})

export const GeocodingResponse = z.object({
  results: z.array(GeocodingResult).optional()
})

export type UserPublicType = z.infer<typeof UserPublic>
export type NormalizedWeatherType = z.infer<typeof NormalizedWeather>
export type GeocodingResultType = z.infer<typeof GeocodingResult>
export type OpenMeteoForecastType = z.infer<typeof OpenMeteoForecast>
export type GeocodingResponseType = z.infer<typeof GeocodingResponse>
