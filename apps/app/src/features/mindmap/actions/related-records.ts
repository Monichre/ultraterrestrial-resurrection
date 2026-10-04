'use server'

/**
 * Research Canvas suggestion action.
 *
 * Wraps the @db/postgres related-record engine (join-table connections +
 * stored-embedding pgvector similarity + temporal clustering — no LLM call
 * required) and synthesizes a deterministic research hypothesis from the
 * strongest signals so the canvas can push the inquiry forward even when
 * the OpenAI path is unavailable.
 */
import {
  getRelatedRecords,
  type RelatedSeed,
  type RelatedSuggestion,
} from '@db/postgres'

export type { RelatedSeed, RelatedSuggestion }

export type SuggestionsResult = {
  suggestions: RelatedSuggestion[]
  /** One- or two-sentence research hypothesis synthesized from the signals */
  hypothesis: string | null
}

function joinNames(names: string[], max = 3): string {
  const shown = names.slice(0, max)
  const extra = names.length - shown.length
  if (shown.length === 0) return ''
  if (shown.length === 1) return shown[0]
  const head = shown.slice(0, -1).join(', ')
  const tail = shown[shown.length - 1]
  return extra > 0
    ? `${head}, ${tail} and ${extra} other${extra === 1 ? '' : 's'}`
    : `${head} and ${tail}`
}

function synthesizeHypothesis(suggestions: RelatedSuggestion[]): string | null {
  if (!suggestions.length) return null
  const connected = suggestions.filter(s => s.reason === 'connected')
  const similar = suggestions.filter(s => s.reason === 'similar')
  const temporal = suggestions.filter(s => s.reason === 'temporal')
  const parts: string[] = []

  if (connected.length) {
    const bySeed = new Map<string, RelatedSuggestion[]>()
    for (const s of connected) bySeed.set(s.seedTitle, [...(bySeed.get(s.seedTitle) ?? []), s])
    const [seedTitle, group] = [...bySeed.entries()].sort((a, b) => b[1].length - a[1].length)[0]
    const people = group.filter(s => s.table === 'key_figures').map(s => s.title)
    const others = group.filter(s => s.table !== 'key_figures')
    if (people.length >= 2) {
      parts.push(
        `${joinNames(people)} are all documented on “${seedTitle}” — the personnel chain is the strongest unexplored thread.`,
      )
    } else if (group.length) {
      parts.push(
        `“${group[0].title}” is directly documented against “${seedTitle}” (${group[0].reasonDetail.split(' — ')[0]}).`,
      )
    }
    if (others.length && people.length >= 2) {
      parts.push(`“${others[0].title}” extends the same evidence trail.`)
    }
  }

  if (similar.length) {
    const top = similar[0]
    parts.push(
      `Independent of documentation, semantic analysis surfaces “${top.title}” (${Math.round(top.score * 100)}% affinity) — a parallel line of inquiry.`,
    )
  }

  if (temporal.length >= 2) {
    parts.push(
      `${temporal.length} further events cluster in the same time window, suggesting a wider pattern worth mapping.`,
    )
  }

  return parts.length ? parts.slice(0, 3).join(' ') : null
}

export async function getRelatedSuggestions({
  seeds,
  excludeIds = [],
  limit = 9,
}: {
  seeds: RelatedSeed[]
  excludeIds?: string[]
  limit?: number
}): Promise<SuggestionsResult> {
  if (!seeds.length) return { suggestions: [], hypothesis: null }
  try {
    const suggestions = await getRelatedRecords({ seeds, excludeIds, limit })
    return { suggestions, hypothesis: synthesizeHypothesis(suggestions) }
  } catch (error) {
    console.error('getRelatedSuggestions failed:', error)
    return { suggestions: [], hypothesis: null }
  }
}
