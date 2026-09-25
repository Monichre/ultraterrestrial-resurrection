'use server'

/**
 * LLM enrichment for the Research Suggestions Dock — the "liturgy" surface.
 *
 * The deterministic hypothesis (join-table links + pgvector affinity +
 * temporal clustering, synthesized in related-records.ts) is the FLOOR: it
 * renders instantly and stays if every provider fails. This action asks a
 * frontier model to deepen it into the Ultraterrestrial liturgy —
 *   here is what we think (reading)
 *   here is what breaks (counter-reading)
 *   here is what remains open (what remains weird)
 *   here is the next trace (operational move)
 * — grounded strictly in the records the suggestion engine surfaced.
 * Vision contract: docs/plans/2026-07-08-memory-first-vision-review.md (P0.3).
 */
import { z } from 'zod'
import { generateObjectWithFallback } from '@/lib/ai/model-fallback'
import type { RelatedSeed, RelatedSuggestion } from '@db/postgres'

const LITURGY_SCHEMA = z.object({
  reading: z
    .string()
    .describe(
      'The strongest research thesis for the current canvas, 1-2 sentences, grounded only in the provided records. Confident but never claiming proof.',
    ),
  counterReading: z
    .string()
    .describe(
      'The strongest rival explanation of the same signals — prosaic, institutional, or source-artifact. 1-2 sentences. Prevents the echo chamber.',
    ),
  whatRemainsWeird: z
    .string()
    .describe(
      'The one element the conventional account explains least well, stated in a single sentence. If nothing genuinely remains weird, say so plainly.',
    ),
  nextTrace: z
    .string()
    .describe(
      'The single most decisive next research action on this canvas — specific record to add, comparison to run, or source to verify. One sentence, imperative.',
    ),
})

export type EnrichedHypothesis = z.infer<typeof LITURGY_SCHEMA> & {
  /** Which model produced it, e.g. "Claude Opus 4.8" */
  provider: string
}

const SYSTEM_PROMPT = `You are the research intelligence layer inside Ultraterrestrial, an investigative research environment for anomalous, contested, and culturally charged knowledge. The researcher is assembling documented events, key figures, organizations, topics and testimonies as a graph, and a deterministic engine has surfaced the most promising unexplored records with the database signal behind each.

Your obligations, in order: epistemic integrity, narrative coherence, atmosphere.

Operating principles:
- Provenance before prose: ground every claim ONLY in the provided records and signals. Never introduce entities, dates or claims not present in the input.
- Ambiguity is data: contradictions and gaps are research objects, name them.
- Weirdness is not proof: strangeness triggers mapping, not belief.
- Skepticism is not contempt: weigh weak evidence without sneering.
- The user is the investigator: propose and challenge, never decree.
- Say "is consistent with", "was claimed", "remains unexplained" — never "proves".

Name specific records rather than speaking generically. No preamble, no markdown, no hedging boilerplate. Tone: field anthropology meets intelligence analysis — controlled, a little uncanny, no cheap certainty.`

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
    `Baseline (deterministic) hypothesis: ${deterministicHypothesis}`,
    '',
    'Produce the four-part reading of this evidence field.',
  ]
    .filter((line): line is string => line !== null)
    .join('\n')

  try {
    const result = await generateObjectWithFallback({
      schema: LITURGY_SCHEMA,
      system: SYSTEM_PROMPT,
      prompt,
      maxOutputTokens: 500,
      timeoutMsPerTier: 10_000,
    })
    if (!result) return null

    // Sanity gate: discard degenerate output so the deterministic floor stays.
    const { reading, counterReading, whatRemainsWeird, nextTrace } = result.object
    if (reading.trim().length < 40 || reading.length > 700) return null

    return {
      reading: reading.trim(),
      counterReading: counterReading.trim(),
      whatRemainsWeird: whatRemainsWeird.trim(),
      nextTrace: nextTrace.trim(),
      provider: result.provider,
    }
  } catch (error) {
    console.error('enrichHypothesis failed:', error)
    return null
  }
}
