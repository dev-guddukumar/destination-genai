import { useState } from 'react'
import type { ModuleId } from '../types'
import { AssistantContent } from './module/AssistantContent'
import { copyToClipboard } from '../lib/storage'

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
  moduleId?: ModuleId
  destination?: string
  isStreaming?: boolean
}

export function MessageBubble({
  role,
  content,
  moduleId,
  destination = '',
  isStreaming,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const ok = await copyToClipboard(content)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <article className={`message message--${role}`}>
      <div className="message-avatar" aria-hidden="true">
        {role === 'user' ? '✦' : '◎'}
      </div>
      <div className="message-body">
        <header className="message-header">
          <span className="message-label">{role === 'user' ? 'You' : 'Wanderlore'}</span>
          {role === 'assistant' && content && !isStreaming && (
            <button
              type="button"
              className="message-action"
              onClick={() => void handleCopy()}
              aria-label="Copy response"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </header>
        {role === 'assistant' ? (
          <AssistantContent
            moduleId={moduleId ?? 'LOCAL_GUIDE'}
            content={content}
            destination={destination}
            isStreaming={isStreaming}
          />
        ) : (
          <p className="message-text">{content}</p>
        )}
      </div>
    </article>
  )
}
