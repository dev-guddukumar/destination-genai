import { z } from 'zod'
import { MODULES } from '../config/modules'
import type { ModuleId } from '../types'

const MODULE_IDS = MODULES.map((m) => m.id) as [string, ...string[]]

export const moduleIdSchema = z.enum(MODULE_IDS)

export const MAX_USER_INPUT_LENGTH = 4000
export const MAX_PROFILE_FIELD_LENGTH = 500

/** Strip control chars and cap length for untrusted user/LLM-bound text. */
export function sanitizeText(value: string, maxLength = MAX_USER_INPUT_LENGTH): string {
  const cleaned = [...value]
    .filter((ch) => {
      const code = ch.charCodeAt(0)
      return (code > 31 && code !== 127) || code === 9 || code === 10 || code === 13
    })
    .join('')
    .trim()
    .slice(0, maxLength)
  return cleaned
}

export function parseModuleId(value: unknown): ModuleId | null {
  const result = moduleIdSchema.safeParse(value)
  return result.success ? (result.data as ModuleId) : null
}

export const travelerProfileSchema = z.object({
  destination: z.string().max(MAX_PROFILE_FIELD_LENGTH),
  startDate: z.string(),
  endDate: z.string(),
  interests: z.string().max(MAX_PROFILE_FIELD_LENGTH),
  groupType: z.enum(['solo', 'couple', 'family', 'friends']),
  budgetLevel: z.enum(['shoestring', 'moderate', 'comfortable', 'luxury']),
  pace: z.enum(['relaxed', 'moderate', 'packed']),
  dietaryRestrictions: z.string().max(MAX_PROFILE_FIELD_LENGTH),
  accessibilityNeeds: z.string().max(MAX_PROFILE_FIELD_LENGTH),
  languageSpoken: z.string().max(MAX_PROFILE_FIELD_LENGTH),
  currentLocation: z.string().max(MAX_PROFILE_FIELD_LENGTH),
})

export const chatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  createdAt: z.number(),
  moduleId: moduleIdSchema,
})

export const llmSettingsSchema = z.object({
  provider: z.enum(['openrouter', 'groq']),
  apiKey: z.string(),
  model: z.string(),
  customModel: z.string().optional(),
})
