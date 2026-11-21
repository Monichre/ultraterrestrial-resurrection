// Pure parsing for .specstory/history session files. No filesystem access
// here — the route reads files and passes text/metadata in, so every rule is
// unit-testable with an injected `now`.

import type {AgentKind, Recency, SessionActivity} from './types'

export const ACTIVE_MS = 15 * 60 * 1000
export const RECENT_MS = 24 * 60 * 60 * 1000

// e.g. 2026-10-01_14-42-10Z-pigtail-again.md
const FILENAME_RE = /^(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})Z(?:-(.*))?\.md$/

export function parseSessionFilename(name: string): {startedAt: string | null; title: string} {
  const m = FILENAME_RE.exec(name)
  if (!m) return {startedAt: null, title: name.replace(/\.md$/, '')}
  const [, y, mo, d, h, mi, s, slug] = m
  const startedAt = new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s)).toISOString()
  const title = slug ? slug.replace(/-+/g, ' ').trim() : 'untitled session'
  return {startedAt, title}
}

const AGENT_HEADERS: [RegExp, AgentKind][] = [
  [/^claude code$/i, 'Claude Code'],
  [/^codex cli$/i, 'Codex CLI'],
  [/^cursor( ide)?$/i, 'Cursor IDE'],
  [/^factory droid cli$/i, 'Factory Droid'],
  [/^antigravity cli$/i, 'Antigravity'],
  [/^pi$/i, 'Pi'],
]

/** Reads the `<!-- X Session …-->` header SpecStory writes. Unknown is never guessed. */
export function parseAgentKind(head: string): AgentKind {
  const m = /<!--\s*([A-Za-z][A-Za-z ]*?)\s+Session\b/.exec(head)
  if (!m) return 'Unknown'
  const label = m[1].trim()
  for (const [re, kind] of AGENT_HEADERS) if (re.test(label)) return kind
  return 'Unknown'
}

/**
 * Ticket IDs named in the FIRST user prompt only. Scanning the whole
 * transcript would link every session that ever read TODO.md to every ticket.
 */
export function extractPromptTickets(head: string): string[] {
  const start = head.indexOf('_**User')
  if (start === -1) return []
  const rest = head.slice(start)
  const end = rest.indexOf('\n---')
  const prompt = end === -1 ? rest : rest.slice(0, end)
  const ids = prompt.match(/\bT-\d{3}\b/g) ?? []
  return [...new Set(ids)]
}

export function classifyRecency(lastWriteMs: number, nowMs: number): Recency {
  const age = nowMs - lastWriteMs
  if (age < ACTIVE_MS) return 'active'
  if (age < RECENT_MS) return 'recent'
  return 'dormant'
}

export function buildSession(
  name: string,
  head: string,
  mtimeMs: number,
  nowMs: number,
): SessionActivity {
  const {startedAt, title} = parseSessionFilename(name)
  return {
    id: name,
    agent: parseAgentKind(head),
    title,
    startedAt,
    lastWriteAt: new Date(mtimeMs).toISOString(),
    recency: classifyRecency(mtimeMs, nowMs),
    tickets: extractPromptTickets(head),
  }
}

/** Most recent session per ticket id (sessions arrive newest first). */
export function latestSessionByTicket(sessions: SessionActivity[]): Map<string, SessionActivity> {
  const byTicket = new Map<string, SessionActivity>()
  for (const s of sessions) {
    for (const t of s.tickets) if (!byTicket.has(t)) byTicket.set(t, s)
  }
  return byTicket
}

export const AGENT_MONOGRAM: Record<AgentKind, string> = {
  'Claude Code': 'CC',
  'Codex CLI': 'CX',
  'Cursor IDE': 'CU',
  'Factory Droid': 'FD',
  Antigravity: 'AG',
  Pi: 'PI',
  Unknown: '??',
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function ordinal(n: number): string {
  const v = n % 100
  if (v >= 11 && v <= 13) return `${n}th`
  const last = n % 10
  return `${n}${last === 1 ? 'st' : last === 2 ? 'nd' : last === 3 ? 'rd' : 'th'}`
}

/** Repo date format: "October 1st, 2026". */
export function formatLongDate(iso: string): string {
  const d = new Date(iso)
  return `${MONTHS[d.getMonth()]} ${ordinal(d.getDate())}, ${d.getFullYear()}`
}

/** Compact relative age: 4m, 3h, 36d. */
export function formatAge(iso: string, nowMs: number): string {
  const sec = Math.max(0, Math.round((nowMs - new Date(iso).getTime()) / 1000))
  if (sec < 60) return 'now'
  const min = Math.round(sec / 60)
  if (min < 60) return `${min}m`
  const hr = Math.round(min / 60)
  if (hr < 48) return `${hr}h`
  return `${Math.round(hr / 24)}d`
}
