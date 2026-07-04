import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SegmentedControl } from './SegmentedControl'

describe('SegmentedControl', () => {
  it('renders options and fires onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <SegmentedControl
        name="Budget"
        value="moderate"
        options={[
          { value: 'shoestring', label: 'Shoestring' },
          { value: 'moderate', label: 'Moderate' },
        ]}
        onChange={onChange}
      />,
    )

    expect(screen.getByRole('radio', { name: 'Moderate' })).toHaveAttribute('aria-checked', 'true')
    await user.click(screen.getByRole('radio', { name: 'Shoestring' }))
    expect(onChange).toHaveBeenCalledWith('shoestring')
  })
})
