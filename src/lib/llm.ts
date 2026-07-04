import type { LLMProvider } from '../types'

const ENDPOINTS: Record<LLMProvider, string> = {
  openrouter: 'https://openrouter.ai/api/v1/chat/completions',
  groq: 'https://api.groq.com/openai/v1/chat/completions',
}

const PROVIDER_HEADERS: Record<LLMProvider, Record<string, string>> = {
  openrouter: {
    'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost',
    'X-Title': 'Wanderlore',
  },
  groq: {},
}

const DEFAULT_TIMEOUT_MS = 60_000

export interface StreamChatOptions {
  provider: LLMProvider
  apiKey: string
  model: string
  messages: { role: string; content: string }[]
  onToken: (token: string) => void
  signal?: AbortSignal
  timeoutMs?: number
}

function mergeSignals(userSignal: AbortSignal | undefined, timeoutMs: number): AbortSignal {
  const timeoutSignal = AbortSignal.timeout(timeoutMs)
  if (!userSignal) return timeoutSignal
  return AbortSignal.any([userSignal, timeoutSignal])
}

export async function streamChat({
  provider,
  apiKey,
  model,
  messages,
  onToken,
  signal,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}: StreamChatOptions): Promise<void> {
  const response = await fetch(ENDPOINTS[provider], {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...PROVIDER_HEADERS[provider],
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      temperature: 0.75,
      max_tokens: 4096,
    }),
    signal: mergeSignals(signal, timeoutMs),
  })

  if (!response.ok) {
    const body = await response.text()
    let message = `API error (${response.status})`
    try {
      const parsed = JSON.parse(body)
      message = parsed.error?.message ?? parsed.message ?? message
    } catch {
      if (body) message = body.slice(0, 200)
    }
    throw new Error(message)
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error('No response stream available')

  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) continue
      const data = trimmed.slice(5).trim()
      if (data === '[DONE]') return

      try {
        const parsed = JSON.parse(data)
        const token = parsed.choices?.[0]?.delta?.content
        if (token) onToken(token)
      } catch {
        // skip malformed chunks
      }
    }
  }
}

export function maskApiKey(key: string): string {
  if (key.length <= 8) return '••••••••'
  return `${key.slice(0, 4)}••••${key.slice(-4)}`
}
