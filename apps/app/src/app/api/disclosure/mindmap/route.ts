

import { openai } from "@/lib/openai/client"
import { PROMETHEUS_ASSISTANT_ID, PROMETHEUS_VECTOR_STORE_ID } from "@/services/ai/openai/config"
import { searchDatabase } from "@/services/ai/openai/tools/search-database"
import { NER_EXTRACTION_PROMPT } from "@/services/ai/prompts/ner-extraction-prompt"
import { createSSEBridge, sseHeaders } from "@/services/ai/openai/sse"
import Exa from 'exa-js'

// Define types for tool results and entities
interface ToolResults {
  fileSearchResult?: {
    response: string
    entities: Record<string, string>[]
  }
}

export async function POST( req: Request ) {
  const input: {
    threadId: string | null
    message: string
  } = await req.json()

  const threadId =
    input.threadId ??
    (
      await openai.beta.threads.create( {
        tool_resources: {
          file_search: {
            vector_store_ids: [PROMETHEUS_VECTOR_STORE_ID].filter( Boolean ) as string[],
          },
        },
      } )
    ).id

  const createdMessage = await openai.beta.threads.messages.create( threadId, {
    role: "user",
    content: input.message,
  } )

  // Store tool results between steps
  const toolResults: ToolResults = {}
  const exaClient = new Exa( process.env.EXA_API_KEY || '' )

  const { readable, writeSSE, forwardStream, sendDataMessage, close } = createSSEBridge()

    ; ( async () => {
      try {
        // Set up for sequential tool calls
        const runStream = openai.beta.threads.runs.stream( threadId, {
          include: ['step_details.tool_calls[*].file_search.results[*].content'],
          // Only define the searchDatabase tool - file_search is built-in
          tools: [
            {
              type: "file_search",
            },
            {
              type: "function",
              function: {
                name: "searchDatabase",
                description:
                  "Search a specified table in the database using provided search terms extracted from previous results",
                parameters: {
                  type: "object",
                  properties: {
                    table: {
                      type: "string",
                      description:
                        "The table to search (e.g., PERSONNEL, EVENT, TOPIC)",
                    },
                    search_terms: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description: "List of search terms to use in the query.",
                    },
                    search_fields: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description: "Fields to search within the table.",
                    },
                  },
                  required: ["table", "search_terms"],
                },
              },

            },
            {
              type: "function",
              function: {
                name: "searchExternalResources",
                description: "Search trusted external UFO/UAP sources (via Exa) to enrich context",
                parameters: {
                  type: "object",
                  properties: {
                    query: { type: "string", description: "Search query for external resources" },
                    limit: { type: "number", description: "Max results (1-10)", minimum: 1, maximum: 10 },
                  },
                  required: ["query"],
                },
              },
            },
            {
              type: "function",
              function: {
                name: "transformXYFlow",
                description:
                  "Transform database results into ReactFlow nodes and edges",
                parameters: {
                  type: "object",
                  properties: {
                    data: {
                      type: "object",
                      description: "The data from the previous step to transform",
                    },
                  },
                  required: ["data"],
                },
              },
            },
          ],
          additional_instructions: `
						
						
						# Sequential Tool Execution Instructions
						Always follow this exact sequence:
						1. First use the file_search to retrieve relevant information from the vector-backed research corpus
						2. Then use searchDatabase with entities extracted from the file_search results
						3. Then use transformXYFlow to transform the results into a graph visualization
						
						# CRITICAL: Edge Reasoning Requirements
						When you analyze database records, you MUST provide specific reasoning for WHY each record was selected and how it connects to the original query. 

						For each record returned, explain:
						- WHY this specific record is relevant to the query
						- WHAT connection or relationship it has to the original topic
						- HOW it relates to other selected records

						Format your reasoning clearly so it can be extracted for edge annotations in the mindmap.

						Example: "Record 1 (Bob Lazar) was selected because he directly worked at Area 51 and provides first-hand testimony about extraterrestrial technology, making him highly relevant to queries about UFO disclosure."

						Do not skip any steps, and make sure to extract entities from the first result, make sure to return strcutured entities from the second result and return graph nodes and edges in the final result

						${NER_EXTRACTION_PROMPT}
					`,
          assistant_id:
            PROMETHEUS_ASSISTANT_ID ??
            ( () => {
              throw new Error( "ASSISTANT_ID environment is not set" )
            } )(),
        } )

        let runResult = await forwardStream( runStream )

        // Process potentially multiple rounds of tool calls
        while (
          runResult?.status === "requires_action" &&
          runResult.required_action?.type === "submit_tool_outputs"
        ) {
          const toolCalls =
            runResult.required_action.submit_tool_outputs.tool_calls

          // Process tool calls sequentially to maintain state between them
          const tool_outputs: Array<{ tool_call_id: string; output: string | any }> = []

          for ( const toolCall of toolCalls ) {
            // Handle built-in file_search tool results if present
            if ( toolCall.type === "retrieval" ) {
              const fileSearchResult = {
                response: "Information retrieved from file search",
              }

              toolResults.fileSearchResult = fileSearchResult

              await sendDataMessage( {
                role: "data",
                data: {
                  tool: "file_search",
                  status: "complete",
                  result: fileSearchResult,
                },
              } )
              continue
            }

            const parameters = JSON.parse( toolCall.function.arguments )

            await sendDataMessage( {
              role: "data",
              data: {
                tool: toolCall.function.name,
                status: "processing",
                parameters,
              },
            } )

            if ( toolCall.function.name === "searchDatabase" ) {
              // Prefer assistant-provided NER terms. Fallback to a single query string if provided.
              const searchTerms: string[] = Array.isArray( parameters.search_terms )
                ? parameters.search_terms
                : ( typeof parameters.query === 'string' && parameters.query.trim() )
                  ? [ parameters.query.trim() ]
                  : []

              if ( !searchTerms.length ) {
                const errorPayload = { error: 'missing_search_terms', message: 'search_terms were not provided by the assistant' }
                await sendDataMessage( {
                  role: "data",
                  data: {
                    tool: "searchDatabase",
                    status: "error",
                    result: errorPayload,
                  },
                } )

                tool_outputs.push( {
                  tool_call_id: toolCall.id,
                  output: JSON.stringify( errorPayload ),
                } )
              } else {
                const searchResult = await searchDatabase( {
                  table: parameters.table,
                  searchTerms,
                  searchFields: parameters.search_fields,
                } )

                await sendDataMessage( {
                  role: "data",
                  data: {
                    tool: "searchDatabase",
                    status: "complete",
                    result: searchResult,
                  },
                } )

                tool_outputs.push( {
                  tool_call_id: toolCall.id,
                  output: JSON.stringify( searchResult ),
                } )
              }
            } else if ( toolCall.function.name === 'searchExternalResources' ) {
              const { query, limit = 5 } = parameters
              try {
                const searchResults = await exaClient.searchAndContents( {
                  query,
                  numResults: Math.min( Number( limit ) || 5, 10 ),
                  type: 'neural',
                  contents: { text: { maxCharacters: 2000 } },
                } as any )

                const formatted = ( searchResults?.results || [] ).map( ( r: any ) => ( {
                  title: r.title,
                  url: r.url,
                  text: r.text,
                  score: r.score,
                  source: 'external',
                } ) )

                await sendDataMessage( {
                  role: 'data',
                  data: { tool: 'searchExternalResources', status: 'complete', result: formatted },
                } )

                tool_outputs.push( {
                  tool_call_id: toolCall.id,
                  output: JSON.stringify( { results: formatted } ),
                } )
              } catch ( e ) {
                await sendDataMessage( { role: 'data', data: { tool: 'searchExternalResources', status: 'error', message: ( e as Error )?.message } } )
                tool_outputs.push( {
                  tool_call_id: toolCall.id,
                  output: JSON.stringify( { results: [], error: 'external_search_failed' } ),
                } )
              }
            }
          }

          // Submit all tool outputs and continue the run
          runResult = await forwardStream(
            openai.beta.threads.runs.submitToolOutputsStream(
              runResult.id,
              { tool_outputs },
            ),
          )
        }

        // Signal end of stream
        await writeSSE( { done: true } )
        await close()
      } catch ( err ) {
        await writeSSE( { error: 'internal_error', message: ( err as Error )?.message } )
        await close()
      }
    } )()

  return new Response( readable, { headers: sseHeaders() } )
}
