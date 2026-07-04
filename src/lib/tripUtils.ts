import type { TravelerProfile } from '../types'

export function getTripDuration(startDate: string, endDate: string): number | null {
  if (!startDate || !endDate) return null
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null
  const diff = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1
  return diff > 0 ? diff : null
}

export function formatDateRange(startDate: string, endDate: string): string | null {
  if (!startDate && !endDate) return null
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  if (startDate && endDate) return `${fmt(startDate)} – ${fmt(endDate)}`
  if (startDate) return `From ${fmt(startDate)}`
  return `Until ${fmt(endDate)}`
}

export function getInterestList(interests: string): string[] {
  return interests
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function toggleInterest(interests: string, tag: string): string {
  const list = getInterestList(interests)
  const lower = tag.toLowerCase()
  const exists = list.some((i) => i.toLowerCase() === lower)
  const next = exists ? list.filter((i) => i.toLowerCase() !== lower) : [...list, tag]
  return next.join(', ')
}

export function isInterestSelected(interests: string, tag: string): boolean {
  return getInterestList(interests).some((i) => i.toLowerCase() === tag.toLowerCase())
}

export function getDestinationGradient(destination: string): string {
  const hash = destination.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const hues = [18, 145, 210, 280, 35, 170]
  const h1 = hues[hash % hues.length]
  const h2 = hues[(hash + 2) % hues.length]
  return `linear-gradient(135deg, hsl(${h1} 45% 42%) 0%, hsl(${h2} 38% 28%) 100%)`
}

export function profileCompleteness(profile: TravelerProfile): number {
  let score = 0
  if (profile.destination.trim()) score += 25
  if (profile.startDate && profile.endDate) score += 20
  if (profile.interests.trim()) score += 20
  if (profile.dietaryRestrictions.trim()) score += 5
  if (profile.accessibilityNeeds.trim()) score += 5
  if (profile.languageSpoken.trim()) score += 5
  score += 20
  return Math.min(100, score)
}
