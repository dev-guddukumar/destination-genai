import type { LLMProvider } from '../types'
import { PROVIDER_MODELS } from '../types'
import { maskApiKey } from '../lib/llm'

interface SettingsModalProps {
  open: boolean
  provider: LLMProvider
  apiKey: string
  model: string
  customModel: string
  onProviderChange: (provider: LLMProvider) => void
  onApiKeyChange: (key: string) => void
  onModelChange: (model: string) => void
  onCustomModelChange: (model: string) => void
  onClose: () => void
  onSave: () => void
}

const PROVIDER_INFO: Record<LLMProvider, { name: string; signup: string; signupUrl: string }> = {
  openrouter: {
    name: 'OpenRouter',
    signup: 'Free models + premium models (GPT-4o, Claude) via credits',
    signupUrl: 'https://openrouter.ai/keys',
  },
  groq: {
    name: 'Groq',
    signup: 'Free tier — fast inference, generous daily limits',
    signupUrl: 'https://console.groq.com/keys',
  },
}

function ModelSelect({
  provider,
  model,
  onModelChange,
}: {
  provider: LLMProvider
  model: string
  onModelChange: (model: string) => void
}) {
  const models = PROVIDER_MODELS[provider]
  const groups = [...new Set(models.map((m) => m.group).filter(Boolean))] as string[]

  if (groups.length === 0) {
    return (
      <select value={model} onChange={(e) => onModelChange(e.target.value)}>
        {models.map((m) => (
          <option key={m.id} value={m.id}>
            {m.label}
          </option>
        ))}
      </select>
    )
  }

  const ungrouped = models.filter((m) => !m.group)
  return (
    <select value={model} onChange={(e) => onModelChange(e.target.value)}>
      {ungrouped.map((m) => (
        <option key={m.id} value={m.id}>
          {m.label}
        </option>
      ))}
      {groups.map((group) => (
        <optgroup key={group} label={group}>
          {models
            .filter((m) => m.group === group)
            .map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
        </optgroup>
      ))}
    </select>
  )
}

export function SettingsModal({
  open,
  provider,
  apiKey,
  model,
  customModel,
  onProviderChange,
  onApiKeyChange,
  onModelChange,
  onCustomModelChange,
  onClose,
  onSave,
}: SettingsModalProps) {
  if (!open) return null

  const info = PROVIDER_INFO[provider]

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="settings-title"
        aria-modal="true"
      >
        <header className="modal-header">
          <h2 id="settings-title">AI Provider Settings</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <p className="modal-intro">
          Your API key stays in your browser (localStorage). Wanderlore calls OpenRouter
          directly — same API as the docs snippet, with streaming enabled.
        </p>

        <label className="field">
          <span>Provider</span>
          <select
            value={provider}
            onChange={(e) => onProviderChange(e.target.value as LLMProvider)}
          >
            <option value="openrouter">OpenRouter (recommended)</option>
            <option value="groq">Groq</option>
          </select>
        </label>

        <div className="provider-hint">
          <strong>{info.name}</strong> — {info.signup}.{' '}
          <a href={info.signupUrl} target="_blank" rel="noopener noreferrer">
            Get an API key →
          </a>
        </div>

        <label className="field">
          <span>API Key</span>
          <input
            type="password"
            placeholder="sk-or-v1-..."
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            autoComplete="off"
          />
          {apiKey && <small className="key-hint">Stored as {maskApiKey(apiKey)}</small>}
        </label>

        <label className="field">
          <span>Model</span>
          <ModelSelect provider={provider} model={model} onModelChange={onModelChange} />
        </label>

        {model === '__custom__' && (
          <label className="field">
            <span>Custom model ID</span>
            <input
              type="text"
              placeholder="e.g. openai/gpt-4o"
              value={customModel}
              onChange={(e) => onCustomModelChange(e.target.value)}
            />
          </label>
        )}

        <footer className="modal-footer">
          <button type="button" className="btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn primary" onClick={onSave}>
            Save settings
          </button>
        </footer>
      </div>
    </div>
  )
}
