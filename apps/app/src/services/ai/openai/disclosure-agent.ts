import { openai } from '@/lib/openai/client'
import { DISCLOSURE_ASSISTANT_ID } from '@/services/ai/openai/config'
import { searchDatabase } from '@/services/ai/openai/tools/search-database'
import { AssistantResponse } from 'ai'

export const maxDuration = 30

export const askDisclosureAgent = async ( input: { threadId: string | null; message: string } ) => {
  const threadId =
    input.threadId ??
    (
      await openai.beta.threads.create( {
        tool_resources: {
          file_search: {
            vector_store_ids: ['vs_meWOEnUiUxtQWf0W6NBsNpCG'],
          },
        },
      } )
    ).id

  console.log( '🚀 ~ file: route.ts:24 ~ POST ~ threadId:', threadId )

  const createdMessage = await openai.beta.threads.messages.create( threadId, {
    role: 'user',
    content: input.message,
  } )

  return AssistantResponse(
    { threadId, messageId: createdMessage.id },
    async ( { forwardStream, sendDataMessage }: any ) => {

      // { type: 'function', function: { name: 'search_database' } }

      const runStream = openai.beta.threads.runs.stream(
        threadId,
        {
          // include: ['step_details.tool_calls[*].file_search.results[*].content'],
          tool_choice: 'required',
          tools: [{ type: 'file_search' }],

          // tool_choice: { "type": "file_search" },
          assistant_id:
            DISCLOSURE_ASSISTANT_ID ??
            ( () => {
              throw new Error( 'ASSISTANT_ID environment is not set' )
            } )(),
          additional_instructions: `Look across topics, events, key figures, sightings, documents any additional resources at your disposal. Cite all of your sources thoroughly and specifically, including information and other relevant details on the weight of the resource as it pertains to your answer or the completion of the task. Return your response in well formatted markddown but be sure to return the Citations/Annotations data in JSON 
        in the following format: 
        ---
        {
          "citations": [
            {

              "Relation to Subject": "{{data}}", 
              "Evidence": "{{data}}",
              "Relevance Score": "{{data}}",
              "Source": "{{Name of Source/Article}}",
              "File": "{{Name of File}}",
              "Weight": "{{The weight value you would assign it}}"
              }
            ]
        }
        ---
        `,
        },

        // assistantEventHandler
      )

      let runResult = await forwardStream( runStream )

      console.log( '🚀 ~ file: route.ts:79 ~ runResult:', runResult )

      while (
        runResult?.status === 'requires_action' &&
        runResult.required_action?.type === 'submit_tool_outputs'
      ) {
        const tool_outputs = await Promise.all(
          runResult.required_action.submit_tool_outputs.tool_calls.map( async ( toolCall: any ) => {
            console.log( '🚀 ~ file: route.ts:89 ~ toolCall:', toolCall )

            console.log( '🚀 ~ file: route.ts:138 ~ runResult:', runResult )

            console.log( '🚀 ~ file: route.ts:89 ~ toolCall:', toolCall )

            const parameters = JSON.parse( toolCall.function.arguments )

            console.log( '🚀 ~ file: route.ts:87 ~ parameters:', parameters )

            switch ( toolCall.function.name ) {
              case 'search_database':
                const { table, search_terms: searchTerms, search_fields: searchFields } = parameters
                sendDataMessage( {
                  role: 'data',
                  data: {
                    parameters
                  },
                } )

                const analogousRecords = await searchDatabase( { table, searchTerms, searchFields } )

                console.log(
                  '🚀 ~ file: actions.tsx:112 ~ forawait ~ analogousRecords:',
                  analogousRecords
                )

                return {
                  tool_call_id: toolCall.id,
                  output: JSON.stringify( analogousRecords ),
                }

              // configure your tool calls here

              default:
                throw new Error( `Unknown tool call function: ${toolCall.function.name}` )
            }
          } )
        )
        console.log( '🚀 ~ file: route.ts:124 ~ tool_outputs:', tool_outputs )
        runResult = await forwardStream(
          openai.beta.threads.runs.submitToolOutputsStream(
            threadId,
            runResult.id,
            { tool_outputs }
            // tool_outputs[0].tool_call_id,
            // { tool_outputs },
          )
        )
      }

      // return {
      //   threadMessages
      // }
    }
  )
}
