import { describe, expect, it } from 'vitest'
import { resolveModelId } from '../types'

describe('resolveModelId', () => {
  it('uses custom model when selected', () => {
    expect(
      resolveModelId({
        provider: 'openrouter',
        apiKey: '',
        model: '__custom__',
        customModel: 'openai/gpt-4o',
      }),
    ).toBe('openai/gpt-4o')
  })

  it('falls back to configured model', () => {
    expect(
      resolveModelId({
        provider: 'groq',
        apiKey: '',
        model: 'llama-3.3-70b-versatile',
      }),
    ).toBe('llama-3.3-70b-versatile')
  })
})
