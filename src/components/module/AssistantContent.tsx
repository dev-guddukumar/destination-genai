import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import type { ModuleId } from '../../types'
import { parseDashboardCards, hasDashboardStructure } from '../../lib/parseDashboard'
import { DashboardCards } from './DashboardCards'
import { TypingIndicator } from '../TypingIndicator'

interface AssistantContentProps {
  moduleId: ModuleId
  content: string
  destination: string
  isStreaming?: boolean
}

export function AssistantContent({
  moduleId,
  content,
  destination,
  isStreaming,
}: AssistantContentProps) {
  if (isStreaming && !content) {
    return <TypingIndicator />
  }

  if (moduleId === 'DASHBOARD' && content && hasDashboardStructure(content)) {
    const cards = parseDashboardCards(content)
    return (
      <div className="assistant-content">
        <DashboardCards cards={cards} destination={destination} />
        <details className="raw-response">
          <summary>Full response</summary>
          <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{content}</ReactMarkdown>
        </details>
      </div>
    )
  }

  if (moduleId === 'OFFLINE_KIT' && content && !isStreaming) {
    return (
      <div className="assistant-content assistant-content--offline">
        <pre className="offline-preview">{content}</pre>
      </div>
    )
  }

  return (
    <div className="message-markdown">
      <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{content}</ReactMarkdown>
      {isStreaming && <span className="cursor-blink" aria-hidden="true" />}
    </div>
  )
}
