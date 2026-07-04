import type { LLMProvider, LLMSettings } from '../types'

interface EnvKeyConfig {
  provider: LLMProvider
  apiKey: string
  model?: string
}

/** API keys from Vite env (`.env.local`, not committed). */
export function getEnvKeyConfig(): EnvKeyConfig | null {
  const openRouter = import.meta.env.VITE_OPENROUTER_API_KEY?.trim()
  if (openRouter) {
    return {
      provider: 'openrouter',
      apiKey: openRouter,
      model: import.meta.env.VITE_OPENROUTER_MODEL?.trim() || undefined,
    }
  }

  const groq = import.meta.env.VITE_GROQ_API_KEY?.trim()
  if (groq) {
    return {
      provider: 'groq',
      apiKey: groq,
      model: import.meta.env.VITE_GROQ_MODEL?.trim() || undefined,
    }
  }

  return null
}

export function hasConfiguredApiKey(settings: LLMSettings): boolean {
  return Boolean(settings.apiKey.trim() || getEnvKeyConfig()?.apiKey)
}

export function resolveApiKey(settings: LLMSettings): string {
  return settings.apiKey.trim() || getEnvKeyConfig()?.apiKey || ''
}
