import type { ChatMessage, ModuleId } from '../types'

export function newId(): string {
  return crypto.randomUUID()
}

export function newMessage(
  role: 'user' | 'assistant',
  content: string,
  moduleId: ModuleId,
): ChatMessage {
  return { id: newId(), role, content, createdAt: Date.now(), moduleId }
}
