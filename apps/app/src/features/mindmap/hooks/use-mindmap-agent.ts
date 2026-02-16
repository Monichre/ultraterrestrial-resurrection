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
  records: any[]
}

export type AgentExternalResult = {
  query?: string
  results: any[]
}

export type AgentRunResult = {
  analysis: string
  toolEvents: AgentToolEvent[]
  search?: AgentSearchResult
  external?: AgentExternalResult
}

type RunAgentQueryParams = {
  message: string
  contextRules?: string
  threadId?: string | null
}

type AgentStatus = 'idle' | 'streaming' | 'complete' | 'error'

export function useMindMapAgent() {
  const [status, setStatus] = useState<AgentStatus>('idle')
  const [analysis, setAnalysis] = useState('')
  const [toolEvents, setToolEvents] = useState<AgentToolEvent[]>([])
  const [error, setError] = useState<string | null>(null)

  const pendingSearchParams = useRef<{table?: string; searchTerms?: string[]} | null>(null)
  const pendingExternalParams = useRef<{query?: string} | null>(null)

  const runAgentQuery = useCallback(
    async ({message, contextRules, threadId = null}: RunAgentQueryParams): Promise<AgentRunResult> => {
      setStatus('streaming')
      setAnalysis('')
      setToolEvents([])
      setError(null)
      pendingSearchParams.current = null
      pendingExternalParams.current = null

      const prompt = contextRules
        ? `${message}\n\nContextual Rules:\n${contextRules}`
        : message

      const response = await fetch('/api/disclosure/mindmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId,
          message: prompt,
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

            try {
              const parsed = JSON.parse(data)

              if (parsed.error) {
                const errorMessage = parsed.message || 'Agent stream error'
                setStatus('error')
                setError(errorMessage)
                throw new Error(errorMessage)
              }

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
                    const result = toolData.result as any
                    const records = Array.isArray(result)
                      ? result
                      : Array.isArray(result?.records)
                        ? result.records
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
                    const result = toolData.result as any
                    const results = Array.isArray(result?.results)
                      ? result.results
                      : Array.isArray(result)
                        ? result
                        : []

                    externalResult = {
                      query: pendingExternalParams.current?.query,
                      results,
                    }
                  }
                }
              }
            } catch (parseError) {
              console.debug('Skipped chunk:', data)
            }
          }
        }
      } finally {
        reader.releaseLock()
      }

      setStatus('complete')

      return {
        analysis: aggregatedAnalysis,
        toolEvents: aggregatedToolEvents,
        search: searchResult,
        external: externalResult,
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
