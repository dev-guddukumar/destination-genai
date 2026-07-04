import type { ModuleId } from '../types'

const DASHBOARD_ACTIONS = [
  { label: "Today's brief", prompt: "Give me today's dashboard brief for my trip." },
  { label: 'Tomorrow preview', prompt: "Preview tomorrow's highlights and weather considerations." },
]

const DISCOVERY_ACTIONS = [
  { label: 'Rainy day picks', prompt: 'Suggest indoor and cozy spots for a rainy day.' },
  { label: 'Half-day tour', prompt: 'Plan a half-day walking route mixing culture and food.' },
]

const ITINERARY_ACTIONS = [
  { label: 'Full trip plan', prompt: 'Build a complete day-by-day itinerary for all my dates.' },
  { label: 'Day 1 only', prompt: 'Plan only Day 1 with morning, afternoon, and evening blocks.' },
  { label: 'More food', prompt: 'Revise the itinerary with fewer museums and more food experiences.' },
]

const BUDGET_ACTIONS = [
  { label: 'Full estimate', prompt: 'Estimate total trip costs by category vs my budget level.' },
  { label: 'Save money', prompt: 'Suggest 3 money-saving swaps without losing cultural value.' },
]

const PACKING_ACTIONS = [
  { label: 'Full list', prompt: 'Generate a complete packing list for my trip.' },
  { label: 'Carry-on only', prompt: 'Packing list for carry-on only, one week.' },
]

const STORY_ACTIONS = [
  { label: 'Iconic landmark', prompt: 'Tell the story behind the most iconic landmark here.' },
  { label: 'Local dish', prompt: 'Tell the story of a signature local dish.' },
]

const GEMS_ACTIONS = [
  { label: 'Neighborhood gems', prompt: 'Find hidden gems in residential neighborhoods locals love.' },
  { label: 'Local eateries', prompt: 'Recommend hidden local eateries away from tourist strips.' },
]

const EVENTS_ACTIONS = [
  { label: 'My dates', prompt: 'What events match my exact travel dates?' },
  { label: 'Community events', prompt: 'Focus on community and local events, not tourist traps.' },
]

const FOOD_ACTIONS = [
  { label: 'Must-try dishes', prompt: 'Top dishes to try with origin stories and where to eat.' },
  { label: 'Street food', prompt: 'Best street food spots and how to order like a local.' },
]

const SAFETY_ACTIONS = [
  { label: 'General overview', prompt: 'Practical safety and health awareness for my destination.' },
  { label: 'Scams to know', prompt: 'Common scam patterns tourists should watch for.' },
]

const GUIDE_ACTIONS = [
  { label: '3 free hours', prompt: 'I have 3 free hours — what would a local recommend right now?' },
  { label: 'Tired of museums', prompt: "I'm tired of museums — suggest something different for today." },
]

const TRANSLATOR_ACTIONS = [
  { label: 'Essential phrases', prompt: 'Teach me 10 essential phrases with pronunciation.' },
  { label: 'Restaurant', prompt: 'Phrases for ordering food politely at restaurants.' },
  { label: 'Emergency', prompt: 'Emergency phrases I must know.' },
]

const OFFLINE_ACTIONS = [
  { label: 'Generate kit', prompt: 'Generate my complete offline travel kit.' },
]

export const MODULE_QUICK_ACTIONS: Record<ModuleId, { label: string; prompt: string }[]> = {
  DASHBOARD: DASHBOARD_ACTIONS,
  DISCOVERY: DISCOVERY_ACTIONS,
  SMART_ITINERARY: ITINERARY_ACTIONS,
  BUDGET_PLANNER: BUDGET_ACTIONS,
  PACKING: PACKING_ACTIONS,
  CULTURAL_STORY: STORY_ACTIONS,
  HIDDEN_GEMS: GEMS_ACTIONS,
  LOCAL_EVENTS: EVENTS_ACTIONS,
  FOOD_EXPLORER: FOOD_ACTIONS,
  SAFETY_ADVISOR: SAFETY_ACTIONS,
  LOCAL_GUIDE: GUIDE_ACTIONS,
  TRANSLATOR: TRANSLATOR_ACTIONS,
  OFFLINE_KIT: OFFLINE_ACTIONS,
}

export function canRunModule(hasApiKey: boolean, destination: string): boolean {
  return hasApiKey && Boolean(destination.trim())
}
