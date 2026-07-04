import type { ModuleId, TravelerProfile } from '../../types'
import { getModule } from '../../config/modules'
import { canRunModule } from '../../lib/moduleUtils'
import { formatDateRange, getTripDuration, profileCompleteness } from '../../lib/tripUtils'

interface ModuleWelcomeProps {
  moduleId: ModuleId
  profile: TravelerProfile
  hasApiKey: boolean
  isLoading: boolean
  onRunDefault: () => void
  onQuickAction: (prompt: string) => void
  onOpenTrip: () => void
  onOpenSettings: () => void
}

export function ModuleWelcome({
  moduleId,
  profile,
  hasApiKey,
  isLoading,
  onRunDefault,
  onQuickAction,
  onOpenTrip,
  onOpenSettings,
}: ModuleWelcomeProps) {
  const mod = getModule(moduleId)
  const ready = canRunModule(hasApiKey, profile.destination)
  const completeness = profileCompleteness(profile)
  const dateRange = formatDateRange(profile.startDate, profile.endDate)
  const duration = getTripDuration(profile.startDate, profile.endDate)

  return (
    <div className="module-welcome">
      {moduleId === 'DASHBOARD' && (
        <div className="module-welcome__dashboard-preview">
          <div className="dashboard-preview-card dashboard-preview-card--highlight">
            <span>☀️</span>
            <div>
              <strong>Today&apos;s highlight</strong>
              <p>Weather-adjusted pick from your itinerary</p>
            </div>
          </div>
          <div className="dashboard-preview-card dashboard-preview-card--budget">
            <span>💰</span>
            <div>
              <strong>Budget pulse</strong>
              <p>Spending vs. {profile.budgetLevel} budget</p>
            </div>
          </div>
          <div className="dashboard-preview-card">
            <span>💡</span>
            <div>
              <strong>Cultural tip</strong>
              <p>Daily insight from local culture</p>
            </div>
          </div>
        </div>
      )}

      {!hasApiKey && (
        <div className="status-banner status-banner--error">
          <span aria-hidden="true">🔑</span>
          <div>
            <strong>API key required</strong>
            <p>
              Add your key in{' '}
              <button type="button" className="link-btn" onClick={onOpenSettings}>
                Settings
              </button>{' '}
              or set <code>VITE_OPENROUTER_API_KEY</code> in <code>.env.local</code>
            </p>
          </div>
        </div>
      )}

      {hasApiKey && !profile.destination.trim() && (
        <div className="status-banner status-banner--warn">
          <span aria-hidden="true">📍</span>
          <div>
            <strong>Destination needed</strong>
            <p>
              <button type="button" className="link-btn" onClick={onOpenTrip}>
                Set your destination
              </button>{' '}
              in the Trip panel to activate all modules.
            </p>
          </div>
        </div>
      )}

      {ready && (
        <div className="module-welcome__trip-chip">
          <span className="module-welcome__trip-dest">{profile.destination}</span>
          <div className="module-welcome__trip-meta-row">
            {dateRange && <span className="module-welcome__trip-meta">{dateRange}</span>}
            {duration !== null && (
              <span className="module-welcome__trip-meta">{duration} days</span>
            )}
            <span className="module-welcome__trip-meta">{profile.groupType}</span>
            <span className="module-welcome__trip-meta">{profile.budgetLevel}</span>
          </div>
          <div className="module-welcome__progress">
            <div style={{ width: `${completeness}%` }} />
          </div>
        </div>
      )}

      <button
        type="button"
        className="btn btn--primary btn--generate"
        disabled={!ready || isLoading}
        onClick={onRunDefault}
      >
        <span className="btn--generate__icon">{mod.icon}</span>
        {isLoading ? 'Generating…' : `Generate ${mod.label}`}
      </button>

      {mod.quickActions.length > 0 && (
        <div className="quick-actions">
          <span className="quick-actions__label">Quick actions</span>
          <div className="quick-actions__grid">
            {mod.quickActions.map((action) => (
              <button
                key={action.label}
                type="button"
                className="quick-action"
                disabled={!ready || isLoading}
                onClick={() => onQuickAction(action.prompt)}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
