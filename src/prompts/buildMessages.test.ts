import { describe, expect, it } from 'vitest'
import type { TravelerContext } from '../types'
import { buildChatMessages, buildModuleRequest, getModuleHistory } from './buildMessages'
import { WANDERLORE_SYSTEM_PROMPT } from './system'

const context: TravelerContext = {
  destination: 'Kyoto, Japan',
  trip_dates: { start: '2026-07-01', end: '2026-07-05' },
  interests: ['History'],
  group_type: 'couple',
  budget_level: 'moderate',
  pace: 'moderate',
  dietary_restrictions: [],
  accessibility_needs: '',
  language_spoken: 'English',
  saved_itinerary: [],
  saved_budget: {},
  current_location: '',
  active_module: 'DISCOVERY',
}

describe('buildModuleRequest', () => {
  it('returns JSON with active module and sanitized user request', () => {
    const json = JSON.parse(buildModuleRequest(context, '  Find temples  '))
    expect(json.active_module).toBe('DISCOVERY')
    expect(json.user_request).toBe('Find temples')
    expect(json.traveler_context.destination).toBe('Kyoto, Japan')
  })
})

describe('buildChatMessages', () => {
  it('includes system prompt, history, and structured user payload', () => {
    const history = [{ role: 'assistant' as const, content: 'Prior answer' }]
    const messages = buildChatMessages(context, history, 'More food spots')
    expect(messages[0].role).toBe('system')
    expect(messages[0].content).toContain(WANDERLORE_SYSTEM_PROMPT.slice(0, 40))
    expect(messages[0].content).toContain('untrusted user data')
    expect(messages[1]).toEqual(history[0])
    expect(JSON.parse(messages[2].content).user_request).toBe('More food spots')
  })
})

describe('getModuleHistory', () => {
  it('filters messages by module and drops empty content', () => {
    const history = getModuleHistory(
      [
        { role: 'user', content: 'Hi', moduleId: 'DISCOVERY' },
        { role: 'assistant', content: '   ', moduleId: 'DISCOVERY' },
        { role: 'user', content: 'Other', moduleId: 'PACKING' },
      ],
      'DISCOVERY',
    )
    expect(history).toEqual([{ role: 'user', content: 'Hi' }])
  })
})
