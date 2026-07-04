import { beforeEach, describe, expect, it, vi } from 'vitest'
import { hasConfiguredApiKey, resolveApiKey } from './env'

describe('env helpers', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
  })

  it('detects configured settings api key', () => {
    vi.stubEnv('VITE_OPENROUTER_API_KEY', '')
    vi.stubEnv('VITE_GROQ_API_KEY', '')
    expect(hasConfiguredApiKey({ provider: 'openrouter', apiKey: 'user-key', model: 'x' })).toBe(
      true,
    )
    expect(hasConfiguredApiKey({ provider: 'openrouter', apiKey: '', model: 'x' })).toBe(false)
  })

  it('resolves env key when settings key empty', () => {
    vi.stubEnv('VITE_OPENROUTER_API_KEY', 'sk-from-env')
    expect(resolveApiKey({ provider: 'openrouter', apiKey: '', model: 'x' })).toBe('sk-from-env')
  })

  it('prefers user settings key over env', () => {
    vi.stubEnv('VITE_OPENROUTER_API_KEY', 'sk-from-env')
    expect(resolveApiKey({ provider: 'openrouter', apiKey: 'user-key', model: 'x' })).toBe(
      'user-key',
    )
  })
})
