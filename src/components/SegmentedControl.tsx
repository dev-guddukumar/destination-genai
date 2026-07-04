interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string; icon?: string }[]
  value: T
  onChange: (value: T) => void
  name: string
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  name,
}: SegmentedControlProps<T>) {
  return (
    <div className="segmented" role="radiogroup" aria-label={name}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          className={`segmented__btn${value === opt.value ? ' segmented__btn--active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.icon && <span className="segmented__icon" aria-hidden="true">{opt.icon}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  )
}
