import type { ModuleId } from '../../types'
import { getModule } from '../../config/modules'
import { canRunModule } from '../../lib/moduleUtils'

interface ModuleHeaderProps {
  moduleId: ModuleId
  destination: string
  onRunDefault: () => void
  onClear: () => void
  onExport: () => void
  hasMessages: boolean
  isLoading: boolean
  hasApiKey: boolean
}

export function ModuleHeader({
  moduleId,
  destination,
  onRunDefault,
  onClear,
  onExport,
  hasMessages,
  isLoading,
  hasApiKey,
}: ModuleHeaderProps) {
  const mod = getModule(moduleId)
  const ready = canRunModule(hasApiKey, destination)

  return (
    <header className="module-header">
      <div className="module-header__info">
        <span className="module-header__icon" aria-hidden="true">{mod.icon}</span>
        <div>
          <h2 className="module-header__title">{mod.label}</h2>
          <p className="module-header__desc">{mod.description}</p>
        </div>
      </div>
      <div className="module-header__actions">
        {!ready && (
          <span className="module-header__status module-header__status--warn">
            {!hasApiKey ? 'No API key' : 'No destination'}
          </span>
        )}
        {ready && destination && (
          <span className="module-header__dest">{destination.split(',')[0]}</span>
        )}
        <button
          type="button"
          className="btn btn--sm btn--primary"
          disabled={!ready || isLoading}
          onClick={onRunDefault}
          title={!ready ? 'Set destination and API key first' : undefined}
        >
          {isLoading ? '…' : '↻'} {isLoading ? 'Generating' : 'Generate'}
        </button>
        {hasMessages && (
          <>
            <button type="button" className="btn btn--sm btn--ghost" onClick={onExport}>
              Export
            </button>
            <button type="button" className="btn btn--sm btn--ghost" onClick={onClear}>
              Clear
            </button>
          </>
        )}
      </div>
    </header>
  )
}
