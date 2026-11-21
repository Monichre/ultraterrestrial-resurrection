import { openai } from '@/lib/openai/client'
import { PROMETHEUS_ASSISTANT_ID, PROMETHEUS_VECTOR_STORE_ID } from '@/services/ai/openai/config'
import { searchDatabase } from '@db/postgres'
import { createSSEBridge, sseHeaders } from '@/services/ai/openai/sse'

export const maxDuration = 30

export const askPrometheusAgent = async ( input: { threadId: string | null; message: string } ) => {
  const threadId =
    input.threadId ??
    (
      await openai.beta.threads.create( {
        tool_resources: {
          file_search: {
            vector_store_ids: [PROMETHEUS_VECTOR_STORE_ID].filter(Boolean) as string[],
          },
        },
      } )
    ).id

  const createdMessage = await openai.beta.threads.messages.create( threadId, {
    role: 'user',
    content: input.message,
  } )

  const { readable, writeSSE, forwardStream, sendDataMessage, close } = createSSEBridge()

  ;(async () => {
    try {
      const runStream = openai.beta.threads.runs.stream(
        threadId,
        {
          tool_choice: 'required',
          tools: [{ type: 'file_search' }],
          assistant_id:
            PROMETHEUS_ASSISTANT_ID ??
            ( () => { throw new Error( 'ASSISTANT_ID environment is not set' ) } )(),
          additional_instructions: `Look across topics, events, key figures, sightings, documents any additional resources at your disposal. Cite all of your sources thoroughly and specifically.`,
        },
      )

      let runResult = await forwardStream( runStream )

      while (
        runResult?.status === 'requires_action' &&
        runResult.required_action?.type === 'submit_tool_outputs'
      ) {
        const tool_outputs = await Promise.all(
          runResult.required_action.submit_tool_outputs.tool_calls.map( async ( toolCall: any ) => {
            const parameters = JSON.parse( toolCall.function.arguments )
            switch ( toolCall.function.name ) {
              case 'search_database': {
                const { table, search_terms: searchTerms, search_fields: searchFields } = parameters
                const analogousRecords = await searchDatabase( { table, searchTerms, searchFields } )
                return { tool_call_id: toolCall.id, output: JSON.stringify( analogousRecords ) }
              }
              default:
                throw new Error( `Unknown tool call function: ${toolCall.function.name}` )
            }
          } )
        )
        runResult = await forwardStream(
          openai.beta.threads.runs.submitToolOutputsStream(
            runResult.id,
            { tool_outputs }
          )
        )
      }

      await writeSSE({ done: true })
      await close()
    } catch (err) {
      await writeSSE({ error: 'internal_error', message: (err as Error)?.message })
      await close()
    }
  })()

  return new Response(readable, { headers: sseHeaders() })
}

