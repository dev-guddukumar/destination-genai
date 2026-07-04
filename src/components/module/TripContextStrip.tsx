import type { TravelerProfile } from '../../types'
import { formatDateRange, getTripDuration } from '../../lib/tripUtils'

interface TripContextStripProps {
  profile: TravelerProfile
  onEditTrip: () => void
}

export function TripContextStrip({ profile, onEditTrip }: TripContextStripProps) {
  if (!profile.destination.trim()) return null

  const dates = formatDateRange(profile.startDate, profile.endDate)
  const days = getTripDuration(profile.startDate, profile.endDate)
  const [city, ...rest] = profile.destination.split(',')
  const region = rest.join(',').trim()

  return (
    <div className="trip-context-strip">
      <button type="button" className="trip-context-strip__main" onClick={onEditTrip}>
        <div className="trip-context-strip__row">
          <span className="trip-context-strip__icon" aria-hidden="true">📍</span>
          <div className="trip-context-strip__dest-block">
            <span className="trip-context-strip__dest">{city.trim()}</span>
            {region && <span className="trip-context-strip__region">{region}</span>}
          </div>
        </div>
        <div className="trip-context-strip__meta-row">
          {dates && <span className="trip-context-strip__meta">{dates}</span>}
          {days !== null && <span className="trip-context-strip__pill">{days} days</span>}
          <span className="trip-context-strip__pill">{profile.budgetLevel}</span>
          <span className="trip-context-strip__pill">{profile.pace}</span>
        </div>
      </button>
    </div>
  )
}
