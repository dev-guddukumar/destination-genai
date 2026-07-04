import type { ModuleId, TravelerContext, TravelerProfile } from '../types'

function splitList(value: string): string[] {
  return value
    .split(/[,;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function buildTravelerContext(
  profile: TravelerProfile,
  activeModule: ModuleId,
  savedItinerary: string[] = [],
  savedBudget: Record<string, unknown> = {},
): TravelerContext {
  return {
    destination: profile.destination,
    trip_dates: { start: profile.startDate, end: profile.endDate },
    interests: splitList(profile.interests),
    group_type: profile.groupType,
    budget_level: profile.budgetLevel,
    pace: profile.pace,
    dietary_restrictions: splitList(profile.dietaryRestrictions),
    accessibility_needs: profile.accessibilityNeeds,
    language_spoken: profile.languageSpoken,
    saved_itinerary: savedItinerary,
    saved_budget: savedBudget,
    current_location: profile.currentLocation,
    active_module: activeModule,
  }
}

export function extractItineraryFromMessages(
  messages: { role: string; content: string; moduleId?: ModuleId }[],
): string[] {
  return messages
    .filter((m) => m.role === 'assistant' && m.moduleId === 'SMART_ITINERARY' && m.content.trim())
    .map((m) => m.content.trim())
    .slice(-3)
}

export function extractBudgetFromMessages(
  messages: { role: string; content: string; moduleId?: ModuleId }[],
): Record<string, unknown> {
  const latest = messages
    .filter((m) => m.role === 'assistant' && m.moduleId === 'BUDGET_PLANNER' && m.content.trim())
    .at(-1)
  if (!latest) return {}
  return { summary: latest.content.trim().slice(0, 2000), updatedAt: Date.now() }
}
