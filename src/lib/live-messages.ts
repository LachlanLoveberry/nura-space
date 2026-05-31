import { z } from 'zod'

export const LiveMessageSeverity = z.enum(['default', 'info', 'success', 'warning', 'error'])

export const LiveMessageInput = z.object({
  city: z.string().trim().min(1),
  title: z.string().trim().min(1).optional(),
  message: z.string().trim().min(1),
  severity: LiveMessageSeverity.optional(),
})

export const LiveMessagePayload = LiveMessageInput.extend({
  id: z.string(),
  cityKey: z.string(),
  createdAt: z.string(),
})

export type LiveMessageSeverityType = z.infer<typeof LiveMessageSeverity>
export type LiveMessageInputType = z.infer<typeof LiveMessageInput>
export type LiveMessagePayloadType = z.infer<typeof LiveMessagePayload>

export function normalizeCityKey(city: string) {
  return city.trim().toLowerCase().replace(/\s+/g, ' ')
}
