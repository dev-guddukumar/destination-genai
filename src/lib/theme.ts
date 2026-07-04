import type { ThemeMode } from '../types'

const THEME_KEY = 'wanderlore:theme'

export function loadTheme(): ThemeMode {
  try {
    const raw = localStorage.getItem(THEME_KEY)
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw
  } catch {
    /* ignore */
  }
  return 'system'
}

export function saveTheme(mode: ThemeMode): void {
  localStorage.setItem(THEME_KEY, mode)
}

export function applyTheme(mode: ThemeMode): void {
  const root = document.documentElement
  if (mode === 'system') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', mode)
  }
}

export function cycleTheme(current: ThemeMode): ThemeMode {
  const order: ThemeMode[] = ['light', 'dark', 'system']
  const idx = order.indexOf(current)
  return order[(idx + 1) % order.length]
}

export function themeLabel(mode: ThemeMode): string {
  if (mode === 'light') return 'Light'
  if (mode === 'dark') return 'Dark'
  return 'Auto'
}

export function themeIcon(mode: ThemeMode): string {
  if (mode === 'light') return '☀️'
  if (mode === 'dark') return '🌙'
  return '◐'
}
