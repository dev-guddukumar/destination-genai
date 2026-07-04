import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChatMessage, LLMSettings, ModuleId, TravelerProfile } from '../types'
import { resolveModelId } from '../types'
import { resolveApiKey, hasConfiguredApiKey } from '../lib/env'
import { getModule } from '../config/modules'
import { buildTravelerContext, extractItineraryFromMessages, extractBudgetFromMessages } from '../lib/context'
import { newId, newMessage } from '../lib/id'
import { streamChat } from '../lib/llm'
import { getModuleHistory, buildChatMessages } from '../prompts/buildMessages'
import { saveModuleChats } from '../lib/storage'

interface UseModuleChatOptions {
  profile: TravelerProfile
  llmSettings: LLMSettings
  activeModule: ModuleId
  allMessages: ChatMessage[]
  onMessagesChange: (updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void
  onNeedApiKey: () => void
  onNeedDestination: () => void
}

export function useModuleChat({
  profile,
  llmSettings,
  activeModule,
  allMessages,
  onMessagesChange,
  onNeedApiKey,
  onNeedDestination,
}: UseModuleChatOptions) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const mountedRef = useRef(true)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const moduleMessages = allMessages.filter((m) => m.moduleId === activeModule)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      abortRef.current?.abort()
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [])

  useEffect(() => {
    setInput('')
    setError(null)
  }, [activeModule])

  useEffect(() => {
    if (allMessages.length === 0) return
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      saveModuleChats(allMessages)
    }, 400)
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [allMessages])

  const sendMessage = useCallback(
    async (question: string) => {
      const trimmed = question.trim()
      if (!trimmed || isLoading) return

      if (!hasConfiguredApiKey(llmSettings)) {
        setError('Add an API key in settings to continue.')
        onNeedApiKey()
        return
      }
      if (!profile.destination.trim()) {
        setError('Please set a destination in your trip profile.')
        onNeedDestination()
        return
      }

      setError(null)
      setInput('')

      const userMsg = newMessage('user', trimmed, activeModule)
      const assistantId = newId()
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        createdAt: Date.now(),
        moduleId: activeModule,
      }

      const historyBefore = getModuleHistory(allMessages, activeModule)
      onMessagesChange((prev) => [...prev, userMsg, assistantMsg])
      setIsLoading(true)

      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      const savedItinerary = extractItineraryFromMessages(allMessages)
      const savedBudget = extractBudgetFromMessages(allMessages)
      const context = buildTravelerContext(profile, activeModule, savedItinerary, savedBudget)

      try {
        const apiMessages = buildChatMessages(context, historyBefore, trimmed)

        await streamChat({
          provider: llmSettings.provider,
          apiKey: resolveApiKey(llmSettings),
          model: resolveModelId(llmSettings),
          messages: apiMessages,
          signal: controller.signal,
          onToken: (token) => {
            if (!mountedRef.current) return
            onMessagesChange((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: m.content + token } : m,
              ),
            )
          },
        })
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        const message = err instanceof Error ? err.message : 'Something went wrong'
        if (!mountedRef.current) return
        setError(message)
        onMessagesChange((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: m.content || `*Unable to respond: ${message}*` }
              : m,
          ),
        )
      } finally {
        if (mountedRef.current) setIsLoading(false)
        abortRef.current = null
      }
    },
    [activeModule, allMessages, isLoading, llmSettings, onMessagesChange, onNeedApiKey, onNeedDestination, profile],
  )

  const runDefaultPrompt = useCallback(() => {
    const prompt = getModule(activeModule).defaultPrompt
    void sendMessage(prompt)
  }, [activeModule, sendMessage])

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort()
    setIsLoading(false)
  }, [])

  const clearModuleChat = useCallback(() => {
    abortRef.current?.abort()
    onMessagesChange((prev) => prev.filter((m) => m.moduleId !== activeModule))
    setError(null)
    setIsLoading(false)
  }, [activeModule, onMessagesChange])

  return {
    input,
    setInput,
    isLoading,
    error,
    setError,
    moduleMessages,
    sendMessage,
    runDefaultPrompt,
    stopGeneration,
    clearModuleChat,
  }
}
