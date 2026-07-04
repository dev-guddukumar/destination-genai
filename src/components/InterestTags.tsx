import { INTEREST_TAGS } from '../types'
import { isInterestSelected, toggleInterest } from '../lib/tripUtils'

interface InterestTagsProps {
  interests: string
  onChange: (interests: string) => void
}

export function InterestTags({ interests, onChange }: InterestTagsProps) {
  return (
    <div className="interest-tags">
      <span className="field-label">What excites you?</span>
      <div className="interest-tags__grid">
        {INTEREST_TAGS.map((tag) => {
          const active = isInterestSelected(interests, tag)
          return (
            <button
              key={tag}
              type="button"
              className={`interest-tag${active ? ' interest-tag--active' : ''}`}
              aria-pressed={active}
              onClick={() => onChange(toggleInterest(interests, tag))}
            >
              {tag}
            </button>
          )
        })}
      </div>
    </div>
  )
}
