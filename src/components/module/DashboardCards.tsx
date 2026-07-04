import type { DashboardCard } from '../../lib/parseDashboard'

interface DashboardCardsProps {
  cards: DashboardCard[]
  destination: string
}

export function DashboardCards({ cards, destination }: DashboardCardsProps) {
  if (cards.length === 0) return null

  return (
    <div className="dashboard">
      <div className="dashboard__hero">
        <p className="dashboard__eyebrow">Daily brief</p>
        <h3 className="dashboard__title">{destination.split(',')[0]}</h3>
        <p className="dashboard__sub">Your at-a-glance trip pulse</p>
      </div>
      <div className="dashboard__grid">
        {cards.map((card) => (
          <article
            key={card.id}
            className={`dashboard-card dashboard-card--${card.variant ?? 'default'}`}
          >
            <span className="dashboard-card__icon" aria-hidden="true">
              {card.icon}
            </span>
            <div>
              <h4 className="dashboard-card__title">{card.title}</h4>
              <p className="dashboard-card__text">{card.text}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
