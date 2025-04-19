import {useEffect, useState, useRef, useCallback} from 'react'
import {fetchRecords} from '@/features/mindmap/actions/xata-to-xyflow'

interface SSEData {
  answer?: string
  records?: string[]
  sessionId?: string
  done?: boolean
  table?: string
  type?: string
}

export const useSSE = (url = '/api/sse/xata/ask') => {
  const [messages, setMessages] = useState<SSEData[]>([])
  const [streaming, setStreaming] = useState<string>('')
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [recordIds, setRecordIds] = useState<string[]>([])
  const [recordData, setRecordData] = useState<any[]>([])
  const [isComplete, setIsComplete] = useState<boolean>(false)
  const [sessionId, setSessionId] = useState<string>('')

  const [lastMessage, setLastMessage] = useState<SSEData | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const messageListenersRef = useRef<((message: SSEData) => void)[]>([])

  const fullTextRef = useRef<string>('')

  // This effect handles the SSE connection

  // Add message listener
  const addMessageListener = useCallback((listener: (message: SSEData) => void) => {
    messageListenersRef.current.push(listener)

    // Return function to remove listener
    return () => {
      messageListenersRef.current = messageListenersRef.current.filter((l) => l !== listener)
    }
  }, [])

  useEffect(() => {
    // Only create one connection

    const eventSource = new EventSource(url)
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      console.log('SSE connection opened')
      setIsConnected(true)
    }

    eventSource.onmessage = (event) => {
      console.log('🚀 ~ useEffect ~ event:', event)

      console.log('SSE message received:', event.data)
      const data = JSON.parse(event.data) as SSEData
      setLastMessage(data)

      // Notify all listeners
      for (const listener of messageListenersRef.current) {
        listener(data)
      }
      console.log('🚀 ~ useEffect ~ data:', data)

      // If it's streaming text, update the streaming state
      if (data.answer) {
        fullTextRef.current += data.answer
        setStreaming(fullTextRef.current)
      }

      // If we get record IDs, store them
      if (data.records && Array.isArray(data.records)) {
        console.log('Received record IDs:', data.records)
        setRecordIds(data.records)
        setIsComplete(true)
      }

      // Store session ID if provided
      if (data.sessionId) {
        setSessionId(data.sessionId)
      }

      // Add the message to our messages array
      setMessages((prev) => [...prev, data])
    }

    eventSource.onerror = (e) => {
      console.error('SSE connection error:', e)
      setError('Connection lost')
      setIsConnected(false)
    }

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
    }
  }, [url])

  // This effect fetches record data when record IDs are received
  useEffect(() => {
    const fetchRecordData = async () => {
      if (recordIds.length > 0) {
        try {
          // Get table from the message data or current state
          const currentTable = lastMessage?.table || '';
          
          if (!currentTable) {
            console.error('No table specified for fetching records - cannot proceed');
            // Try a fixed fallback if we have it
            if (messages.length > 0) {
              // Look through all received messages to find a table
              for (const msg of messages) {
                if (msg.table) {
                  console.log(`Found table in previous message: ${msg.table}`);
                  // Use that table
                  const tableRecords = await fetchRecords(recordIds, msg.table);
                  console.log('Fetched record data:', tableRecords);
                  setRecordData(tableRecords);
                  return;
                }
              }
            }
            
            // Still no table found
            setError('Cannot fetch records: no table name available');
            return;
          }
          
          console.log(`Fetching ${recordIds.length} records from table: ${currentTable}`);
          const records = await fetchRecords(recordIds, currentTable);
          console.log('Fetched record data:', records);
          setRecordData(records);
        } catch (error) {
          console.error('Error fetching records:', error);
          setError(error instanceof Error ? error.message : 'Failed to fetch records');
        }
      }
    };

    fetchRecordData();
  }, [recordIds, lastMessage]);

  // Function to post a query to the SSE endpoint
  const postQuery = useCallback(
    async (question: string, table: string, rules: string[] = []) => {
      try {
        // Reset state for a new query
        setStreaming('')
        fullTextRef.current = ''
        setRecordIds([])
        setRecordData([])
        setIsComplete(false)
        setError(null)
        
        // Store the current table for later record fetching
        setLastMessage(prev => ({ 
          ...prev, 
          table 
        }))

        const response = await fetch(url, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            question,
            table,
            rules,
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to send query: ${response.status}`)
        }

        return true
      } catch (err) {
        console.error('Error posting SSE query:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        return false
      }
    },
    [url]
  )

  return {
    messages,
    streaming,
    isConnected,
    error,
    postQuery,
    isComplete,
    recordIds,
    records: recordData,
    sessionId,
  }
}
