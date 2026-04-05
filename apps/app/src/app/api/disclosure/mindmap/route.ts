

import { openai } from "@/lib/openai/client"
import { PROMETHEUS_ASSISTANT_ID, PROMETHEUS_VECTOR_STORE_ID } from "@/services/ai/openai/config"
import { extractNamedSearchEntities, toSearchTerms } from "@/services/ai/openai/extract-search-terms"
import { searchDatabase } from "@/services/ai/openai/tools/search-database"
import {
  buildAgentContext,
  type AgentContextGraphState,
} from "@/services/ai/context/build-agent-context"
import { createSSEBridge, sseHeaders } from "@/services/ai/openai/sse"
import Exa from 'exa-js'

// Define types for tool results and entities
interface ToolResults {
  fileSearchResult?: {
    response: string
    entities?: Record<string, string>[]
  }
}

interface ExternalSearchResult {
  title?: string | null
  url?: string | null
  text?: string | null
  score?: number | null
}

interface FileSearchToolCallLike {
  type: 'file_search' | 'retrieval'
  file_search?: {
    results?: Array<{
      content?: Array<{
        text?: string
      }>
    }>
  }
}

interface GraphNodeToolInput {
  id?: string
  type?: string
  label?: string
  data?: Record<string, unknown>
  position?: {
    x?: number
    y?: number
  }
}

interface GraphEdgeToolInput {
  id?: string
  source?: string
  target?: string
  type?: string
  label?: string
  reasoning?: string
  data?: Record<string, unknown>
}

export async function POST( req: Request ) {
  const input: {
    threadId: string | null
    message: string
    contextRules?: string | null
    researchFocus?: string | null
    graphState?: AgentContextGraphState | null
  } = await req.json()

  const sharedAgentContext = buildAgentContext( {
    userMessage: input.message,
    contextRules: input.contextRules,
    researchFocus: input.researchFocus,
    graphState: input.graphState,
  } )

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

  await openai.beta.threads.messages.create( threadId, {
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
                name: "addGraphNodes",
                description:
                  "Add new nodes to the active mindmap graph. Use this when you identify important entities not already in the graph.",
                parameters: {
                  type: "object",
                  properties: {
                    nodes: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string", description: "Stable node ID" },
                          type: { type: "string", description: "React Flow node type" },
                          label: { type: "string", description: "Display label for the node" },
                          data: {
                            type: "object",
                            additionalProperties: true,
                            description: "Optional extra node metadata",
                          },
                          position: {
                            type: "object",
                            properties: {
                              x: { type: "number" },
                              y: { type: "number" },
                            },
                            required: ["x", "y"],
                          },
                        },
                        required: ["id", "type", "label"],
                      },
                    },
                  },
                  required: ["nodes"],
                },
              },
            },
            {
              type: "function",
              function: {
                name: "addGraphEdges",
                description:
                  "Add relationship edges between graph nodes. Use this to explicitly capture why two entities are connected.",
                parameters: {
                  type: "object",
                  properties: {
                    edges: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string", description: "Optional stable edge ID" },
                          source: { type: "string", description: "Source node ID" },
                          target: { type: "string", description: "Target node ID" },
                          type: { type: "string", description: "React Flow edge type" },
                          label: { type: "string", description: "Short edge label" },
                          reasoning: {
                            type: "string",
                            description: "Why this relationship exists",
                          },
                          data: {
                            type: "object",
                            additionalProperties: true,
                            description: "Optional extra edge metadata",
                          },
                        },
                        required: ["source", "target"],
                      },
                    },
                  },
                  required: ["edges"],
                },
              },
            },
          ],
          additional_instructions: `
            # Sequential Tool Execution Instructions
            Always follow this execution order:
            1. Use file_search to retrieve relevant knowledge-base evidence.
            2. Use searchDatabase with extracted entities and terms.
            3. Optionally use searchExternalResources when corroboration is needed.
            4. Use addGraphNodes and addGraphEdges when you identify important entities/relationships that should be materialized on the graph.

            # CRITICAL: Edge Reasoning Requirements
            For each selected record or created relationship, explain:
            - WHY this record/connection is relevant
            - WHAT relationship it has to the original query
            - HOW it links to other selected entities

            Example: "Bob Lazar was selected because he directly worked at Area 51 and provides first-hand testimony about extraterrestrial technology, making him highly relevant to UFO disclosure."

            Do not call transformXYFlow. The client is responsible for graph rendering.

            ${sharedAgentContext}
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
          const tool_outputs: Array<{ tool_call_id: string; output: string }> = []

          for ( const toolCall of toolCalls ) {
            // Handle built-in file_search tool results if present
            if ( toolCall.type === "file_search" || toolCall.type === "retrieval" ) {
              const fileSearchToolCall = toolCall as FileSearchToolCallLike
              const response = fileSearchToolCall.file_search?.results
                ?.flatMap( result => result.content || [] )
                .map( content => content.text?.trim() )
                .filter( ( text ): text is string => Boolean( text ) )
                .join( '\n\n' )
                .trim() || input.message

              const fileSearchResult = {
                response,
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

            if ( toolCall.function.name === "searchDatabase" ) {
              const assistantSearchTerms = Array.isArray( parameters.search_terms )
                ? Array.from(
                  new Set(
                    parameters.search_terms
                      .filter( ( term: unknown ): term is string => typeof term === 'string' )
                      .map( ( term: string ) => term.trim().replace( /\s+/g, ' ' ) )
                      .filter( Boolean )
                  )
                )
                : []

              const fallbackQuery = typeof parameters.query === 'string' && parameters.query.trim()
                ? parameters.query.trim()
                : input.message

              const extractedEntities = assistantSearchTerms.length
                ? []
                : await extractNamedSearchEntities( {
                  text:
                    typeof parameters.response === 'string' && parameters.response.trim()
                      ? parameters.response
                      : toolResults.fileSearchResult?.response || input.message,
                  query: fallbackQuery,
                } )

              const searchTerms = assistantSearchTerms.length
                ? assistantSearchTerms
                : toSearchTerms( extractedEntities, fallbackQuery )

              const resolvedParameters = {
                ...parameters,
                search_terms: searchTerms,
              }

              await sendDataMessage( {
                role: "data",
                data: {
                  tool: "searchDatabase",
                  status: "processing",
                  parameters: resolvedParameters,
                },
              } )

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
              await sendDataMessage( {
                role: "data",
                data: {
                  tool: 'searchExternalResources',
                  status: 'processing',
                  parameters,
                },
              } )

              const { query, limit = 5 } = parameters
              try {
                const searchResults = await exaClient.searchAndContents( {
                  query,
                  numResults: Math.min( Number( limit ) || 5, 10 ),
                  type: 'neural',
                  contents: { text: { maxCharacters: 2000 } },
                } )

                const formatted = ( ( searchResults?.results || [] ) as ExternalSearchResult[] ).map( r => ( {
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
            } else if ( toolCall.function.name === 'addGraphNodes' ) {
              const rawNodes = Array.isArray( parameters.nodes )
                ? ( parameters.nodes as GraphNodeToolInput[] )
                : []

              const normalizedNodes = rawNodes
                .map( ( node ) => {
                  const id = typeof node.id === 'string' ? node.id.trim() : ''
                  if ( !id ) return null

                  const label = typeof node.label === 'string' && node.label.trim()
                    ? node.label.trim()
                    : id

                  const resolvedType =
                    typeof node.type === 'string' && node.type.trim()
                      ? node.type.trim()
                      : 'enhancedEntityNodePOC'

                  const hasPosition =
                    typeof node.position?.x === 'number' && typeof node.position?.y === 'number'
                  const position = hasPosition
                    ? { x: node.position?.x as number, y: node.position?.y as number }
                    : undefined

                  return {
                    id,
                    type: resolvedType,
                    label,
                    data: {
                      ...( node.data || {} ),
                      label,
                    },
                    ...( position ? { position } : {} ),
                  }
                } )
                .filter( ( node ): node is NonNullable<typeof node> => Boolean( node ) )

              await sendDataMessage( {
                role: 'data',
                data: {
                  tool: 'addGraphNodes',
                  status: 'processing',
                  parameters: { requested: rawNodes.length },
                },
              } )

              if ( !normalizedNodes.length ) {
                const errorPayload = {
                  error: 'invalid_nodes_payload',
                  message: 'No valid nodes were provided to addGraphNodes',
                }

                await sendDataMessage( {
                  role: 'data',
                  data: {
                    tool: 'addGraphNodes',
                    status: 'error',
                    result: errorPayload,
                  },
                } )

                tool_outputs.push( {
                  tool_call_id: toolCall.id,
                  output: JSON.stringify( errorPayload ),
                } )
              } else {
                const nodeResult = {
                  added: normalizedNodes.length,
                  nodes: normalizedNodes,
                }

                await sendDataMessage( {
                  role: 'data',
                  data: {
                    tool: 'addGraphNodes',
                    status: 'complete',
                    result: nodeResult,
                  },
                } )

                tool_outputs.push( {
                  tool_call_id: toolCall.id,
                  output: JSON.stringify( {
                    added: nodeResult.added,
                    nodeIds: nodeResult.nodes.map( ( node ) => node.id ),
                  } ),
                } )
              }
            } else if ( toolCall.function.name === 'addGraphEdges' ) {
              const rawEdges = Array.isArray( parameters.edges )
                ? ( parameters.edges as GraphEdgeToolInput[] )
                : []

              const normalizedEdges = rawEdges
                .map( ( edge, index ) => {
                  const source = typeof edge.source === 'string' ? edge.source.trim() : ''
                  const target = typeof edge.target === 'string' ? edge.target.trim() : ''

                  if ( !source || !target ) {
                    return null
                  }

                  const label =
                    typeof edge.label === 'string' && edge.label.trim()
                      ? edge.label.trim()
                      : undefined
                  const reasoning =
                    typeof edge.reasoning === 'string' && edge.reasoning.trim()
                      ? edge.reasoning.trim()
                      : undefined

                  const edgeIdSeed = `${source}-${target}-${label || reasoning || index}`
                    .toLowerCase()
                    .replace( /[^a-z0-9_-]+/g, '-' )

                  return {
                    id:
                      typeof edge.id === 'string' && edge.id.trim()
                        ? edge.id.trim()
                        : `agent-edge-${edgeIdSeed}`,
                    source,
                    target,
                    type:
                      typeof edge.type === 'string' && edge.type.trim()
                        ? edge.type.trim()
                        : 'siblingEdge',
                    label,
                    reasoning,
                    data: {
                      ...( edge.data || {} ),
                      ...( label ? { label } : {} ),
                      ...( reasoning ? { reasoning } : {} ),
                    },
                  }
                } )
                .filter( ( edge ): edge is NonNullable<typeof edge> => Boolean( edge ) )

              await sendDataMessage( {
                role: 'data',
                data: {
                  tool: 'addGraphEdges',
                  status: 'processing',
                  parameters: { requested: rawEdges.length },
                },
              } )

              if ( !normalizedEdges.length ) {
                const errorPayload = {
                  error: 'invalid_edges_payload',
                  message: 'No valid edges were provided to addGraphEdges',
                }

                await sendDataMessage( {
                  role: 'data',
                  data: {
                    tool: 'addGraphEdges',
                    status: 'error',
                    result: errorPayload,
                  },
                } )

                tool_outputs.push( {
                  tool_call_id: toolCall.id,
                  output: JSON.stringify( errorPayload ),
                } )
              } else {
                const edgeResult = {
                  added: normalizedEdges.length,
                  edges: normalizedEdges,
                }

                await sendDataMessage( {
                  role: 'data',
                  data: {
                    tool: 'addGraphEdges',
                    status: 'complete',
                    result: edgeResult,
                  },
                } )

                tool_outputs.push( {
                  tool_call_id: toolCall.id,
                  output: JSON.stringify( {
                    added: edgeResult.added,
                    edgeIds: edgeResult.edges.map( ( edge ) => edge.id ),
                  } ),
                } )
              }
            } else {
              const unsupportedPayload = {
                error: 'unsupported_tool',
                message: `Unsupported tool requested: ${toolCall.function.name}`,
              }

              await sendDataMessage( {
                role: 'data',
                data: {
                  tool: toolCall.function.name,
                  status: 'error',
                  result: unsupportedPayload,
                },
              } )

              tool_outputs.push( {
                tool_call_id: toolCall.id,
                output: JSON.stringify( unsupportedPayload ),
              } )
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
