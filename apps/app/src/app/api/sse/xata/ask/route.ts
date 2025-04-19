import { getXataClient } from '@/db/xata'
import type { AskResult } from '@xata.io/client'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Debug flag - can be set to false in production
const DEBUG_LOGGING = true

// Debug logging utility
export function logDebug(message: string, data?: unknown): void {
  if (DEBUG_LOGGING) {
    console.log(`[SSE Server] ${message}`, data ? data : '')
  }
}

// Encode data in SSE format
function encodeSSE(event: string, data: string): Uint8Array {
  const encoder = new TextEncoder()
  return encoder.encode(`event: ${event}\ndata: ${data}\n\n`)
}

// GET endpoint to establish SSE connection
export async function GET(request: NextRequest) {
  const responseStream = new ReadableStream({
    start(controller) {
      // Send simple connection confirmation
      controller.enqueue(
        encodeSSE(
          'message',
          JSON.stringify({
            type: 'connection_established',
            payload: {
              message: 'SSE connection established with Xata',
              timestamp: new Date().toISOString(),
            },
          })
        )
      )
      
      // Clean up on disconnect
      request.signal.addEventListener('abort', () => {
        console.log(`[SSE Server] Client disconnected`)
        controller.close()
      })
    },
  })

  return new Response(responseStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  })
}

// POST endpoint to handle Xata queries
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    console.log('[SSE Server] POST request received:', body)

    const { question, table, rules = [], sessionId } = body
    
    if (!question || !table) {
      return Response.json({ 
        error: 'Missing required parameters: question and table are required' 
      }, { status: 400 })
    }
    
    // Log request details
    console.log('[SSE Server] Processing query:', {
      question: question.substring(0, 100),
      table,
      rulesCount: rules?.length || 0,
      sessionId: sessionId || 'none'
    })
    
    // Get Xata client and table
    const xata = getXataClient()
    
    if (!table || !xata.db[table]) {
      console.error(`[SSE Server] Invalid table: ${table}`)
      return Response.json({ 
        error: `Invalid table: ${table}` 
      }, { status: 400 })
    }
    
    const xataTable = xata.db[table]
    
    // Check if the table has an ask method
    if (!xataTable || typeof xataTable.ask !== 'function') {
      console.error(`[SSE Server] Table ${table} doesn't have an ask method`)
      return Response.json({ 
        error: `Table ${table} doesn't support the ask method` 
      }, { status: 400 })
    }
    
    // Create a clean readable stream for SSE
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial message to confirm query start
          console.log(`[SSE Server] Starting query on ${table}`)
          controller.enqueue(
            encodeSSE('message', JSON.stringify({
              type: 'query_started',
              table,
              timestamp: new Date().toISOString()
            }))
          )
          
          // Start the Xata query
          await xataTable.ask(question, {
            rules,
            onMessage: (message: AskResult) => {
              try {
                // Log message properties
                const msgInfo = {
                  hasAnswer: !!message.answer,
                  answerLength: message.answer?.length || 0,
                  hasRecords: !!message.records,
                  recordCount: message.records?.length || 0,
                  
                  keys: Object.keys(message)
                }
                
                if (DEBUG_LOGGING) {
                  console.log('[SSE Server] Message from Xata:', msgInfo)
                  
                  // Sample content for debugging
                  if (message.answer) {
                    console.log(`[SSE Server] Answer sample: "${message.answer.substring(0, 50)}..."`)
                  }
                  
                  if (message.records && message.records.length > 0) {
                    console.log(`[SSE Server] Record IDs:`, message.records)
                  }
                }
                
                // Add table to message for client-side record fetching
                const enrichedMessage = {
                  ...message,
                  table
                }
                
                // Send message to client
                controller.enqueue(
                  encodeSSE('message', JSON.stringify(enrichedMessage))
                )
                
                // Handle completion
                if (message.done) {
                  console.log(`[SSE Server] Query complete`)
                  
                  // Send final message
                  if (message.records && message.records.length > 0) {
                    console.log(`[SSE Server] Returning ${message.records.length} records`)
                  }
                }
              } catch (error) {
                console.error('[SSE Server] Error processing message:', error)
                controller.enqueue(
                  encodeSSE('error', JSON.stringify({ 
                    error: 'Error processing message' 
                  }))
                )
              }
            }
          })
          
          console.log('[SSE Server] Xata query completed successfully')
          
        } catch (error) {
          console.error('[SSE Server] Error in stream handler:', error)
          controller.enqueue(
            encodeSSE('error', JSON.stringify({ 
              error: 'Error in Xata query'
            }))
          )
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    })
    
  } catch (error) {
    console.error('[SSE Server] Unhandled error in POST handler:', error)
    return Response.json({ 
      error: 'Internal server error'
    }, { status: 500 })
  }
}