import { useCallback, useState } from 'react'
import type { LLMProvider, LLMSettings } from '../types'
import { PROVIDER_MODELS } from '../types'
import { loadLLMSettings, saveLLMSettings } from '../lib/storage'

export function useSettings(onSaved?: () => void) {
  const [llmSettings, setLlmSettings] = useState<LLMSettings>(loadLLMSettings)
  const [open, setOpen] = useState(false)
  const [draftProvider, setDraftProvider] = useState(llmSettings.provider)
  const [draftApiKey, setDraftApiKey] = useState(llmSettings.apiKey)
  const [draftModel, setDraftModel] = useState(llmSettings.model)
  const [draftCustomModel, setDraftCustomModel] = useState(llmSettings.customModel ?? '')

  const openSettings = useCallback(() => {
    setDraftProvider(llmSettings.provider)
    setDraftApiKey(llmSettings.apiKey)
    setDraftModel(llmSettings.model)
    setDraftCustomModel(llmSettings.customModel ?? '')
    setOpen(true)
  }, [llmSettings])

  const handleProviderChange = useCallback(
    (provider: LLMProvider) => {
      setDraftProvider(provider)
      const models = PROVIDER_MODELS[provider]
      if (!models.some((m) => m.id === draftModel)) {
        setDraftModel(models[0].id)
      }
    },
    [draftModel],
  )

  const saveSettings = useCallback(() => {
    const updated: LLMSettings = {
      provider: draftProvider,
      apiKey: draftApiKey.trim(),
      model: draftModel,
      customModel: draftCustomModel.trim(),
    }
    setLlmSettings(updated)
    saveLLMSettings(updated)
    setOpen(false)
    onSaved?.()
  }, [draftApiKey, draftCustomModel, draftModel, draftProvider, onSaved])

  return {
    llmSettings,
    open,
    setOpen,
    draftProvider,
    draftApiKey,
    draftModel,
    draftCustomModel,
    setDraftApiKey,
    setDraftModel,
    setDraftCustomModel,
    openSettings,
    handleProviderChange,
    saveSettings,
  }
}
