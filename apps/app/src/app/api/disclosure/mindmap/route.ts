

import { openai } from "@/lib/openai/client"
import { DISCLOSURE_ASSISTANT_ID } from "@/services/ai/openai/config"
import { searchDatabase } from "@/services/ai/openai/tools/search-database"
import { NER_EXTRACTION_PROMPT } from "@/services/ai/prompts/ner-extraction-prompt"
import { AssistantResponse } from "ai"

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
            vector_store_ids: ["vs_meWOEnUiUxtQWf0W6NBsNpCG"],
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

  return AssistantResponse(
    { threadId, messageId: createdMessage.id },
    async ( { forwardStream, sendDataMessage } ) => {
      // Set up for sequential tool calls
      const runStream = openai.beta.threads.runs.stream( threadId, {
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
						1. First use the file_search to retrieve relevant information from the knowledge base
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
          DISCLOSURE_ASSISTANT_ID ??
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
        const tool_outputs = []

        for ( const toolCall of toolCalls ) {
          // Handle built-in file_search tool results
          if ( toolCall.type === "retrieval" ) {
            // File search is handled automatically by OpenAI
            // But we need to extract entities from the results for the next step

            // In a real implementation, we would extract entities from the file search content
            // For now, we'll extract from the original user query as a placeholder
            const fileSearchResult = {
              response: "Information retrieved from file search",
              entities: extractEntitiesFromQuery( input.message ),
            }

            // Store result for the next tool to use
            toolResults.fileSearchResult = fileSearchResult

            sendDataMessage( {
              role: "data",
              data: {
                tool: "file_search",
                status: "complete",
                result: fileSearchResult,
              },
            } )

            // No need to add output for retrieval tool calls
            continue
          }

          const parameters = JSON.parse( toolCall.function.arguments )

          // Notify frontend about current step
          sendDataMessage( {
            role: "data",
            data: {
              tool: toolCall.function.name,
              status: "processing",
              parameters,
            },
          } )

          if ( toolCall.function.name === "searchDatabase" ) {
            // Use entities from file search results
            const previousResult = toolResults.fileSearchResult

            // Get search terms either from parameters or extract from previous result
            const searchTerms =
              parameters.search_terms ||
              previousResult?.entities?.map( ( e ) => e.name ) ||
              []

            const searchResult = await searchDatabase( {
              table: parameters.table,
              searchTerms,
              searchFields: parameters.search_fields,
            } )

            sendDataMessage( {
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
        }

        // Submit all tool outputs and continue the run
        runResult = await forwardStream(
          openai.beta.threads.runs.submitToolOutputsStream(
            threadId,
            runResult.id,
            { tool_outputs },
          ),
        )
      }

      return runResult
    },
  )
}

// Enhanced entity extraction function with UFO/disclosure domain knowledge
function extractEntitiesFromQuery( query: string ): Record<string, string>[] {
  const entities: Record<string, string>[] = []

  // UFO/disclosure domain patterns
  const PATTERNS = {
    // Key figures in UFO disclosure
    personnel: [
      'Bob Lazar', 'David Grusch', 'Luis Elizondo', 'Christopher Mellon',
      'Harry Reid', 'John McCain', 'Marco Rubio', 'Tim Burchett',
      'Jacques Vallée', 'J. Allen Hynek', 'Stanton Friedman',
      'Robert Bigelow', 'Eric Davis', 'Hal Puthoff', 'Kit Green',
      'Edgar Mitchell', 'Gordon Cooper', 'Buzz Aldrin',
      'Philip Corso', 'Jesse Marcel', 'William Brazel'
    ],

    // Organizations
    organizations: [
      'AATIP', 'AAWSAP', 'To The Stars Academy', 'TTSA',
      'NASA', 'CIA', 'FBI', 'Pentagon', 'DoD', 'Department of Defense',
      'Air Force', 'Navy', 'Army', 'DIA', 'Defense Intelligence Agency',
      'ODNI', 'Office of Director of National Intelligence',
      'Bigelow Aerospace', 'Lockheed Martin', 'Raytheon',
      'Wright-Patterson AFB', 'Area 51', 'S-4', 'Groom Lake'
    ],

    // Events
    events: [
      'Roswell', 'Phoenix Lights', 'Rendlesham Forest', 'Belgian Wave',
      'Washington D.C. 1952', 'Tehran 1976', 'JAL 1628', 'Stephenville',
      'Nimitz Encounter', 'USS Nimitz', 'Tic Tac', 'GIMBAL', 'FLIR1',
      'USS Theodore Roosevelt', 'USS Russell', 'USS Omaha'
    ],

    // Topics/Phenomena
    topics: [
      'UAP', 'UFO', 'USO', 'Unidentified Aerial Phenomena',
      'disclosure', 'crash retrieval', 'reverse engineering',
      'extraterrestrial', 'non-human intelligence', 'NHI',
      'consciousness', 'remote viewing', 'psychic phenomena',
      'antigravity', 'zero point energy', 'metamaterials',
      'Skinwalker Ranch', 'cattle mutilation', 'abduction',
      'close encounter', 'CE1', 'CE2', 'CE3', 'CE4', 'CE5'
    ]
  }

  const queryLower = query.toLowerCase()

  // Extract named entities with context-aware classification
  for ( const [type, items] of Object.entries( PATTERNS ) ) {
    for ( const item of items ) {
      if ( queryLower.includes( item.toLowerCase() ) ) {
        entities.push( {
          name: item,
          type: type.toUpperCase()
        } )
      }
    }
  }

  // Extract capitalized words as potential entities
  const capitalizedWords = query.match( /\b[A-Z][a-zA-Z]*\b/g ) || []

  for ( const word of capitalizedWords ) {
    // Skip common words and already captured entities
    if ( word.length > 2 && !entities.some( e => e.name.includes( word ) ) ) {
      // Default classification based on context
      let type = "TOPIC"

      // Simple heuristics for classification
      if ( /Base|AFB|Field|Station|Facility/i.test( word ) ) type = "LOCATION"
      if ( /Project|Program|Operation/i.test( word ) ) type = "ORGANIZATION"
      if ( /Incident|Event|Sighting|Case/i.test( word ) ) type = "EVENT"

      entities.push( {
        name: word,
        type
      } )
    }
  }

  // Remove duplicates
  const uniqueEntities = entities.filter( ( entity, index, self ) =>
    index === self.findIndex( e => e.name === entity.name && e.type === entity.type )
  )

  return uniqueEntities
}
