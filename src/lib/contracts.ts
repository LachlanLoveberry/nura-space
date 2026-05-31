import { z } from 'zod'

// Shared API contracts used by both the client and the server.
// Keep this module free of server-only dependencies so the client can import it safely.

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
export type GeocodingResponseType = z.infer<typeof GeocodingResponse>
