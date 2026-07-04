import { describe, expect, it } from 'vitest'
import { getModule, MODULES } from '../config/modules'

describe('modules config', () => {
  it('defines 13 modules', () => {
    expect(MODULES).toHaveLength(13)
  })

  it('falls back to dashboard for unknown ids', () => {
    expect(getModule('NOT_REAL' as 'DASHBOARD').id).toBe('DASHBOARD')
  })

  it('each module has quick actions and prompts', () => {
    for (const mod of MODULES) {
      expect(mod.label.length).toBeGreaterThan(0)
      expect(mod.defaultPrompt.length).toBeGreaterThan(0)
      expect(mod.quickActions.length).toBeGreaterThan(0)
    }
  })
})
