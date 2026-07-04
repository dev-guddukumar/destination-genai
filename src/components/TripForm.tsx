import type { TravelerProfile, BudgetLevel, PacePreference } from '../types'
import {
  GROUP_OPTIONS,
  BUDGET_OPTIONS,
  PACE_OPTIONS,
} from '../types'
import { TripSummaryCard } from './TripSummaryCard'
import { DestinationPicker } from './DestinationPicker'
import { InterestTags } from './InterestTags'
import { SegmentedControl } from './SegmentedControl'
import { SavedTripsPanel } from './SavedTripsPanel'
import type { SavedTrip } from '../types'

interface TripFormProps {
  profile: TravelerProfile
  onChange: (profile: TravelerProfile) => void
  savedTrips: SavedTrip[]
  onLoadTrip: (trip: SavedTrip) => void
  onDeleteTrip: (id: string) => void
  onSaveTrip: () => void
}

function patch<K extends keyof TravelerProfile>(
  profile: TravelerProfile,
  key: K,
  value: TravelerProfile[K],
): TravelerProfile {
  return { ...profile, [key]: value }
}

export function TripForm({
  profile,
  onChange,
  savedTrips,
  onLoadTrip,
  onDeleteTrip,
  onSaveTrip,
}: TripFormProps) {
  return (
    <div className="trip-panel">
      <TripSummaryCard profile={profile} />

      <form className="trip-form" onSubmit={(e) => e.preventDefault()}>
        <section className="form-card form-card--destination">
          <h2 className="form-card__title">
            <span className="form-card__step">1</span>
            Destination
          </h2>
          <label className="field field--destination">
            <span className="field-label">Where to?</span>
            <input
              type="text"
              className="field-input field-input--lg"
              placeholder="City, region, or country"
              value={profile.destination}
              onChange={(e) => onChange(patch(profile, 'destination', e.target.value))}
            />
          </label>
          <DestinationPicker
            value={profile.destination}
            onSelect={(dest) => onChange(patch(profile, 'destination', dest))}
          />
          <label className="field">
            <span className="field-label">Current location (optional)</span>
            <input
              type="text"
              className="field-input"
              placeholder="Where you are now"
              value={profile.currentLocation}
              onChange={(e) => onChange(patch(profile, 'currentLocation', e.target.value))}
            />
          </label>
          <div className="field-row">
            <label className="field">
              <span className="field-label">Start</span>
              <input
                type="date"
                className="field-input"
                value={profile.startDate}
                onChange={(e) => onChange(patch(profile, 'startDate', e.target.value))}
              />
            </label>
            <label className="field">
              <span className="field-label">End</span>
              <input
                type="date"
                className="field-input"
                value={profile.endDate}
                onChange={(e) => onChange(patch(profile, 'endDate', e.target.value))}
              />
            </label>
          </div>
        </section>

        <section className="form-card">
          <h2 className="form-card__title">
            <span className="form-card__step">2</span>
            Travel style
          </h2>
          <InterestTags
            interests={profile.interests}
            onChange={(interests) => onChange(patch(profile, 'interests', interests))}
          />
          <div className="field">
            <span className="field-label">Who&apos;s traveling?</span>
            <SegmentedControl
              name="Group type"
              options={GROUP_OPTIONS}
              value={profile.groupType}
              onChange={(v) => onChange(patch(profile, 'groupType', v))}
            />
          </div>
          <div className="field">
            <span className="field-label">Budget</span>
            <SegmentedControl
              name="Budget"
              options={BUDGET_OPTIONS}
              value={profile.budgetLevel}
              onChange={(v) => onChange(patch(profile, 'budgetLevel', v as BudgetLevel))}
            />
          </div>
          <div className="field">
            <span className="field-label">Pace</span>
            <SegmentedControl
              name="Pace"
              options={PACE_OPTIONS}
              value={profile.pace}
              onChange={(v) => onChange(patch(profile, 'pace', v as PacePreference))}
            />
          </div>
        </section>

        <section className="form-card">
          <h2 className="form-card__title">
            <span className="form-card__step">3</span>
            Needs & language
          </h2>
          <label className="field">
            <span className="field-label">Dietary restrictions</span>
            <input
              type="text"
              className="field-input"
              placeholder="Vegetarian, halal, gluten-free…"
              value={profile.dietaryRestrictions}
              onChange={(e) => onChange(patch(profile, 'dietaryRestrictions', e.target.value))}
            />
          </label>
          <label className="field">
            <span className="field-label">Accessibility needs</span>
            <input
              type="text"
              className="field-input"
              placeholder="Wheelchair access, mobility…"
              value={profile.accessibilityNeeds}
              onChange={(e) => onChange(patch(profile, 'accessibilityNeeds', e.target.value))}
            />
          </label>
          <label className="field">
            <span className="field-label">Languages you speak</span>
            <input
              type="text"
              className="field-input"
              placeholder="English, Spanish…"
              value={profile.languageSpoken}
              onChange={(e) => onChange(patch(profile, 'languageSpoken', e.target.value))}
            />
          </label>
        </section>
      </form>

      <SavedTripsPanel
        trips={savedTrips}
        onLoad={onLoadTrip}
        onDelete={onDeleteTrip}
        onSaveCurrent={onSaveTrip}
        canSave={Boolean(profile.destination.trim())}
      />
    </div>
  )
}
