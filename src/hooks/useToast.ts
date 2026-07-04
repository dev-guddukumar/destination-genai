import { useCallback, useEffect, useRef, useState } from 'react'

export function useToast(durationMs = 2800) {
  const [toast, setToast] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const showToast = useCallback(
    (message: string) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      setToast(message)
      timerRef.current = setTimeout(() => setToast(null), durationMs)
    },
    [durationMs],
  )

  return { toast, showToast }
}
