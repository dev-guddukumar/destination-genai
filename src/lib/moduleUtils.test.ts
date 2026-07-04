import { describe, expect, it } from 'vitest'
import { canRunModule, MODULE_QUICK_ACTIONS } from './moduleUtils'

describe('canRunModule', () => {
  it('requires api key and destination', () => {
    expect(canRunModule(true, 'Kyoto')).toBe(true)
    expect(canRunModule(false, 'Kyoto')).toBe(false)
    expect(canRunModule(true, '  ')).toBe(false)
  })
})

describe('MODULE_QUICK_ACTIONS', () => {
  it('defines quick actions for every module', () => {
    const ids = Object.keys(MODULE_QUICK_ACTIONS)
    expect(ids).toContain('DASHBOARD')
    expect(ids).toContain('OFFLINE_KIT')
    expect(MODULE_QUICK_ACTIONS.LOCAL_GUIDE.length).toBeGreaterThan(0)
  })
})
