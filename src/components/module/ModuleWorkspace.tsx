import { useEffect, useRef } from 'react'
import type { ChatMessage, ModuleId, TravelerProfile } from '../../types'
import { getModule } from '../../config/modules'
import { canRunModule } from '../../lib/moduleUtils'
import { MessageBubble } from '../MessageBubble'
import { ModuleHeader } from './ModuleHeader'
import { ModuleWelcome } from './ModuleWelcome'
import { TripContextStrip } from './TripContextStrip'

interface ModuleWorkspaceProps {
  moduleId: ModuleId
  profile: TravelerProfile
  messages: ChatMessage[]
  input: string
  isLoading: boolean
  hasApiKey: boolean
  onInputChange: (value: string) => void
  onSubmit: () => void
  onStop: () => void
  onRunDefault: () => void
  onQuickAction: (prompt: string) => void
  onClear: () => void
  onExport: () => void
  onSaveOffline: () => void
  onOpenSettings: () => void
  onOpenTrip: () => void
}

export function ModuleWorkspace({
  moduleId,
  profile,
  messages,
  input,
  isLoading,
  hasApiKey,
  onInputChange,
  onSubmit,
  onStop,
  onRunDefault,
  onQuickAction,
  onClear,
  onExport,
  onSaveOffline,
  onOpenSettings,
  onOpenTrip,
}: ModuleWorkspaceProps) {
  const mod = getModule(moduleId)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const showWelcome = messages.length === 0
  const ready = canRunModule(hasApiKey, profile.destination)
  const hasAssistantContent = messages.some((m) => m.role === 'assistant' && m.content.trim())

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
  }, [input])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading && input.trim() && ready) onSubmit()
    }
  }

  return (
    <section className={`module-workspace module-workspace--${moduleId.toLowerCase()}`}>
      <TripContextStrip profile={profile} onEditTrip={onOpenTrip} />

      <ModuleHeader
        moduleId={moduleId}
        destination={profile.destination}
        onRunDefault={onRunDefault}
        onClear={onClear}
        onExport={onExport}
        hasMessages={hasAssistantContent}
        isLoading={isLoading}
        hasApiKey={hasApiKey}
      />

      <div className="module-workspace__body">
        {showWelcome ? (
          <ModuleWelcome
            moduleId={moduleId}
            profile={profile}
            hasApiKey={hasApiKey}
            isLoading={isLoading}
            onRunDefault={onRunDefault}
            onQuickAction={onQuickAction}
            onOpenTrip={onOpenTrip}
            onOpenSettings={onOpenSettings}
          />
        ) : (
          <div className="messages-list">
            {messages.map((msg, i) => (
              <MessageBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
                moduleId={msg.moduleId}
                destination={profile.destination}
                isStreaming={isLoading && i === messages.length - 1 && msg.role === 'assistant'}
              />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <footer className="module-workspace__footer">
        {!showWelcome && mod.quickActions.length > 0 && (
          <div className="quick-actions quick-actions--compact">
            {mod.quickActions.slice(0, 3).map((action) => (
              <button
                key={action.label}
                type="button"
                className="quick-action quick-action--sm"
                disabled={!ready || isLoading}
                onClick={() => onQuickAction(action.prompt)}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {moduleId === 'OFFLINE_KIT' && hasAssistantContent && (
          <button
            type="button"
            className="btn btn--sm btn--ghost offline-save-btn"
            onClick={onSaveOffline}
          >
            📴 Save offline kit
          </button>
        )}

        <div className="input-row">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder={
              !ready
                ? 'Set destination & API key to start'
                : mod.placeholder
            }
            value={input}
            disabled={!ready}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {isLoading ? (
            <button type="button" className="btn btn--stop send-btn" onClick={onStop} aria-label="Stop">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn--primary send-btn"
              disabled={!ready || !input.trim()}
              onClick={onSubmit}
              aria-label="Send"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          )}
        </div>
      </footer>
    </section>
  )
}
