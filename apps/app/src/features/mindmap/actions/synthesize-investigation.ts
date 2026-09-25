'use server'

/**
 * LLM synthesis for the "Synthesize Investigation" canvas action.
 *
 * Turns whatever the researcher has assembled on the canvas — record nodes
 * plus the edges drawn between them — into the canonical Ultraterrestrial
 * research narrative format (docs/PLANS/2026-07-08-memory-first-vision-capture.md
 * §15): signal, evidentiary ground, sequence, field map, contradictions,
 * five competing readings, evidentiary weight, open questions, next traces.
 *
 * Unlike the Research Suggestions Dock's hypothesis (which proposes what to
 * add next), this narrates what is *already* on the canvas. Grounded
 * strictly in the provided nodes/edges — no outside lookup, no invented
 * entities. Returns null on any failure; the canvas itself is the
 * fallback, never a broken panel.
 * Vision contract: docs/PLANS/2026-07-08-memory-first-vision-review.md (P1.3).
 */
import { z } from 'zod'
import { generateObjectWithFallback } from '@/lib/ai/model-fallback'

const READINGS_SCHEMA = z.object({
  prosaic: z
    .string()
    .describe(
      'The most ordinary, non-anomalous explanation that fits the assembled evidence. 1-2 sentences.',
    ),
  institutional: z
    .string()
    .describe(
      'How institutions, agencies, or official channels account for or responded to this material. 1-2 sentences.',
    ),
  psychologicalSocial: z
    .string()
    .describe(
      'Perceptual, psychological, or socially-contagious readings of the material. 1-2 sentences.',
    ),
  anomalous: z
    .string()
    .describe(
      'The reading that takes the anomalous claim seriously on its own terms, without claiming proof. 1-2 sentences.',
    ),
  mythopoetic: z
    .string()
    .describe(
      'Symbolic, folkloric, or archetypal resonance the material participates in — labeled as resonance, never as evidence. 1-2 sentences.',
    ),
})

const SYNTHESIS_SCHEMA = z.object({
  signal: z
    .string()
    .describe(
      'What initiated this investigation — the cluster of nodes and connections the researcher assembled. 1-2 sentences.',
    ),
  evidentiaryGround: z.object({
    strongest: z
      .string()
      .describe('The strongest available records on the canvas, named specifically.'),
    weakest: z
      .string()
      .describe('The weakest or most unstable records on the canvas, named specifically.'),
  }),
  sequence: z
    .array(z.string())
    .describe('Chronological beats reconstructed from the canvas, earliest first. One sentence each.'),
  fieldMap: z
    .string()
    .describe('Which entities/records recur or connect across the canvas, and how. 2-4 sentences.'),
  contradictions: z
    .array(z.string())
    .describe('Where the assembled material conflicts or breaks down. One sentence each; empty array if none.'),
  readings: READINGS_SCHEMA,
  evidentiaryWeight: z
    .string()
    .describe(
      'Which readings are best and least supported by the assembled canvas, and why. 2-3 sentences.',
    ),
  openQuestions: z
    .array(z.string())
    .describe('What remains unresolved. One sentence each.'),
  nextTraces: z
    .array(z.string())
    .describe('Concrete next research actions the investigator should take. One sentence each, imperative mood.'),
})

export type InvestigationSynthesis = z.infer<typeof SYNTHESIS_SCHEMA>

export type SynthesizeInvestigationResult = {
  synthesis: InvestigationSynthesis
  /** Which model produced it, e.g. "Claude Opus 4.8" */
  provider: string
}

export type SynthesisNode = { id: string; table: string; title: string }
export type SynthesisEdge = { source: string; target: string; label?: string; reasoning?: string }

const SYSTEM_PROMPT = `You are the research intelligence layer inside Ultraterrestrial, an investigative research environment for anomalous, contested, and culturally charged knowledge. The researcher has assembled a set of records (events, key figures, organizations, topics, testimonies, documents) and the connections between them on a research canvas. Your task is to synthesize that canvas into a structured Ultraterrestrial research narrative — not a general summary, and not new research.

Your obligations, in order: epistemic integrity, narrative coherence, atmosphere.

Operating principles:
- Provenance before prose: ground every claim ONLY in the provided nodes and edges. Never introduce entities, dates, or claims not present in the input. If the canvas is thin, say so plainly rather than inventing texture.
- Ambiguity is data: contradictions and gaps are research objects — name them, don't smooth them over.
- Weirdness is not proof: strangeness triggers deeper mapping, not premature belief.
- Skepticism is not contempt: weigh weak evidence without sneering at witnesses or records.
- Myth is context, not confirmation: symbolic resonance illuminates meaning but cannot validate factual claims — label it as resonance.
- Pair every reading with its counter-reading. Never claim closure the evidence doesn't warrant.
- Say "is consistent with", "was claimed", "remains unexplained" — never "proves".
- The user is the investigator: propose and challenge, never decree.

Follow the liturgy: what we know -> what we think -> what echoes -> what breaks -> what remains open -> next trace. Name specific records by their titles rather than speaking generically. Never output internal identifiers (rec_..., doc_...) — they are plumbing, not evidence. No preamble, no markdown, no hedging boilerplate. Tone: field anthropology meets intelligence analysis — controlled, a little uncanny, no cheap certainty.`

function formatNode(n: SynthesisNode): string {
  return `- "${n.title}" (${n.table})`
}

// Edges are described by record TITLE so the model never sees raw ids —
// verified live 2026-07-08: given ids, Gemini echoed them into the prose.
function formatEdge(e: SynthesisEdge, titleById: Map<string, string>): string {
  const name = (id: string) => titleById.get(id) ?? id
  const parts = [`- "${name(e.source)}" -> "${name(e.target)}"`]
  if (e.label) parts.push(`label: ${e.label}`)
  if (e.reasoning) parts.push(`reasoning: ${e.reasoning}`)
  return parts.join('; ')
}

export async function synthesizeInvestigation({
  nodes,
  edges,
  focus,
}: {
  nodes: SynthesisNode[]
  edges: SynthesisEdge[]
  focus?: string
}): Promise<SynthesizeInvestigationResult | null> {
  if (nodes.length < 2) return null

  const titleById = new Map(nodes.map((n) => [n.id, n.title]))

  const prompt = [
    focus ? `Researcher-stated focus: ${focus}` : null,
    `Records assembled on the canvas (${nodes.length}):`,
    ...nodes.map(formatNode),
    '',
    edges.length
      ? `Connections drawn between them (${edges.length}):`
      : 'No explicit connections have been drawn between these records yet.',
    ...edges.map((e) => formatEdge(e, titleById)),
    '',
    'Produce the full Ultraterrestrial research synthesis of this evidence field: signal, evidentiary ground, sequence, field map, contradictions, the five readings (prosaic, institutional, psychological-social, anomalous, mythopoetic), evidentiary weight, open questions, and next traces.',
  ]
    .filter((line): line is string => line !== null)
    .join('\n')

  try {
    const result = await generateObjectWithFallback({
      schema: SYNTHESIS_SCHEMA,
      system: SYSTEM_PROMPT,
      prompt,
      maxOutputTokens: 1800,
      timeoutMsPerTier: 25_000,
    })
    if (!result) return null

    // Sanity gate: discard degenerate output so a broken panel never renders.
    if (!result.object.signal || result.object.signal.trim().length < 20) return null

    return { synthesis: result.object, provider: result.provider }
  } catch (error) {
    console.error('synthesizeInvestigation failed:', error)
    return null
  }
}
