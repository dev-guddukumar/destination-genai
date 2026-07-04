import { useEffect, useState } from 'react'
import type { ThemeMode } from '../types'
import { applyTheme, cycleTheme, loadTheme, saveTheme, themeIcon, themeLabel } from '../lib/theme'

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(loadTheme)

  useEffect(() => {
    applyTheme(theme)
    saveTheme(theme)
  }, [theme])

  const toggle = () => setTheme((t) => cycleTheme(t))

  return { theme, setTheme, toggle, label: themeLabel(theme), icon: themeIcon(theme) }
}
