import type { ModuleDefinition, ModuleGroup } from '../types'
import { MODULE_QUICK_ACTIONS } from '../lib/moduleUtils'

export const MODULE_GROUPS: { id: ModuleGroup; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'plan', label: 'Plan' },
  { id: 'culture', label: 'Culture' },
  { id: 'tools', label: 'Tools' },
]

const BASE_MODULES: Omit<ModuleDefinition, 'quickActions'>[] = [
  {
    id: 'DASHBOARD',
    label: 'Dashboard',
    shortLabel: 'Home',
    icon: '📊',
    group: 'overview',
    description: 'Your daily brief — weather, budget, next stop, and cultural tip at a glance.',
    defaultPrompt: "Give me today's dashboard brief for my trip.",
    placeholder: 'Optional: focus on a specific day…',
  },
  {
    id: 'DISCOVERY',
    label: 'Discovery',
    shortLabel: 'Discover',
    icon: '🧭',
    group: 'plan',
    description: 'Attractions and hidden gems matched to your interests and mood.',
    defaultPrompt: 'Recommend places to explore based on my interests.',
    placeholder: 'e.g. rainy day ideas, art-focused afternoon…',
  },
  {
    id: 'SMART_ITINERARY',
    label: 'Smart Itinerary',
    shortLabel: 'Itinerary',
    icon: '🗓️',
    group: 'plan',
    description: 'Day-by-day plan with transit times, tags, and weather-aware swaps.',
    defaultPrompt: 'Build a full day-by-day itinerary for my trip dates.',
    placeholder: 'e.g. Plan day 2 with more food, fewer museums…',
  },
  {
    id: 'BUDGET_PLANNER',
    label: 'Budget Planner',
    shortLabel: 'Budget',
    icon: '💰',
    group: 'plan',
    description: 'Cost estimates, budget tracking, and money-saving swaps.',
    defaultPrompt: 'Estimate my trip costs and compare to my budget level.',
    placeholder: 'e.g. Is day 3 over budget? Cheaper food options?',
  },
  {
    id: 'PACKING',
    label: 'Packing',
    shortLabel: 'Packing',
    icon: '🎒',
    group: 'plan',
    description: 'Smart packing list for your destination, season, and activities.',
    defaultPrompt: 'Generate a packing list for my trip.',
    placeholder: "e.g. I'm doing hiking and temple visits…",
  },
  {
    id: 'CULTURAL_STORY',
    label: 'Cultural Story',
    shortLabel: 'Stories',
    icon: '📖',
    group: 'culture',
    description: 'Immersive narratives that bring places, objects, and dishes to life.',
    defaultPrompt: 'Tell me the story behind the most iconic landmark here.',
    placeholder: 'Name a place, dish, or tradition…',
  },
  {
    id: 'HIDDEN_GEMS',
    label: 'Hidden Gems',
    shortLabel: 'Gems',
    icon: '💎',
    group: 'culture',
    description: 'Deep-cut spots locals love — beyond the top-10 lists.',
    defaultPrompt: 'Find hidden gems most tourists never discover.',
    placeholder: 'e.g. quiet neighborhoods, local workshops…',
  },
  {
    id: 'LOCAL_EVENTS',
    label: 'Local Events',
    shortLabel: 'Events',
    icon: '🎭',
    group: 'culture',
    description: 'Festivals, markets, and performances aligned to your dates.',
    defaultPrompt: 'What events and festivals match my travel dates?',
    placeholder: 'e.g. community events vs tourist festivals…',
  },
  {
    id: 'FOOD_EXPLORER',
    label: 'Food Explorer',
    shortLabel: 'Food',
    icon: '🍜',
    group: 'culture',
    description: 'Dish stories, where to eat, and dietary-aware recommendations.',
    defaultPrompt: 'What should I eat and where? Include dish origin stories.',
    placeholder: 'e.g. vegetarian street food, breakfast spots…',
  },
  {
    id: 'SAFETY_ADVISOR',
    label: 'Safety Advisor',
    shortLabel: 'Safety',
    icon: '🛡️',
    group: 'tools',
    description: 'Emergency numbers, scam awareness, and health notes — not official advisories.',
    defaultPrompt: 'Give me practical safety and health awareness for my destination.',
    placeholder: 'e.g. solo night travel, tap water, common scams…',
  },
  {
    id: 'LOCAL_GUIDE',
    label: 'Local Guide',
    shortLabel: 'Guide',
    icon: '🗣️',
    group: 'tools',
    description: 'Ask anything — re-plan on the fly, get contextual local advice.',
    defaultPrompt: 'I have 3 free hours today — what would a local recommend?',
    placeholder: 'Ask me anything about your trip…',
  },
  {
    id: 'TRANSLATOR',
    label: 'Translator',
    shortLabel: 'Translate',
    icon: '🌐',
    group: 'tools',
    description: 'Contextual phrases with pronunciation and politeness notes.',
    defaultPrompt: 'Teach me essential phrases for my destination.',
    placeholder: 'e.g. How do I order coffee politely?',
  },
  {
    id: 'OFFLINE_KIT',
    label: 'Offline Kit',
    shortLabel: 'Offline',
    icon: '📴',
    group: 'tools',
    description: 'Cacheable survival phrases, contacts, and etiquette for offline use.',
    defaultPrompt: 'Generate my offline travel kit.',
    placeholder: 'Optional: emphasize certain phrases or areas…',
  },
]

export const MODULES: ModuleDefinition[] = BASE_MODULES.map((m) => ({
  ...m,
  quickActions: MODULE_QUICK_ACTIONS[m.id],
}))

export const MODULE_MAP = Object.fromEntries(MODULES.map((m) => [m.id, m])) as Record<
  ModuleDefinition['id'],
  ModuleDefinition
>

export function getModule(id: ModuleDefinition['id']): ModuleDefinition {
  return MODULE_MAP[id] ?? MODULE_MAP.DASHBOARD
}
