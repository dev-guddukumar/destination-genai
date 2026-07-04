import { DESTINATION_INSPIRATIONS } from '../types'

interface DestinationPickerProps {
  value: string
  onSelect: (destination: string) => void
}

export function DestinationPicker({ value, onSelect }: DestinationPickerProps) {
  return (
    <div className="destination-picker">
      <span className="field-label">Get inspired</span>
      <div className="destination-picker__grid">
        {DESTINATION_INSPIRATIONS.map((dest) => {
          const city = dest.split(',')[0]
          const country = dest.split(',')[1]?.trim()
          return (
            <button
              key={dest}
              type="button"
              className={`dest-chip${value === dest ? ' dest-chip--active' : ''}`}
              onClick={() => onSelect(dest)}
              title={dest}
            >
              <span className="dest-chip__city">{city}</span>
              {country && <span className="dest-chip__country">{country}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
