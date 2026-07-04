import { MODULE_GROUPS, MODULES } from '../../config/modules'
import type { ModuleId } from '../../types'

interface ModuleNavProps {
  activeModule: ModuleId
  onSelect: (id: ModuleId) => void
  messageCounts: Partial<Record<ModuleId, number>>
}

export function ModuleNav({ activeModule, onSelect, messageCounts }: ModuleNavProps) {
  return (
    <nav className="module-nav" aria-label="Travel modules">
      <p className="module-nav__heading">Modules</p>
      {MODULE_GROUPS.map((group) => {
        const items = MODULES.filter((m) => m.group === group.id)
        return (
          <div key={group.id} className="module-nav__group">
            <span className="module-nav__group-label">{group.label}</span>
            <ul className="module-nav__list">
              {items.map((mod) => {
                const count = messageCounts[mod.id] ?? 0
                return (
                  <li key={mod.id}>
                    <button
                      type="button"
                      className={`module-nav__item${activeModule === mod.id ? ' module-nav__item--active' : ''}`}
                      onClick={() => onSelect(mod.id)}
                      aria-current={activeModule === mod.id ? 'page' : undefined}
                    >
                      <span className="module-nav__icon" aria-hidden="true">{mod.icon}</span>
                      <span className="module-nav__label">{mod.label}</span>
                      {count > 0 && (
                        <span className="module-nav__badge" aria-label={`${count} messages`}>
                          {count}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </nav>
  )
}
