import { describe, expect, it } from 'vitest'
import { hasDashboardStructure, parseDashboardCards } from './parseDashboard'

const SAMPLE = `
**Today's highlight:** Sunny morning — visit Fushimi Inari before crowds.
**Budget status:** About 62% of daily budget used so far.
**Cultural tip:** Remove shoes before entering tatami rooms.
**Safety note:** Watch for pickpockets near Nishiki Market.
**Next stop:** Gion district at 4pm.
`

describe('parseDashboardCards', () => {
  it('extracts structured cards from markdown-like text', () => {
    const cards = parseDashboardCards(SAMPLE)
    expect(cards.length).toBeGreaterThanOrEqual(2)
    expect(cards.some((c) => c.title.includes('highlight'))).toBe(true)
    expect(cards.some((c) => c.variant === 'budget')).toBe(true)
  })

  it('returns empty array for blank content', () => {
    expect(parseDashboardCards('')).toEqual([])
    expect(parseDashboardCards('hi')).toEqual([])
  })
})

describe('hasDashboardStructure', () => {
  it('detects when enough cards can be parsed', () => {
    expect(hasDashboardStructure(SAMPLE)).toBe(true)
    expect(hasDashboardStructure('single short line')).toBe(false)
  })
})
