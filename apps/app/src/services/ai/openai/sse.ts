// Minimal SSE bridge to stream OpenAI Responses (or legacy AssistantStream) events to the client
// and provide helpers to emit custom data messages and forward the stream.

export type SSEBridge = {
  readable: ReadableStream<Uint8Array>
  writeSSE: (payload: any) => Promise<void>
  sendDataMessage: (msg: any) => Promise<void>
  forwardStream: (runStream: any) => Promise<any>
  close: () => Promise<void>
}

export function createSSEBridge(): SSEBridge {
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()
  const encoder = new TextEncoder()

  const writeSSE = async (payload: any) => {
    await writer.write( encoder.encode( `data: ${JSON.stringify( payload )}\n\n` ) )
  }

  const sendDataMessage = (msg: any) => writeSSE( msg )

  const forwardStream = async (runStream: any) => {
    // Responses API stream (openai.responses.stream): forward text deltas,
    // resolve to the final Response object.
    if ( typeof runStream?.finalResponse === 'function' ) {
      runStream.on( 'response.output_text.delta', (event: any) => {
        if ( event?.delta ) void writeSSE( { content: event.delta } )
      } )
      return await runStream.finalResponse()
    }
    // Legacy AssistantStream (Assistants API, shut down 2026-08-26)
    if ( runStream?.on ) {
      runStream.on( 'textDelta', (delta: any) => {
        const value = typeof delta === 'string' ? delta : delta?.value ?? ''
        if ( value ) void writeSSE( { content: value } )
      } )
    }
    // Await final run object
    if ( typeof runStream?.finalRun === 'function' ) {
      return await runStream.finalRun()
    }
    return runStream
  }

  const close = async () => {
    try { await writer.close() } catch {}
  }

  return { readable, writeSSE, sendDataMessage, forwardStream, close }
}

export function sseHeaders(): HeadersInit {
  return {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  }
}

