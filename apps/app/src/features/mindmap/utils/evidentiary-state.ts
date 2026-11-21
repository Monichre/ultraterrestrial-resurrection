/**
 * Evidentiary state vocabulary — the "claim temperature" system that labels
 * every relationship surfaced on the research canvas. See the Voice Contract
 * in features/mindmap/CLAUDE.md: every reading must carry its epistemic tier.
 *
 * The mindmap agent route prefixes edge reasoning strings with `[State]`
 * brackets (see app/api/disclosure/mindmap/route.ts); the suggestions dock
 * mirrors that convention for its three deterministic signal types. This
 * module is the single place both producers and renderers agree on the
 * vocabulary and colors.
 */

export const EVIDENTIARY_STATES = [
  'Observed',
  'Corroborated',
  'Contested',
  'Inferred',
  'Speculative',
  'Resonant',
  'Unverified',
  'Disconfirmed',
] as const

export type EvidentiaryState = (typeof EVIDENTIARY_STATES)[number]

export const EVIDENTIARY_STATE_COLORS: Record<
  EvidentiaryState,
  { text: string; border: string; bg: string }
> = {
  Observed: {text: 'text-emerald-400', border: 'border-emerald-400/30', bg: 'bg-emerald-400/10'},
  Corroborated: {
    text: 'text-emerald-400',
    border: 'border-emerald-400/30',
    bg: 'bg-emerald-400/10',
  },
  Contested: {text: 'text-amber-400', border: 'border-amber-400/30', bg: 'bg-amber-400/10'},
  Inferred: {text: 'text-sky-400', border: 'border-sky-400/30', bg: 'bg-sky-400/10'},
  Speculative: {text: 'text-orange-400', border: 'border-orange-400/30', bg: 'bg-orange-400/10'},
  Resonant: {text: 'text-violet-400', border: 'border-violet-400/30', bg: 'bg-violet-400/10'},
  Unverified: {text: 'text-zinc-400', border: 'border-zinc-400/30', bg: 'bg-zinc-400/10'},
  Disconfirmed: {text: 'text-red-400', border: 'border-red-400/30', bg: 'bg-red-400/10'},
}

const STATE_PREFIX_RE = new RegExp(`^\\[(${EVIDENTIARY_STATES.join('|')})\\]\\s*`)

/**
 * Splits a `[State] rest of the text` string into its evidentiary state and
 * the remaining text. Returns `state: null` when the prefix is missing or
 * unrecognized — callers must not fall back to a default state/badge.
 */
export function parseEvidentiaryState(text?: string | null): {
  state: EvidentiaryState | null
  text: string
} {
  if (!text) return {state: null, text: text ?? ''}
  const match = text.match(STATE_PREFIX_RE)
  if (!match) return {state: null, text}
  return {state: match[1] as EvidentiaryState, text: text.slice(match[0].length).trim()}
}

/** Prefixes reasoning text with its evidentiary state bracket, e.g. `[Corroborated] ...`. */
export function withEvidentiaryState(state: EvidentiaryState, text: string): string {
  return `[${state}] ${text}`
}
