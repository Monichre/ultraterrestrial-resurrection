import { openai } from "@/lib/openai/client"
import {
	extractNamedSearchEntities,
	toSearchTerms,
	type ExtractedSearchEntity,
} from "@/services/ai/openai/extract-search-terms"
import { searchDatabase } from "@/services/ai/openai/tools/search-database"

import EventEmitter from "events"
import type OpenAI from "openai"

type StoredToolResults = {
	knowledgeBaseResult?: {
		response: string
		entities: ExtractedSearchEntity[]
	}
}

type ToolCallArguments = {
	query?: string
	table?: string
	search_terms?: string[]
	search_fields?: string[]
}

type RequiredToolCall = {
	id: string
	function: {
		name: string
		arguments: string
	}
}

type RunRequiresActionPayload = {
	required_action: {
		submit_tool_outputs: {
			tool_calls: RequiredToolCall[]
		}
	}
}

type AssistantStreamEvent = {
	event: string
	data: RunRequiresActionPayload & {
		id: string
		thread_id: string
	}
}

type ToolOutput = {
	tool_call_id: string
	output: string
}

export class AssistantStreamEventHandler extends EventEmitter {
	client: OpenAI
	toolResults: StoredToolResults

	constructor( client: OpenAI ) {
		super()
		this.client = client
		this.toolResults = {}
	}

	async onEvent( event: AssistantStreamEvent ) {
		console.log(
			"🚀 ~ file: stream-handler.ts:15 ~ AssistantStreamEventHandler ~ onEvent ~ event:",
			event,
		)

		try {
			// Retrieve events that are denoted with 'requires_action'
			// since these will have our tool_calls
			if ( event.event === "thread.run.requires_action" ) {
				await this.handleRequiresAction(
					event.data,
					event.data.id,
				)
			} else if ( event.event === "thread.message.completed" ) {
				console.log( event.data )
				await this.handleFinished(
					event.data,
					event.data.id,
					event.data.thread_id,
				)
			}
		} catch ( error ) {
			console.error( "Error handling event:", error )
		}
	}

	async handleFinished( _data: Record<string, unknown>, _runId: string, threadId: string ) {
		console.log(
			"🚀 ~ file: event-handler.ts:33 ~ AssistantStreamEventHandler ~ handleFinished ~ threadId:",
			threadId,
		)
		try {
			// Reset tool results for new conversations
			this.toolResults = {}
			console.log( "Chat history saved successfully." )
		} catch ( error ) {
			console.error( "Error saving chat history:", error )
		}
	}

	async handleRequiresAction( data: RunRequiresActionPayload, runId: string ) {
		console.log(
			"🚀 ~ file: stream-handler.ts:47 ~ AssistantStreamEventHandler ~ handleRequiresAction ~ data:",
			data,
		)

		try {
			const toolCalls = data.required_action.submit_tool_outputs.tool_calls
			const toolOutputs: ToolOutput[] = []

			// Process each tool call sequentially
			for ( const toolCall of toolCalls ) {
				const { name } = toolCall.function
				const args = JSON.parse( toolCall.function.arguments ) as ToolCallArguments

				console.log( `Processing tool call: ${name} with args:`, args )

				let result

				if ( name === "queryKnowledgeBase" ) {
					// First tool: query the research corpus
					const query = args.query || ''
					const entities = await extractNamedSearchEntities( {
						text: query,
						query,
					} )

					// Simulate a corpus query with a simple response
					// In a real implementation, you'd query your actual vector-backed corpus
					result = {
						response: `Information about ${query} from research corpus`,
						entities,
					}

					// Store the result for the second tool call
					this.toolResults.knowledgeBaseResult = result
				}
				else if ( name === "searchDatabase" ) {
					// Second tool: use the results from the first tool
					const previousResult = this.toolResults.knowledgeBaseResult

					// Get search terms either from previous result or directly from args
					const searchTerms = Array.isArray( args.search_terms ) && args.search_terms.length
						? args.search_terms
						: toSearchTerms( previousResult?.entities || [], args.query )

					const analogousRecords = await searchDatabase( {
						table: args.table,
						searchTerms,
						searchFields: args.search_fields,
					} )

					result = analogousRecords
				}

				toolOutputs.push( {
					tool_call_id: toolCall.id,
					output: JSON.stringify( result ),
				} )
			}

			// Submit all the tool outputs together
			await this.submitToolOutputs( toolOutputs, runId )
		} catch ( error ) {
			console.error( "Error processing required action:", error )
		}
	}

	async submitToolOutputs( toolOutputs: ToolOutput[], runId: string ) {
		try {
			// Use the submitToolOutputsStream helper
			const stream = this.client.beta.threads.runs.submitToolOutputsStream(
				runId,
				{ tool_outputs: toolOutputs },
			)
			for await ( const event of stream ) {
				this.emit( "event", event )
			}
		} catch ( error ) {
			console.error( "Error submitting tool outputs:", error )
		}
	}
}

const assistantEventHandler = new AssistantStreamEventHandler( openai )
assistantEventHandler.on(
	"event",
	assistantEventHandler.onEvent.bind( assistantEventHandler ),
)

export { assistantEventHandler }
