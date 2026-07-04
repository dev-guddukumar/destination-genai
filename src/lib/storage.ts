import type {
  ChatMessage,
  LLMSettings,
  ModuleId,
  SavedTrip,
  TravelerProfile,
} from '../types'
import { DEFAULT_PROFILE, PROVIDER_MODELS } from '../types'
import { getEnvKeyConfig } from './env'
import { chatMessageSchema, llmSettingsSchema, parseModuleId, travelerProfileSchema } from './validation'

const PROFILE_KEY = 'wanderlore:profile'
const LLM_KEY = 'wanderlore:llm'
const CHATS_KEY = 'wanderlore:module-chats'
const SAVED_TRIPS_KEY = 'wanderlore:saved-trips'
const ACTIVE_MODULE_KEY = 'wanderlore:active-module'

function defaultLLMSettings(): LLMSettings {
  return { provider: 'openrouter', apiKey: '', model: PROVIDER_MODELS.openrouter[0].id }
}

function settingsForStorage(settings: LLMSettings): LLMSettings {
  const envKey = getEnvKeyConfig()?.apiKey
  if (envKey && settings.apiKey === envKey) {
    return { ...settings, apiKey: '' }
  }
  return settings
}

function mergeWithEnv(stored: LLMSettings): LLMSettings {
  const env = getEnvKeyConfig()
  if (!env?.apiKey) return stored

  const provider = stored.apiKey.trim() ? stored.provider : env.provider
  const apiKey = stored.apiKey.trim() || env.apiKey
  const models = PROVIDER_MODELS[provider]
  const envModel = env.model
  const model =
    stored.model && models.some((m) => m.id === stored.model)
      ? stored.model
      : envModel && models.some((m) => m.id === envModel)
        ? envModel
        : models[0].id

  return { ...stored, provider, apiKey, model, customModel: stored.customModel ?? '' }
}

/** Migrate legacy storage keys from earlier app versions. */
function migrateLegacyProfile(): TravelerProfile | null {
  try {
    const raw = localStorage.getItem('wanderlore:trip')
    if (!raw) return null
    const old = JSON.parse(raw) as Record<string, string>
    const budgetMap: Record<string, TravelerProfile['budgetLevel']> = {
      budget: 'shoestring',
      shoestring: 'shoestring',
      moderate: 'moderate',
      comfortable: 'comfortable',
      luxury: 'luxury',
    }
    return {
      ...DEFAULT_PROFILE,
      destination: old.destination ?? '',
      startDate: old.startDate ?? '',
      endDate: old.endDate ?? '',
      interests: old.interests ?? '',
      groupType: (old.groupType as TravelerProfile['groupType']) ?? 'couple',
      budgetLevel: budgetMap[old.budget ?? ''] ?? 'moderate',
      pace: (old.pace as TravelerProfile['pace']) ?? 'moderate',
      dietaryRestrictions: old.dietaryRestrictions ?? old.specialNotes ?? '',
      accessibilityNeeds: old.accessibilityNeeds ?? '',
      languageSpoken: old.languageSpoken ?? '',
      currentLocation: old.currentLocation ?? '',
    }
  } catch {
    return null
  }
}

export function loadProfile(): TravelerProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (raw) {
      const parsed = travelerProfileSchema.safeParse({ ...DEFAULT_PROFILE, ...JSON.parse(raw) })
      if (parsed.success) return parsed.data
    }
    const migrated = migrateLegacyProfile()
    if (migrated) {
      saveProfile(migrated)
      return migrated
    }
  } catch {
    /* fall through */
  }
  return { ...DEFAULT_PROFILE }
}

export function saveProfile(profile: TravelerProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export function loadLLMSettings(): LLMSettings {
  try {
    const raw = localStorage.getItem(LLM_KEY)
    if (!raw) {
      return mergeWithEnv(defaultLLMSettings())
    }
    const parsed = JSON.parse(raw) as unknown
    const validated = llmSettingsSchema.safeParse(parsed)
    if (!validated.success) {
      return mergeWithEnv(defaultLLMSettings())
    }
    const models = PROVIDER_MODELS[validated.data.provider]
    const modelValid = models.some((m) => m.id === validated.data.model)
    const stored: LLMSettings = {
      provider: validated.data.provider,
      apiKey: validated.data.apiKey,
      model: modelValid ? validated.data.model : models[0].id,
      customModel: validated.data.customModel ?? '',
    }
    return mergeWithEnv(stored)
  } catch {
    return mergeWithEnv(defaultLLMSettings())
  }
}

export function saveLLMSettings(settings: LLMSettings): void {
  localStorage.setItem(LLM_KEY, JSON.stringify(settingsForStorage(settings)))
}

export function loadModuleChats(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(CHATS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as unknown
      if (!Array.isArray(parsed)) return []
      return parsed
        .map((item) => chatMessageSchema.safeParse(item))
        .filter((r) => r.success)
        .map((r) => r.data as ChatMessage)
    }
    const legacy = localStorage.getItem('wanderlore:chat')
    if (legacy) {
      const msgs = JSON.parse(legacy) as ChatMessage[]
      return Array.isArray(msgs)
        ? msgs.map((m) => ({ ...m, moduleId: m.moduleId ?? 'LOCAL_GUIDE' }))
        : []
    }
  } catch {
    /* fall through */
  }
  return []
}

export function saveModuleChats(messages: ChatMessage[]): void {
  localStorage.setItem(CHATS_KEY, JSON.stringify(messages))
}

export function loadActiveModule(): ModuleId {
  try {
    const raw = localStorage.getItem(ACTIVE_MODULE_KEY)
    const id = parseModuleId(raw)
    if (id) return id
  } catch {
    /* fall through */
  }
  return 'DASHBOARD'
}

export function saveActiveModule(moduleId: ModuleId): void {
  localStorage.setItem(ACTIVE_MODULE_KEY, moduleId)
}

export function loadSavedTrips(): SavedTrip[] {
  try {
    const raw = localStorage.getItem(SAVED_TRIPS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SavedTrip[]
    return Array.isArray(parsed) ? parsed.sort((a, b) => b.updatedAt - a.updatedAt) : []
  } catch {
    return []
  }
}

export function saveSavedTrips(trips: SavedTrip[]): void {
  localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(trips))
}

export function groupChatsByModule(messages: ChatMessage[]): Partial<Record<ModuleId, ChatMessage[]>> {
  return messages.reduce<Partial<Record<ModuleId, ChatMessage[]>>>((acc, msg) => {
    const list = acc[msg.moduleId] ?? []
    list.push(msg)
    acc[msg.moduleId] = list
    return acc
  }, {})
}

export function exportModuleMarkdown(
  profile: TravelerProfile,
  moduleLabel: string,
  messages: ChatMessage[],
): string {
  const lines = [
    `# Wanderlore — ${moduleLabel}`,
    `**${profile.destination || 'Trip'}** · ${profile.startDate || '—'} to ${profile.endDate || '—'}`,
    '',
    '---',
    '',
  ]
  for (const msg of messages) {
    if (!msg.content.trim()) continue
    lines.push(`### ${msg.role === 'user' ? 'You' : 'Wanderlore'}`, '', msg.content, '', '---', '')
  }
  lines.push('*Exported from Wanderlore*')
  return lines.join('\n')
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function downloadText(filename: string, content: string, mime = 'text/plain'): void {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
