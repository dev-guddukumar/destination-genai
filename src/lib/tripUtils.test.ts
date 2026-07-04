import { describe, expect, it } from 'vitest'
import { DEFAULT_PROFILE } from '../types'
import {
  formatDateRange,
  getDestinationGradient,
  getInterestList,
  getTripDuration,
  isInterestSelected,
  profileCompleteness,
  toggleInterest,
} from './tripUtils'

describe('getTripDuration', () => {
  it('returns inclusive day count for valid range', () => {
    expect(getTripDuration('2026-07-01', '2026-07-03')).toBe(3)
  })

  it('returns null for invalid or empty dates', () => {
    expect(getTripDuration('', '2026-07-03')).toBeNull()
    expect(getTripDuration('bad', '2026-07-03')).toBeNull()
    expect(getTripDuration('2026-07-10', '2026-07-01')).toBeNull()
  })
})

describe('formatDateRange', () => {
  it('formats start and end', () => {
    const result = formatDateRange('2026-07-01', '2026-07-05')
    expect(result).toContain('2026')
  })

  it('returns null when both dates missing', () => {
    expect(formatDateRange('', '')).toBeNull()
  })
})

describe('interest helpers', () => {
  it('parses comma-separated interests', () => {
    expect(getInterestList('History, Street food')).toEqual(['History', 'Street food'])
  })

  it('toggles interests without duplicates', () => {
    expect(toggleInterest('History', 'Street food')).toBe('History, Street food')
    expect(toggleInterest('History, Street food', 'History')).toBe('Street food')
    expect(isInterestSelected('History, Street food', 'history')).toBe(true)
  })
})

describe('profileCompleteness', () => {
  it('scores a filled profile higher than empty', () => {
    const empty = profileCompleteness(DEFAULT_PROFILE)
    const filled = profileCompleteness({
      ...DEFAULT_PROFILE,
      destination: 'Kyoto, Japan',
      startDate: '2026-07-01',
      endDate: '2026-07-05',
      interests: 'History',
    })
    expect(filled).toBeGreaterThan(empty)
    expect(filled).toBeLessThanOrEqual(100)
  })
})

describe('getDestinationGradient', () => {
  it('returns a CSS gradient string', () => {
    expect(getDestinationGradient('Kyoto')).toMatch(/^linear-gradient/)
  })
})
