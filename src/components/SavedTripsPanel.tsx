import type { SavedTrip } from '../types'

interface SavedTripsPanelProps {
  trips: SavedTrip[]
  onLoad: (trip: SavedTrip) => void
  onDelete: (id: string) => void
  onSaveCurrent: () => void
  canSave: boolean
}

export function SavedTripsPanel({
  trips,
  onLoad,
  onDelete,
  onSaveCurrent,
  canSave,
}: SavedTripsPanelProps) {
  return (
    <div className="saved-trips">
      <div className="saved-trips__header">
        <h3>Saved trips</h3>
        <button
          type="button"
          className="btn btn--sm btn--ghost"
          disabled={!canSave}
          onClick={onSaveCurrent}
          title={canSave ? 'Save current trip' : 'Enter a destination first'}
        >
          + Save
        </button>
      </div>
      {trips.length === 0 ? (
        <p className="saved-trips__empty">Save trips to revisit itineraries later.</p>
      ) : (
        <ul className="saved-trips__list">
          {trips.map((trip) => (
            <li key={trip.id} className="saved-trip-item">
              <button
                type="button"
                className="saved-trip-item__load"
                onClick={() => onLoad(trip)}
              >
                <strong>{trip.name}</strong>
                <small>
                  {Object.keys(trip.moduleChats).length} modules ·{' '}
                  {new Date(trip.updatedAt).toLocaleDateString()}
                </small>
              </button>
              <button
                type="button"
                className="icon-btn saved-trip-item__delete"
                onClick={() => onDelete(trip.id)}
                aria-label={`Delete ${trip.name}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
