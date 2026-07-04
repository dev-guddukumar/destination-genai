import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Toast } from './shared/Toast'

describe('Toast', () => {
  it('renders message when provided', () => {
    render(<Toast message="Trip saved" />)
    expect(screen.getByRole('status')).toHaveTextContent('Trip saved')
  })

  it('renders nothing when message is null', () => {
    const { container } = render(<Toast message={null} />)
    expect(container).toBeEmptyDOMElement()
  })
})
