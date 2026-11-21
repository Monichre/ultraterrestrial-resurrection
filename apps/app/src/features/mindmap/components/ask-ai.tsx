import {askAIAction} from '@/features/mindmap/actions/xata-to-xyflow'
import {useMindMapAgent} from '@/features/mindmap/hooks/use-mindmap-agent'
import {Loader2, RefreshCw} from 'lucide-react'
import {useCallback, useEffect, useState} from 'react'

interface AskAIProps {
  question: any
  prompt?: any
  table: any
  children?: React.ReactNode
  updateAnalysis: (analysis: any) => void
}

export const AskAI: React.FC<AskAIProps> = ({
  question,
  prompt,
  table,
  children,
  updateAnalysis,
}) => {
  const [status, setStatus] = useState<any>('loading..')

  useEffect(() => {
    askAIAction({question, prompt, table}).then((res) => {
      if (res) {
        const {answer: text, records} = res
        setStatus('Complete')
        updateAnalysis({text, records})
      }
    })
  }, [question, prompt, table, updateAnalysis])

  return (
    <div className='w-full flex justify-start items-center'>
      {children}: {status}
    </div>
  )
}

interface AskAIStreamingProps {
  question: string
  table: string
  rules?: string[]
  nodeId?: string
  onComplete?: (data: {answer: string; entities: any[]}) => void
  onError?: (error: string) => void
}

export const AskAIStreaming: React.FC<AskAIStreamingProps> = ({
  question,
  table,
  rules = [],
  nodeId,
  onComplete,
  onError,
}) => {
  const {status, analysis, error, runAgentQuery} = useMindMapAgent()
  const [records, setRecords] = useState<any[]>([])

  const startQuery = useCallback(async () => {
    if (!question || !table) return

    try {
      const result = await runAgentQuery({
        message: question,
        contextRules: [`Focus on the ${table} table.`, ...rules].join(' '),
      })

      const entities = result.search?.records ?? []
      setRecords(entities)
      onComplete?.({answer: result.analysis, entities})
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Agent query failed')
    }
  }, [question, table, rules, runAgentQuery, onComplete, onError])

  // Start the query when the component mounts or the question changes
  useEffect(() => {
    startQuery()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, table])

  // Surface stream-level errors to the parent
  useEffect(() => {
    if (error && onError) {
      onError(error)
    }
  }, [error, onError])

  if (error) {
    return (
      <div className='w-full text-red-400 p-2'>
        <div className='mb-2'>Error: {error}</div>
        <button
          onClick={startQuery}
          className='flex items-center justify-center gap-2 px-3 py-1.5 bg-indigo-700/50 hover:bg-indigo-700/80 text-indigo-200 text-sm rounded transition-colors self-start'>
          <RefreshCw className='h-3 w-3' />
          <span>Retry Query</span>
        </button>
      </div>
    )
  }

  return (
    <div className='w-full'>
      {/* Connection status indicator */}
      <div className='flex items-center mb-2 text-xs'>
        <div
          className={`h-2 w-2 rounded-full mr-2 ${
            status === 'streaming' || status === 'complete'
              ? 'bg-green-500'
              : 'bg-amber-500 animate-pulse'
          }`}
        />
        <span className='text-gray-400'>
          {status === 'streaming' ? 'Streaming...' : status === 'complete' ? 'Connected' : 'Connecting...'}
        </span>
      </div>

      {/* Loading state */}
      {status === 'streaming' && !analysis && (
        <div className='flex items-center justify-center py-2'>
          <Loader2 className='h-5 w-5 animate-spin text-indigo-400 mr-2' />
          <span className='text-indigo-200'>AI is thinking...</span>
        </div>
      )}

      {/* Streaming content - always show this while streaming */}
      {analysis && <div className='py-2 text-indigo-100 whitespace-pre-wrap'>{analysis}</div>}

      {/* Show indicator when records are found */}
      {records.length > 0 && (
        <div className='mt-2 text-xs text-green-400'>Found {records.length} relevant records</div>
      )}
    </div>
  )
}
