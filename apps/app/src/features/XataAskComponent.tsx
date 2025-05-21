'use client'

import {useState, useEffect} from 'react'
import useXataAsk from './useXataAsk'

interface XataAskComponentProps {
  table: string
  placeholder?: string
}

/**
 * A React component for asking questions of your Xata data
 */
export const XataAskComponent = ({
  table,
  placeholder = 'Ask a question about your data...',
}: XataAskComponentProps) => {
  const [question, setQuestion] = useState('')
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant'; content: string}[]>(
    []
  )
  const [useStreaming, setUseStreaming] = useState(true)

  const {
    answer,
    isLoading,
    error,
    sessionId,
    isStreaming,
    streamProgress,
    askQuestion,
    askFollowUpQuestion,
    askStreamingQuestion,
    cancelStream,
  } = useXataAsk({
    table,
    options: {
      rules: [
        'Answer questions based solely on the data provided.',
        "If you don't know the answer, say so rather than making up information.",
        'Keep responses concise and focused on the question asked.',
      ],
      searchType: 'keyword',
      search: {
        fuzziness: 1,
        prefix: 'phrase',
      },
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!question.trim() || isLoading) return

    // Add user question to chat history
    setChatHistory((prev) => [...prev, {role: 'user', content: question}])

    try {
      // Determine if this is a follow-up question
      if (currentSessionId) {
        if (useStreaming) {
          await askStreamingQuestion(question)
        } else {
          await askFollowUpQuestion(question, currentSessionId)
        }
      } else {
        if (useStreaming) {
          await askStreamingQuestion(question)
        } else {
          await askQuestion(question)
        }
      }

      // Store session ID for follow-up questions
      if (sessionId) {
        setCurrentSessionId(sessionId)
      }

      // Clear input after sending
      setQuestion('')
    } catch (err) {
      console.error('Error asking question:', err)
    }
  }

  // When the answer or streaming progress changes, update the chat history
  useEffect(() => {
    if (isStreaming && streamProgress) {
      // Update the latest assistant message while streaming
      setChatHistory((prev) => {
        const newHistory = [...prev]
        const lastMessage = newHistory[newHistory.length - 1]

        if (lastMessage && lastMessage.role === 'assistant') {
          // Update the existing assistant message
          newHistory[newHistory.length - 1] = {
            ...lastMessage,
            content: streamProgress,
          }
        } else {
          // Add a new assistant message
          newHistory.push({role: 'assistant', content: streamProgress})
        }

        return newHistory
      })
    } else if (answer && !isStreaming) {
      // Add or update the assistant's answer in the chat history
      setChatHistory((prev) => {
        const newHistory = [...prev]
        const lastMessage = newHistory[newHistory.length - 1]

        if (lastMessage && lastMessage.role === 'assistant') {
          // Update the existing assistant message
          newHistory[newHistory.length - 1] = {...lastMessage, content: answer}
        } else {
          // Add a new assistant message
          newHistory.push({role: 'assistant', content: answer})
        }

        return newHistory
      })
    }
  }, [answer, streamProgress, isStreaming])

  return (
    <div className='max-w-2xl mx-auto p-4 border rounded-lg shadow-md'>
      <h2 className='text-xl font-bold mb-4'>Xata AI Assistant</h2>

      {/* Chat history display */}
      <div className='bg-gray-50 rounded-lg p-4 h-[400px] overflow-y-auto mb-4'>
        {chatHistory.length === 0 ? (
          <div className='text-gray-500 text-center mt-32'>
            Ask a question to start a conversation
          </div>
        ) : (
          chatHistory.map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-3 rounded-lg ${
                message.role === 'user' ? 'bg-blue-100 ml-12' : 'bg-white mr-12 border'
              }`}>
              <p className='text-sm font-semibold mb-1'>
                {message.role === 'user' ? 'You' : 'Assistant'}
              </p>
              <p>{message.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className='bg-red-100 text-red-700 p-3 rounded-lg mb-4'>Error: {error.message}</div>
      )}

      {/* Streaming toggle */}
      <div className='flex items-center mb-4'>
        <label className='flex items-center cursor-pointer'>
          <input
            type='checkbox'
            checked={useStreaming}
            onChange={() => setUseStreaming(!useStreaming)}
            className='h-4 w-4 text-blue-600'
          />
          <span className='ml-2 text-sm'>Enable streaming responses</span>
        </label>
      </div>

      {/* Question input form */}
      <form onSubmit={handleSubmit} className='flex gap-2'>
        <input
          type='text'
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className='flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          aria-label='Ask a question'
        />

        {isStreaming ? (
          <button
            type='button'
            onClick={cancelStream}
            className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500'>
            Cancel
          </button>
        ) : (
          <button
            type='submit'
            disabled={isLoading || !question.trim()}
            className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300'>
            {isLoading ? 'Loading...' : 'Ask'}
          </button>
        )}
      </form>

      {/* Session ID display (for debugging) */}
      {sessionId && <div className='mt-4 text-xs text-gray-500'>Session ID: {sessionId}</div>}
    </div>
  )
}

export default XataAskComponent
