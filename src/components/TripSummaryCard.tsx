import type { TravelerProfile } from '../types'
import {
  formatDateRange,
  getDestinationGradient,
  getTripDuration,
  profileCompleteness,
} from '../lib/tripUtils'
import { GROUP_OPTIONS } from '../types'

interface TripSummaryCardProps {
  profile: TravelerProfile
}

export function TripSummaryCard({ profile }: TripSummaryCardProps) {
  const hasDestination = Boolean(profile.destination.trim())
  const duration = getTripDuration(profile.startDate, profile.endDate)
  const dateRange = formatDateRange(profile.startDate, profile.endDate)
  const completeness = profileCompleteness(profile)
  const group = GROUP_OPTIONS.find((g) => g.value === profile.groupType)

  return (
    <div
      className="trip-hero"
      style={hasDestination ? { background: getDestinationGradient(profile.destination) } : undefined}
    >
      <div className="trip-hero__overlay">
        <p className="trip-hero__eyebrow">Your journey</p>
        <h2 className="trip-hero__destination">
          {hasDestination ? (
            <>
              <span className="trip-hero__city">
                {profile.destination.split(',')[0].trim()}
              </span>
              {profile.destination.includes(',') && (
                <span className="trip-hero__region">
                  {profile.destination.split(',').slice(1).join(',').trim()}
                </span>
              )}
            </>
          ) : (
            'Choose a destination'
          )}
        </h2>
        {dateRange && (
          <p className="trip-hero__dates">
            {dateRange}
            {duration !== null && (
              <span className="trip-hero__badge">{duration} day{duration !== 1 ? 's' : ''}</span>
            )}
          </p>
        )}
        <div className="trip-hero__meta">
          {group && (
            <span className="trip-hero__pill">
              {group.icon} {group.label}
            </span>
          )}
          <span className="trip-hero__pill">{profile.budgetLevel}</span>
          <span className="trip-hero__pill">{profile.pace} pace</span>
        </div>
        <div className="trip-hero__progress" aria-label={`Profile ${completeness}% complete`}>
          <div className="trip-hero__progress-bar" style={{ width: `${completeness}%` }} />
          <span className="trip-hero__progress-label">{completeness}% trip profile</span>
        </div>
      </div>
    </div>
  )
}
