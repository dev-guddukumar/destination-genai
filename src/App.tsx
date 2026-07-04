import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ChatMessage, MobilePanel, ModuleId, SavedTrip, TravelerProfile } from './types'
import { getModule } from './config/modules'
import { ModuleNav } from './components/layout/ModuleNav'
import { MobileNav } from './components/layout/MobileNav'
import { ModuleWorkspace } from './components/module/ModuleWorkspace'
import { TripForm } from './components/TripForm'
import { SettingsModal } from './components/SettingsModal'
import { Toast } from './components/shared/Toast'
import { useTheme } from './hooks/useTheme'
import { useToast } from './hooks/useToast'
import { useSettings } from './hooks/useSettings'
import { useModuleChat } from './hooks/useModuleChat'
import {
  loadProfile,
  saveProfile,
  loadModuleChats,
  loadActiveModule,
  saveActiveModule,
  loadSavedTrips,
  saveSavedTrips,
  groupChatsByModule,
  exportModuleMarkdown,
  downloadText,
  copyToClipboard,
} from './lib/storage'
import { hasConfiguredApiKey } from './lib/env'
import { newId } from './lib/id'
import './App.css'

function App() {
  const { toggle, icon: themeIcon, label: themeLabel } = useTheme()
  const { toast, showToast } = useToast()

  const [profile, setProfile] = useState<TravelerProfile>(loadProfile)
  const [allMessages, setAllMessages] = useState<ChatMessage[]>(loadModuleChats)
  const [activeModule, setActiveModule] = useState<ModuleId>(loadActiveModule)
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>(loadSavedTrips)
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('workspace')
  const [errorBanner, setErrorBanner] = useState<string | null>(null)

  const settings = useSettings(() => showToast('Settings saved'))

  const handleMessagesChange = useCallback(
    (updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
      setAllMessages((prev) => (typeof updater === 'function' ? updater(prev) : updater))
    },
    [],
  )

  const chat = useModuleChat({
    profile,
    llmSettings: settings.llmSettings,
    activeModule,
    allMessages,
    onMessagesChange: handleMessagesChange,
    onNeedApiKey: () => {
      settings.openSettings()
      setMobilePanel('workspace')
    },
    onNeedDestination: () => {
      setErrorBanner('Set a destination in the Trip panel.')
      setMobilePanel('trip')
    },
  })

  useEffect(() => {
    saveProfile(profile)
  }, [profile])

  useEffect(() => {
    saveActiveModule(activeModule)
  }, [activeModule])

  const hasApiKey = hasConfiguredApiKey(settings.llmSettings)

  const messageCounts = useMemo(() => {
    const counts: Partial<Record<ModuleId, number>> = {}
    for (const msg of allMessages) {
      if (msg.content.trim()) {
        counts[msg.moduleId] = (counts[msg.moduleId] ?? 0) + 1
      }
    }
    return counts
  }, [allMessages])

  const selectModule = (id: ModuleId) => {
    setActiveModule(id)
    setMobilePanel('workspace')
  }

  const handleExport = () => {
    const mod = getModule(activeModule)
    const msgs = allMessages.filter((m) => m.moduleId === activeModule)
    const md = exportModuleMarkdown(profile, mod.label, msgs)
    const slug = `${mod.id.toLowerCase()}-${profile.destination.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'trip'}`
    downloadText(`wanderlore-${slug}.md`, md, 'text/markdown')
    showToast('Exported')
  }

  const handleSaveOffline = async () => {
    const kit = allMessages
      .filter((m) => m.moduleId === 'OFFLINE_KIT' && m.role === 'assistant')
      .map((m) => m.content)
      .join('\n\n---\n\n')
    if (!kit) return
    downloadText(`wanderlore-offline-${profile.destination.split(',')[0] || 'kit'}.txt`, kit)
    await copyToClipboard(kit)
    showToast('Offline kit saved & copied')
  }

  const handleSaveTrip = () => {
    if (!profile.destination.trim()) return
    const trip: SavedTrip = {
      id: newId(),
      name: profile.destination,
      profile: { ...profile },
      moduleChats: groupChatsByModule(allMessages),
      updatedAt: Date.now(),
    }
    const updated = [trip, ...savedTrips.filter((t) => t.name !== trip.name)].slice(0, 10)
    setSavedTrips(updated)
    saveSavedTrips(updated)
    showToast('Trip saved')
  }

  const handleLoadTrip = (trip: SavedTrip) => {
    setProfile(trip.profile)
    const msgs = Object.values(trip.moduleChats).flat() as ChatMessage[]
    setAllMessages(msgs)
    setMobilePanel('workspace')
    showToast(`Loaded ${trip.name}`)
  }

  const handleDeleteTrip = (id: string) => {
    const updated = savedTrips.filter((t) => t.id !== id)
    setSavedTrips(updated)
    saveSavedTrips(updated)
  }

  const displayError = errorBanner ?? chat.error

  return (
    <div className="app">
      <div className="app-bg" aria-hidden="true" />

      <header className="app-header">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" />
              <path d="M16 6v6M16 20v6M6 16h6M20 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="16" cy="16" r="3" fill="currentColor" />
            </svg>
          </div>
          <div>
            <h1>Wanderlore</h1>
            <p className="tagline">13 modules · one cultural companion</p>
          </div>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="btn btn--icon"
            onClick={toggle}
            title={`Theme: ${themeLabel}`}
            aria-label={`Theme: ${themeLabel}`}
          >
            {themeIcon}
          </button>
          <button type="button" className="btn btn--ghost" onClick={settings.openSettings}>
            Settings
          </button>
        </div>
      </header>

      {displayError && (
        <div className="error-banner" role="alert">
          <span>{displayError}</span>
          <button
            type="button"
            className="icon-btn"
            onClick={() => {
              setErrorBanner(null)
              chat.setError(null)
            }}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      <Toast message={toast} />

      <main className={`app-main app-main--${mobilePanel}`}>
        <aside className="panel panel--modules" aria-label="Modules">
          <ModuleNav
            activeModule={activeModule}
            onSelect={selectModule}
            messageCounts={messageCounts}
          />
        </aside>

        <div className="panel panel--workspace">
          <ModuleWorkspace
            moduleId={activeModule}
            profile={profile}
            messages={chat.moduleMessages}
            input={chat.input}
            isLoading={chat.isLoading}
            hasApiKey={hasApiKey}
            onInputChange={chat.setInput}
            onSubmit={() => void chat.sendMessage(chat.input)}
            onStop={chat.stopGeneration}
            onRunDefault={() => void chat.runDefaultPrompt()}
            onQuickAction={(p) => void chat.sendMessage(p)}
            onClear={chat.clearModuleChat}
            onExport={handleExport}
            onSaveOffline={() => void handleSaveOffline()}
            onOpenSettings={settings.openSettings}
            onOpenTrip={() => setMobilePanel('trip')}
          />
        </div>

        <aside className="panel panel--trip" aria-label="Trip profile">
          <TripForm
            profile={profile}
            onChange={setProfile}
            savedTrips={savedTrips}
            onLoadTrip={handleLoadTrip}
            onDeleteTrip={handleDeleteTrip}
            onSaveTrip={handleSaveTrip}
          />
        </aside>
      </main>

      <MobileNav active={mobilePanel} onChange={setMobilePanel} />

      <SettingsModal
        open={settings.open}
        provider={settings.draftProvider}
        apiKey={settings.draftApiKey}
        model={settings.draftModel}
        customModel={settings.draftCustomModel}
        onProviderChange={settings.handleProviderChange}
        onApiKeyChange={settings.setDraftApiKey}
        onModelChange={settings.setDraftModel}
        onCustomModelChange={settings.setDraftCustomModel}
        onClose={() => settings.setOpen(false)}
        onSave={settings.saveSettings}
      />
    </div>
  )
}

export default App
