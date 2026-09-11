import type {AgentToolEvent} from '@/features/mindmap/hooks/use-mindmap-agent'

/**
 * Pure helpers that turn the raw `AgentToolEvent` stream from
 * `/api/disclosure/mindmap` into something a ToolCard can render.
 *
 * Result-shape tolerance mirrors `use-mindmap-agent.ts`: tool outputs arrive
 * as a bare array, `{results: [...]}`, `{records: [...]}`, or the graph-write
 * shapes `{nodes: [...]}` / `{edges: [...]}`. Nothing here is a confidence or
 * a similarity — counts only, per the evidence-tier identity.
 */

export type ToolEventStatus = AgentToolEvent['status']

export type ToolCardModel = {
  /** Stable key for React lists; derived from stream order, not invented ids. */
  key: string
  tool: string
  label: string
  status: ToolEventStatus
  /** The human-readable thing that was searched for / requested. */
  query?: string
  /** Flattened parameter pairs for the expanded view (query excluded). */
  params: Array<[string, string]>
  /** One-line outcome: "12 records", "0 matches", "Working…", error text. */
  summary: string
  /** Present only when `status === 'error'`. */
  error?: string
  /** Count of returned items when a countable result was present. */
  count?: number
}

export const TOOL_LABELS: Record<string, string> = {
  searchDatabase: 'Corpus search',
  searchExternalResources: 'External search',
  addGraphNodes: 'Place records',
  addGraphEdges: 'Draw connections',
  file_search: 'File search',
}

const NOUN_BY_TOOL: Record<string, [singular: string, plural: string]> = {
  searchDatabase: ['record', 'records'],
  searchExternalResources: ['source', 'sources'],
  addGraphNodes: ['record placed', 'records placed'],
  addGraphEdges: ['connection drawn', 'connections drawn'],
}

const QUERY_KEYS = ['search_terms', 'searchTerms', 'query', 'q', 'text'] as const

export const humanizeToolName = (tool: string): string => {
  if (TOOL_LABELS[tool]) return TOOL_LABELS[tool]
  const spaced = tool.replace(/[_-]+/g, ' ').replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase()
}

const stringifyParam = (value: unknown): string => {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) {
    return value.map((v) => (typeof v === 'string' ? v : stringifyParam(v))).join(' · ')
  }
  try {
    const json = JSON.stringify(value)
    return json.length > 120 ? `${json.slice(0, 117)}…` : json
  } catch {
    return String(value)
  }
}

export const extractQuery = (parameters?: Record<string, unknown>): string | undefined => {
  if (!parameters) return undefined
  for (const key of QUERY_KEYS) {
    const value = parameters[key]
    if (Array.isArray(value) && value.length) return stringifyParam(value)
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return undefined
}

export const extractParams = (parameters?: Record<string, unknown>): Array<[string, string]> => {
  if (!parameters) return []
  const omit = new Set<string>(QUERY_KEYS)
  return Object.entries(parameters)
    .filter(([key, value]) => !omit.has(key) && value != null && value !== '')
    .map(([key, value]) => [key, stringifyParam(value)] as [string, string])
    .filter(([, value]) => value.length > 0)
}

const arrayLength = (value: unknown): number | undefined =>
  Array.isArray(value) ? value.length : undefined

export const countResults = (result: unknown): number | undefined => {
  if (result == null) return undefined
  const direct = arrayLength(result)
  if (direct !== undefined) return direct
  if (typeof result !== 'object') return undefined
  const record = result as Record<string, unknown>
  for (const key of ['results', 'records', 'nodes', 'edges', 'items', 'matches']) {
    const n = arrayLength(record[key])
    if (n !== undefined) return n
  }
  if (typeof record.count === 'number') return record.count
  if (typeof record.added === 'number') return record.added
  return undefined
}

const pluralize = (tool: string, n: number): string => {
  const [singular, plural] = NOUN_BY_TOOL[tool] ?? ['result', 'results']
  return `${n} ${n === 1 ? singular : plural}`
}

export const summarizeOutcome = (event: AgentToolEvent): {summary: string; count?: number} => {
  if (event.status === 'processing') return {summary: 'Working…'}
  if (event.status === 'error') return {summary: event.message?.trim() || 'Tool failed'}
  const count = countResults(event.result)
  if (count === undefined) return {summary: event.message?.trim() || 'Complete'}
  if (count === 0) return {summary: '0 matches', count}
  return {summary: pluralize(event.tool, count), count}
}

export const toToolCardModel = (event: AgentToolEvent, key: string): ToolCardModel => {
  const {summary, count} = summarizeOutcome(event)
  return {
    key,
    tool: event.tool,
    label: humanizeToolName(event.tool),
    status: event.status,
    query: extractQuery(event.parameters),
    params: extractParams(event.parameters),
    summary,
    count,
    error: event.status === 'error' ? event.message?.trim() || 'Tool failed' : undefined,
  }
}

/**
 * Collapse `processing → complete | error` pairs for the same tool into one
 * card. The stream carries no stable step id, so we merge a terminal event
 * into the most recent still-processing card for that tool and keep the
 * processing event's parameters (the terminal event often omits them).
 */
export const collapseToolEvents = (events: AgentToolEvent[]): ToolCardModel[] => {
  const cards: ToolCardModel[] = []
  const openByTool = new Map<string, number>()

  events.forEach((event, index) => {
    const openIndex = openByTool.get(event.tool)
    if (event.status !== 'processing' && openIndex !== undefined) {
      const previous = cards[openIndex]
      const merged = toToolCardModel(
        {...event, parameters: event.parameters ?? undefined},
        previous.key,
      )
      cards[openIndex] = {
        ...merged,
        query: merged.query ?? previous.query,
        params: merged.params.length ? merged.params : previous.params,
      }
      openByTool.delete(event.tool)
      return
    }

    const key = `${index}:${event.tool}`
    cards.push(toToolCardModel(event, key))
    if (event.status === 'processing') openByTool.set(event.tool, cards.length - 1)
  })

  return cards
}
