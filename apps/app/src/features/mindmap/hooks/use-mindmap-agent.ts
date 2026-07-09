'use client'

import {useCallback, useRef, useState} from 'react'

export type AgentToolEvent = {
  tool: string
  status: 'processing' | 'complete' | 'error'
  parameters?: Record<string, unknown>
  result?: unknown
  message?: string
}

export type AgentSearchResult = {
  table?: string
  searchTerms?: string[]
  records: Record<string, unknown>[]
}

export type AgentExternalResult = {
  query?: string
  results: Record<string, unknown>[]
}

export type AgentGraphNodePayload = {
  id: string
  type?: string
  label?: string
  data?: Record<string, unknown>
  position?: {
    x: number
    y: number
  }
}

export type AgentGraphEdgePayload = {
  id?: string
  source: string
  target: string
  type?: string
  label?: string
  reasoning?: string
  data?: Record<string, unknown>
}

export type AgentGraphStatePayload = {
  nodeCount?: number
  edgeCount?: number
  activeNodeId?: string | null
  activeView?: string | null
  nodes?: Array<{
    id: string
    type?: string
    label?: string
    table?: string
  }>
  edges?: Array<{
    source: string
    target: string
    label?: string
    reasoning?: string
  }>
}

export type AgentRunResult = {
  analysis: string
  toolEvents: AgentToolEvent[]
  search?: AgentSearchResult
  external?: AgentExternalResult
  graphWrites?: {
    nodes: AgentGraphNodePayload[]
    edges: AgentGraphEdgePayload[]
  }
}

type RunAgentQueryParams = {
  message: string
  contextRules?: string
  researchFocus?: string
  graphState?: AgentGraphStatePayload
  threadId?: string | null
}

type AgentStatus = 'idle' | 'streaming' | 'complete' | 'error'

const getResultArray = (result: unknown, key: string): unknown[] => {
  if (Array.isArray(result)) {
    return result
  }

  if (!result || typeof result !== 'object') {
    return []
  }

  const value = (result as Record<string, unknown>)[key]
  return Array.isArray(value) ? value : []
}

const toGraphNodes = (result: unknown): AgentGraphNodePayload[] =>
  getResultArray(result, 'nodes')
    .map((candidate) => {
      if (!candidate || typeof candidate !== 'object') return null

      const node = candidate as Record<string, unknown>
      const id = typeof node.id === 'string' ? node.id.trim() : ''
      if (!id) return null

      const position =
        node.position && typeof node.position === 'object'
          ? (node.position as Record<string, unknown>)
          : undefined

      const x = typeof position?.x === 'number' ? position.x : undefined
      const y = typeof position?.y === 'number' ? position.y : undefined

      return {
        id,
        type: typeof node.type === 'string' ? node.type : undefined,
        label: typeof node.label === 'string' ? node.label : undefined,
        data: node.data && typeof node.data === 'object' ? (node.data as Record<string, unknown>) : undefined,
        ...(typeof x === 'number' && typeof y === 'number' ? {position: {x, y}} : {}),
      } satisfies AgentGraphNodePayload
    })
    .filter((node): node is AgentGraphNodePayload => Boolean(node))

const toGraphEdges = (result: unknown): AgentGraphEdgePayload[] =>
  getResultArray(result, 'edges')
    .map((candidate) => {
      if (!candidate || typeof candidate !== 'object') return null

      const edge = candidate as Record<string, unknown>
      const source = typeof edge.source === 'string' ? edge.source.trim() : ''
      const target = typeof edge.target === 'string' ? edge.target.trim() : ''

      if (!source || !target) return null

      return {
        id: typeof edge.id === 'string' && edge.id.trim() ? edge.id.trim() : undefined,
        source,
        target,
        type: typeof edge.type === 'string' ? edge.type : undefined,
        label: typeof edge.label === 'string' ? edge.label : undefined,
        reasoning: typeof edge.reasoning === 'string' ? edge.reasoning : undefined,
        data: edge.data && typeof edge.data === 'object' ? (edge.data as Record<string, unknown>) : undefined,
      } satisfies AgentGraphEdgePayload
    })
    .filter((edge): edge is AgentGraphEdgePayload => Boolean(edge))

export function useMindMapAgent() {
  const [status, setStatus] = useState<AgentStatus>('idle')
  const [analysis, setAnalysis] = useState('')
  const [toolEvents, setToolEvents] = useState<AgentToolEvent[]>([])
  const [error, setError] = useState<string | null>(null)

  const pendingSearchParams = useRef<{table?: string; searchTerms?: string[]} | null>(null)
  const pendingExternalParams = useRef<{query?: string} | null>(null)

  const runAgentQuery = useCallback(
    async ({
      message,
      contextRules,
      researchFocus,
      graphState,
      threadId = null,
    }: RunAgentQueryParams): Promise<AgentRunResult> => {
      setStatus('streaming')
      setAnalysis('')
      setToolEvents([])
      setError(null)
      pendingSearchParams.current = null
      pendingExternalParams.current = null

      const response = await fetch('/api/disclosure/mindmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId,
          message,
          contextRules,
          researchFocus,
          graphState,
        }),
      })

      if (!response.ok) {
        const errorMessage = `HTTP error! status: ${response.status}`
        setStatus('error')
        setError(errorMessage)
        throw new Error(errorMessage)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        const errorMessage = 'No response body reader available'
        setStatus('error')
        setError(errorMessage)
        throw new Error(errorMessage)
      }

      const decoder = new TextDecoder()
      let aggregatedAnalysis = ''
      let aggregatedToolEvents: AgentToolEvent[] = []
      let searchResult: AgentSearchResult | undefined
      let externalResult: AgentExternalResult | undefined
      const graphNodeWrites: AgentGraphNodePayload[] = []
      const graphEdgeWrites: AgentGraphEdgePayload[] = []

      try {
        while (true) {
          const {done, value} = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, {stream: true})
          const lines = chunk.split('\n').filter((line) => line.trim())

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue

            const data = line.slice(6).trim()
            if (!data || data === '[DONE]') continue

            // Parse failures only skip the chunk; agent-reported errors must
            // propagate. Keeping JSON.parse in its own try prevents the
            // stream-error throw below from being swallowed by the skip path
            // (which left the canvas node on "AI is thinking..." forever).
            let parsed: any
            try {
              parsed = JSON.parse(data)
            } catch {
              console.debug('Skipped chunk:', data)
              continue
            }

            if (parsed.error) {
              const errorMessage = parsed.message || 'Agent stream error'
              setStatus('error')
              setError(errorMessage)
              throw new Error(errorMessage)
            }

            try {

              if (parsed.content) {
                aggregatedAnalysis += parsed.content
                setAnalysis(aggregatedAnalysis)
              }

              if (parsed.done) {
                setStatus('complete')
              }

              if (parsed.data) {
                const toolData = parsed.data as AgentToolEvent
                aggregatedToolEvents = [...aggregatedToolEvents, toolData]
                setToolEvents(aggregatedToolEvents)

                if (toolData.tool === 'searchDatabase') {
                  if (toolData.status === 'processing') {
                    const params = toolData.parameters as
                      | {table?: string; search_terms?: string[]}
                      | undefined
                    pendingSearchParams.current = {
                      table: params?.table,
                      searchTerms: params?.search_terms,
                    }
                  }

                  if (toolData.status === 'complete') {
                    const result = toolData.result as
                      | Record<string, unknown>
                      | Record<string, unknown>[]
                      | undefined
                    const records = Array.isArray(result)
                      ? result
                      : Array.isArray(result?.records)
                        ? (result.records as Record<string, unknown>[])
                        : []

                    searchResult = {
                      table: pendingSearchParams.current?.table,
                      searchTerms: pendingSearchParams.current?.searchTerms,
                      records,
                    }
                  }
                }

                if (toolData.tool === 'searchExternalResources') {
                  if (toolData.status === 'processing') {
                    const params = toolData.parameters as {query?: string} | undefined
                    pendingExternalParams.current = {
                      query: params?.query,
                    }
                  }

                  if (toolData.status === 'complete') {
                    const result = toolData.result as
                      | Record<string, unknown>
                      | Record<string, unknown>[]
                      | undefined
                    const results = Array.isArray(result?.results)
                      ? (result.results as Record<string, unknown>[])
                      : Array.isArray(result)
                        ? result
                        : []

                    externalResult = {
                      query: pendingExternalParams.current?.query,
                      results,
                    }
                  }
                }

                if (toolData.tool === 'addGraphNodes' && toolData.status === 'complete') {
                  graphNodeWrites.push(...toGraphNodes(toolData.result))
                }

                if (toolData.tool === 'addGraphEdges' && toolData.status === 'complete') {
                  graphEdgeWrites.push(...toGraphEdges(toolData.result))
                }
              }
            } catch {
              console.debug('Skipped chunk:', data)
            }
          }
        }
      } finally {
        reader.releaseLock()
      }

      setStatus('complete')

      const dedupedNodes = Array.from(
        new Map(graphNodeWrites.map((node) => [node.id, node])).values()
      )
      const dedupedEdges = Array.from(
        new Map(
          graphEdgeWrites.map((edge, index) => [
            edge.id || `${edge.source}:${edge.target}:${edge.label || edge.reasoning || index}`,
            edge,
          ])
        ).values()
      )

      return {
        analysis: aggregatedAnalysis,
        toolEvents: aggregatedToolEvents,
        search: searchResult,
        external: externalResult,
        graphWrites:
          dedupedNodes.length || dedupedEdges.length
            ? {
                nodes: dedupedNodes,
                edges: dedupedEdges,
              }
            : undefined,
      }
    },
    []
  )

  return {
    status,
    analysis,
    toolEvents,
    error,
    runAgentQuery,
  }
}
