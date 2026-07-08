'use server'

/**
 * LLM enrichment for the Research Suggestions Dock hypothesis.
 *
 * The deterministic hypothesis (synthesized from join-table links, pgvector
 * affinity and temporal clustering in related-records.ts) is the FLOOR — it
 * renders instantly and stays if this call fails. This action asks a frontier
 * model to deepen it into a sharper research thesis, grounded strictly in the
 * records the suggestion engine actually surfaced. Runs through the
 * multi-provider fallback chain so no single provider outage (e.g. OpenAI
 * quota) breaks the canvas intelligence.
 */
import { generateWithFallback } from '@/lib/ai/model-fallback'
import type { RelatedSeed, RelatedSuggestion } from '@db/postgres'

export type EnrichedHypothesis = {
  hypothesis: string
  /** Which model produced it, e.g. "Claude Opus 4.8" */
  provider: string
}

const SYSTEM_PROMPT = `You are the research intelligence layer of a UFO/UAP disclosure research canvas. The user is mapping documented events, key figures, organizations, topics and testimonies as a graph.

You receive: the records currently on the canvas (seeds), the ranked unexplored records a deterministic engine surfaced (with the database signal that surfaced each), and a baseline hypothesis synthesized from those signals.

Rewrite the baseline as a sharper 2-3 sentence research thesis that tells the researcher what the strongest unexplored thread is and why. Rules:
- Ground every claim ONLY in the provided records and signals. Never introduce entities, dates or claims not present in the input.
- Name specific records (people, events, organizations) rather than speaking generically.
- Confident analytic tone, no hedging boilerplate, no preamble, no markdown, no quotation of the input.
- Output the thesis text only.`

function formatSuggestion(s: RelatedSuggestion): string {
  const parts = [
    `- "${s.title}" (${s.table}) — signal: ${s.reason} (${s.reasonDetail})`,
    `score ${s.score.toFixed(2)}, linked from seed "${s.seedTitle}"`,
  ]
  if (s.snippet) parts.push(`context: ${s.snippet.slice(0, 200)}`)
  return parts.join('; ')
}

export async function enrichHypothesis({
  seeds,
  suggestions,
  deterministicHypothesis,
  tourContext,
}: {
  seeds: Array<RelatedSeed & { title?: string }>
  suggestions: RelatedSuggestion[]
  deterministicHypothesis: string
  tourContext?: string | null
}): Promise<EnrichedHypothesis | null> {
  if (!suggestions.length || !deterministicHypothesis) return null

  const prompt = [
    tourContext ? `Active guided-tour focus: ${tourContext}` : null,
    `Records on the canvas (seeds): ${seeds
      .map((s) => `"${s.title ?? s.id}" (${s.table})`)
      .join(', ')}`,
    '',
    'Unexplored records surfaced by the deterministic engine:',
    ...suggestions.slice(0, 9).map(formatSuggestion),
    '',
    `Baseline hypothesis: ${deterministicHypothesis}`,
  ]
    .filter((line): line is string => line !== null)
    .join('\n')

  try {
    const result = await generateWithFallback({
      system: SYSTEM_PROMPT,
      prompt,
      maxOutputTokens: 300,
      timeoutMsPerTier: 8_000,
    })
    if (!result) return null

    // Sanity gate: discard degenerate outputs so the deterministic floor stays.
    const text = result.text.replace(/^["']|["']$/g, '').trim()
    if (text.length < 40 || text.length > 900) return null

    return { hypothesis: text, provider: result.provider }
  } catch (error) {
    console.error('enrichHypothesis failed:', error)
    return null
  }
}
