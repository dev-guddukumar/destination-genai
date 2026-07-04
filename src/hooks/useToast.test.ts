import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useToast } from './useToast'

describe('useToast', () => {
  it('shows and clears toast', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useToast(1000))

    act(() => result.current.showToast('Saved'))
    expect(result.current.toast).toBe('Saved')

    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.toast).toBeNull()

    vi.useRealTimers()
  })
})
