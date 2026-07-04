import type { MobilePanel } from '../../types'

interface MobileNavProps {
  active: MobilePanel
  onChange: (panel: MobilePanel) => void
}

const TABS: { id: MobilePanel; icon: string; label: string }[] = [
  { id: 'modules', icon: '🧩', label: 'Modules' },
  { id: 'workspace', icon: '💬', label: 'Chat' },
  { id: 'trip', icon: '🧭', label: 'Trip' },
]

export function MobileNav({ active, onChange }: MobileNavProps) {
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`mobile-nav__btn${active === tab.id ? ' mobile-nav__btn--active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          <span aria-hidden="true">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
