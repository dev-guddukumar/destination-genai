import { afterEach, describe, expect, it, vi } from 'vitest'
import { maskApiKey, streamChat } from './llm'

describe('maskApiKey', () => {
  it('masks middle of long keys', () => {
    expect(maskApiKey('sk-or-v1-abcdefghijklmnop')).toBe('sk-o••••mnop')
  })

  it('fully masks short keys', () => {
    expect(maskApiKey('short')).toBe('••••••••')
  })
})

describe('streamChat', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('throws on non-ok response with parsed error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        text: async () => JSON.stringify({ error: { message: 'Invalid API key' } }),
      }),
    )

    await expect(
      streamChat({
        provider: 'openrouter',
        apiKey: 'test-key',
        model: 'openrouter/free',
        messages: [{ role: 'user', content: 'hi' }],
        onToken: () => {},
        timeoutMs: 5000,
      }),
    ).rejects.toThrow('Invalid API key')
  })

  it('streams tokens from SSE chunks', async () => {
    const encoder = new TextEncoder()
    const body = {
      getReader: () => {
        let sent = false
        return {
          read: async () => {
            if (sent) return { done: true, value: undefined }
            sent = true
            const chunk =
              'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\ndata: [DONE]\n\n'
            return { done: false, value: encoder.encode(chunk) }
          },
        }
      },
    }

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, body }),
    )

    const tokens: string[] = []
    await streamChat({
      provider: 'groq',
      apiKey: 'test-key',
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: 'hi' }],
      onToken: (t) => tokens.push(t),
      timeoutMs: 5000,
    })

    expect(tokens).toEqual(['Hello'])
  })
})
