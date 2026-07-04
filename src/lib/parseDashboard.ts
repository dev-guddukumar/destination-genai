export interface DashboardCard {
  id: string
  icon: string
  title: string
  text: string
  variant?: 'default' | 'budget' | 'safety' | 'highlight'
}

const CARD_META: { match: RegExp; icon: string; title: string; variant: DashboardCard['variant'] }[] = [
  { match: /weather|today|highlight|forecast/i, icon: '☀️', title: "Today's highlight", variant: 'highlight' },
  { match: /budget|cost|spend|%/i, icon: '💰', title: 'Budget status', variant: 'budget' },
  { match: /tip|culture|insider|local/i, icon: '💡', title: 'Cultural tip', variant: 'default' },
  { match: /safety|scam|advisory|health|emergency/i, icon: '⚠️', title: 'Safety note', variant: 'safety' },
  { match: /next|upcoming|itinerary|stop|time/i, icon: '📍', title: 'Up next', variant: 'default' },
]

function stripMarkdown(line: string): string {
  return line
    .replace(/^[\s#>*-]+/, '')
    .replace(/^\d+[.)]\s*/, '')
    .replace(/\*\*([^*]+)\*\*:?\s*/g, '$1: ')
    .trim()
}

export function parseDashboardCards(content: string): DashboardCard[] {
  const lines = content
    .split('\n')
    .map(stripMarkdown)
    .filter((l) => l.length > 8)

  if (lines.length === 0) return []

  const cards: DashboardCard[] = []
  const used = new Set<number>()

  for (const meta of CARD_META) {
    const idx = lines.findIndex((l, i) => !used.has(i) && meta.match.test(l))
    if (idx >= 0) {
      used.add(idx)
      cards.push({
        id: meta.title,
        icon: meta.icon,
        title: meta.title,
        text: lines[idx],
        variant: meta.variant,
      })
    }
  }

  lines.forEach((line, i) => {
    if (!used.has(i) && cards.length < 6) {
      cards.push({
        id: `extra-${i}`,
        icon: '✦',
        title: `Update ${cards.length + 1}`,
        text: line,
        variant: 'default',
      })
    }
  })

  return cards.slice(0, 5)
}

export function hasDashboardStructure(content: string): boolean {
  return parseDashboardCards(content).length >= 2
}
