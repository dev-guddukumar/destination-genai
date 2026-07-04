export type GroupType = 'solo' | 'couple' | 'family' | 'friends'
export type BudgetLevel = 'shoestring' | 'moderate' | 'comfortable' | 'luxury'
export type PacePreference = 'relaxed' | 'moderate' | 'packed'
export type LLMProvider = 'openrouter' | 'groq'
export type ThemeMode = 'light' | 'dark' | 'system'
export type MobilePanel = 'modules' | 'workspace' | 'trip'

export type ModuleId =
  | 'DASHBOARD'
  | 'DISCOVERY'
  | 'SMART_ITINERARY'
  | 'BUDGET_PLANNER'
  | 'CULTURAL_STORY'
  | 'HIDDEN_GEMS'
  | 'LOCAL_EVENTS'
  | 'FOOD_EXPLORER'
  | 'SAFETY_ADVISOR'
  | 'LOCAL_GUIDE'
  | 'TRANSLATOR'
  | 'OFFLINE_KIT'
  | 'PACKING'

export type ModuleGroup = 'overview' | 'plan' | 'culture' | 'tools'

export interface TravelerProfile {
  destination: string
  startDate: string
  endDate: string
  interests: string
  groupType: GroupType
  budgetLevel: BudgetLevel
  pace: PacePreference
  dietaryRestrictions: string
  accessibilityNeeds: string
  languageSpoken: string
  currentLocation: string
}

export interface TravelerContext {
  destination: string
  trip_dates: { start: string; end: string }
  interests: string[]
  group_type: GroupType
  budget_level: BudgetLevel
  pace: PacePreference
  dietary_restrictions: string[]
  accessibility_needs: string
  language_spoken: string
  saved_itinerary: string[]
  saved_budget: Record<string, unknown>
  current_location: string
  active_module: ModuleId
}

export interface LLMSettings {
  provider: LLMProvider
  apiKey: string
  model: string
  customModel?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: number
  moduleId: ModuleId
}

export interface SavedTrip {
  id: string
  name: string
  profile: TravelerProfile
  moduleChats: Partial<Record<ModuleId, ChatMessage[]>>
  updatedAt: number
}

export interface ModuleDefinition {
  id: ModuleId
  label: string
  shortLabel: string
  icon: string
  group: ModuleGroup
  description: string
  defaultPrompt: string
  placeholder: string
  quickActions: { label: string; prompt: string }[]
}

export const DEFAULT_PROFILE: TravelerProfile = {
  destination: '',
  startDate: '',
  endDate: '',
  interests: '',
  groupType: 'couple',
  budgetLevel: 'moderate',
  pace: 'moderate',
  dietaryRestrictions: '',
  accessibilityNeeds: '',
  languageSpoken: '',
  currentLocation: '',
}

export const PROVIDER_MODELS: Record<LLMProvider, { id: string; label: string; group?: string }[]> = {
  openrouter: [
    { id: 'openrouter/free', label: 'OpenRouter Free', group: 'Free' },
    { id: 'meta-llama/llama-3.3-70b-instruct:free', label: 'Llama 3.3 70B', group: 'Free' },
    { id: 'google/gemma-3-27b-it:free', label: 'Gemma 3 27B', group: 'Free' },
    { id: 'openai/gpt-4o', label: 'GPT-4o', group: 'Premium' },
    { id: 'openai/gpt-4o-mini', label: 'GPT-4o Mini', group: 'Premium' },
    { id: '__custom__', label: 'Custom model…', group: 'Custom' },
  ],
  groq: [
    { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B' },
    { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B' },
    { id: 'gemma2-9b-it', label: 'Gemma 2 9B' },
  ],
}

export function resolveModelId(settings: LLMSettings): string {
  if (settings.model === '__custom__' && settings.customModel?.trim()) {
    return settings.customModel.trim()
  }
  return settings.model
}

export const GROUP_OPTIONS: { value: GroupType; label: string; icon: string }[] = [
  { value: 'solo', label: 'Solo', icon: '🧳' },
  { value: 'couple', label: 'Couple', icon: '💑' },
  { value: 'family', label: 'Family', icon: '👨‍👩‍👧' },
  { value: 'friends', label: 'Friends', icon: '👯' },
]

export const BUDGET_OPTIONS: { value: BudgetLevel; label: string }[] = [
  { value: 'shoestring', label: 'Shoestring' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'luxury', label: 'Luxury' },
]

export const PACE_OPTIONS: { value: PacePreference; label: string }[] = [
  { value: 'relaxed', label: 'Relaxed' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'packed', label: 'Packed' },
]

export const DESTINATION_INSPIRATIONS = [
  'Kyoto, Japan',
  'Marrakech, Morocco',
  'Lisbon, Portugal',
  'Oaxaca, Mexico',
  'Istanbul, Türkiye',
  'Hoi An, Vietnam',
  'Edinburgh, Scotland',
  'Cusco, Peru',
] as const

export const INTEREST_TAGS = [
  'History',
  'Street food',
  'Architecture',
  'Art & museums',
  'Local markets',
  'Nature & hiking',
  'Nightlife',
  'Crafts & workshops',
  'Spiritual sites',
  'Photography',
] as const
