import { describe, expect, it } from 'vitest'
import { DEFAULT_PROFILE } from '../types'
import { buildTravelerContext, extractBudgetFromMessages, extractItineraryFromMessages } from './context'

describe('buildTravelerContext', () => {
  it('maps profile fields to API context shape', () => {
    const ctx = buildTravelerContext(
      { ...DEFAULT_PROFILE, destination: 'Lisbon, Portugal', interests: 'History, Food' },
      'DISCOVERY',
      ['Day 1 museum'],
      { summary: 'On budget' },
    )
    expect(ctx.destination).toBe('Lisbon, Portugal')
    expect(ctx.active_module).toBe('DISCOVERY')
    expect(ctx.interests).toEqual(['History', 'Food'])
    expect(ctx.saved_itinerary).toEqual(['Day 1 museum'])
    expect(ctx.saved_budget).toEqual({ summary: 'On budget' })
  })
})

describe('extractItineraryFromMessages', () => {
  it('returns latest itinerary assistant messages', () => {
    const msgs = [
      { role: 'assistant', content: 'Day 1 plan', moduleId: 'SMART_ITINERARY' as const },
      { role: 'assistant', content: 'Budget info', moduleId: 'BUDGET_PLANNER' as const },
      { role: 'assistant', content: 'Day 2 plan', moduleId: 'SMART_ITINERARY' as const },
    ]
    expect(extractItineraryFromMessages(msgs)).toEqual(['Day 1 plan', 'Day 2 plan'])
  })
})

describe('extractBudgetFromMessages', () => {
  it('returns latest budget summary', () => {
    const msgs = [
      { role: 'assistant', content: 'Old budget', moduleId: 'BUDGET_PLANNER' as const },
      { role: 'assistant', content: 'Latest budget', moduleId: 'BUDGET_PLANNER' as const },
    ]
    const budget = extractBudgetFromMessages(msgs)
    expect(budget.summary).toBe('Latest budget')
    expect(budget.updatedAt).toBeTypeOf('number')
  })
})
