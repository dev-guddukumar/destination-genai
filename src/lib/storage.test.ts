import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_PROFILE } from '../types'
import {
  loadActiveModule,
  loadLLMSettings,
  loadModuleChats,
  loadProfile,
  saveLLMSettings,
  saveProfile,
} from './storage'

vi.mock('./env', () => ({
  getEnvKeyConfig: () => ({
    provider: 'openrouter',
    apiKey: 'sk-env-key-from-file',
    model: 'openrouter/free',
  }),
}))

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('round-trips profile', () => {
    saveProfile({ ...DEFAULT_PROFILE, destination: 'Lisbon' })
    expect(loadProfile().destination).toBe('Lisbon')
  })

  it('does not persist env-sourced API keys', () => {
    saveLLMSettings({
      provider: 'openrouter',
      apiKey: 'sk-env-key-from-file',
      model: 'openrouter/free',
    })
    const raw = JSON.parse(localStorage.getItem('wanderlore:llm')!)
    expect(raw.apiKey).toBe('')
  })

  it('merges env key at runtime when storage has no user key', () => {
    localStorage.setItem(
      'wanderlore:llm',
      JSON.stringify({ provider: 'openrouter', apiKey: '', model: 'openrouter/free' }),
    )
    expect(loadLLMSettings().apiKey).toBe('sk-env-key-from-file')
  })

  it('validates active module id', () => {
    localStorage.setItem('wanderlore:active-module', 'NOT_A_MODULE')
    expect(loadActiveModule()).toBe('DASHBOARD')
    localStorage.setItem('wanderlore:active-module', 'PACKING')
    expect(loadActiveModule()).toBe('PACKING')
  })

  it('filters invalid chat messages', () => {
    localStorage.setItem(
      'wanderlore:module-chats',
      JSON.stringify([
        { id: '1', role: 'user', content: 'Hi', createdAt: 1, moduleId: 'DISCOVERY' },
        { id: '2', role: 'user', content: 'Bad', createdAt: 2, moduleId: 'INVALID' },
      ]),
    )
    expect(loadModuleChats()).toHaveLength(1)
  })
})
