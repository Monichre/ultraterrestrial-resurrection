import {askAIAction} from '@/features/mindmap/actions/xata-to-xyflow'
import {useSSE} from '@/hooks/useSSE'
import {Loader2, RefreshCw} from 'lucide-react'
import {useEffect, useState} from 'react'

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
      if (res?.dbResponse) {
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
  console.log('🚀 ~ table:', table)

  console.log('🚀 ~ question:', question)

  const endpoint = '/api/sse/xata/ask'
  const {streaming, isConnected, error, records, isComplete, postQuery} = useSSE(endpoint)

  console.log('🚀 ~ isConnected:', isConnected)

  console.log('🚀 ~ streaming:', streaming)

  const [status, setStatus] = useState<string>('idle')

  // For debugging - log state changes
  useEffect(() => {
    console.log('AskAIStreaming state update:', {
      status,
      isConnected,
      streamingLength: streaming?.length || 0,
      recordCount: records?.length || 0,
      isComplete
    });
  }, [status, isConnected, streaming, records, isComplete]);

  // Start the query when the component mounts
  useEffect(() => {
    if (question && table) {
      console.log(`Starting query for: ${table} - ${question.substring(0, 50)}`);
      setStatus('loading')
      postQuery(question, table, rules).then((success) => {
        console.log(`Query initialization ${success ? 'successful' : 'failed'}`);
        if (success) {
          setStatus('streaming');
        } else {
          setStatus('error');
        }
      })
    }
  }, [question, table, rules, postQuery])

  // Only notify parent when complete or error
  useEffect(() => {
    if (isComplete && onComplete && streaming) {
      console.log('Stream complete! Notifying parent with:', {
        answerLength: streaming?.length || 0,
        recordCount: records?.length || 0
      });
      
      onComplete({
        answer: streaming,
        entities: records || [],
      });
      
      setStatus('complete');
    }
  }, [isComplete, streaming, records, onComplete])

  // Handle errors
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
          onClick={() => postQuery(question, table, rules)}
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
            isConnected ? 'bg-green-500' : 'bg-amber-500 animate-pulse'
          }`}
        />
        <span className='text-gray-400'>{isConnected ? 'Connected' : 'Connecting...'}</span>
      </div>

      {/* Loading state */}
      {status === 'loading' && !streaming && (
        <div className='flex items-center justify-center py-2'>
          <Loader2 className='h-5 w-5 animate-spin text-indigo-400 mr-2' />
          <span className='text-indigo-200'>AI is thinking...</span>
        </div>
      )}

      {/* Streaming content - always show this while streaming */}
      {streaming && <div className='py-2 text-indigo-100 whitespace-pre-wrap'>{streaming}</div>}

      {/* Show indicator when records are found */}
      {records && records.length > 0 && (
        <div className='mt-2 text-xs text-green-400'>Found {records.length} relevant records</div>
      )}
    </div>
  )
}
