import { askXataWithAi } from "@/db/xata/db/search-operations"
import { openai } from "@/lib/openai/client"
import { DISCLOSURE_ASSISTANT_ID } from "@/services/ai/openai/config"
import { assistantEventHandler } from "@/services/ai/openai/stream-handler"
import { NER_EXTRACTION_PROMPT } from "@/services/ai/prompts/ner-extraction-prompt"
import { AssistantResponse, streamText } from "ai"
import { xataToXYFlow } from "@/features/mindmap/actions/xata-to-xyflow"
import { searchDatabase } from "@/services/ai/openai/tools/search-database"
import { xata } from "@/db/xata/client"
import { streamObject } from "ai"
import { z } from "zod"
import { openai as openaiSdk } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import type { AnthropicProviderOptions } from "@ai-sdk/anthropic"
import { executeDatabaseTableQuery } from "@/db/xata/db/search-operations"


export async function POST( req: Request ) {
	const input: {
		threadId: string | null
		message: string
		resourceContext?: {
			resourceId?: string
			content?: string
			summary?: string
			sourceUrl?: string
			fileName?: string
		}
	} = await req.json()
	console.log( "🚀 ~ file: route.ts:51 ~ POST ~ input:", input )
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

	console.log( "🚀 ~ file: route.ts:24 ~ POST ~ threadId:", threadId )

	// If resource context is provided, add it to the message
	const messageContent = input.message

	console.log( "🚀 ~ POST ~ messageContent:", messageContent )

	if ( input.resourceContext ) {
		// Add resource context as system message first
		await openai.beta.threads.messages.create( threadId, {
			role: "user",
			content: `[SYSTEM] I'm providing you with the following resource context. Please use this information to inform your responses:

Resource ID: ${input.resourceContext.resourceId || "N/A"}
Source: ${input.resourceContext.sourceUrl || input.resourceContext.fileName || "Unknown"}
Summary: ${input.resourceContext.summary || "No summary available"}

${input.resourceContext.content ? `Content: ${input.resourceContext.content}` : ""}

When answering questions, incorporate this information and cite relevant details. If the question is unrelated to this context, you can still answer based on your general knowledge.`,
		} )
	}

	const createdMessage = await openai.beta.threads.messages.create( threadId, {
		role: "user",
		content: messageContent,
	} )

	return AssistantResponse(
		{ threadId, messageId: createdMessage.id },
		async ( {
			forwardStream,
			sendDataMessage,
		}: { forwardStream: any; sendDataMessage: any } ) => {
			// { type: 'function', function: { name: 'search_database' } }

			const runStream = openai.beta.threads.runs.stream(
				threadId,
				{
					// include: ['step_details.tool_calls[*].file_search.results[*].content'],
					// tool_choice: "",
					// tools: [{ type: "file_search", "search_database" }],

					tools: [
						{
							type: "file_search",
						},
						{
							type: "function",
							function: {
								name: "searchDatabase",
								description:
									"Search the database for records that match the results of the file_search",
								parameters: {
									type: "object",
									properties: {
										response: {
											type: "string",
											description: "the response from the file_search",
										},
										query: {
											type: "string",
											description:
												"the user query that was used to retrieve the records",
										},
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
									"Transform results into a graph visualization with XYFlow",
								parameters: {
									type: "object",
									properties: {
										records: {
											type: "array",
											description: "the database records to transform",
											items: {
												type: "object",
												additionalProperties: true,
											},
										},
										query: {
											type: "string",
											description:
												"the query that was used to retrieve the records",
										},
										prompt: {
											type: "string",
											description: "Optional guidance for the AI search",
										},
									},
									required: ["records"],
								},
							},
						},
					],
					additional_instructions: `${NER_EXTRACTION_PROMPT}

					If user has provided resource context, prioritize information from that source when responding to queries about it. Always cite the specific resource when referencing information from it.`,
					tool_choice: "auto",
					assistant_id:
						DISCLOSURE_ASSISTANT_ID ??
						( () => {
							throw new Error( "ASSISTANT_ID environment is not set" )
						} )(),
				},
				assistantEventHandler,
				// { signal: req.signal }
				// assistantEventHandler
			)

			let runResult = await forwardStream( runStream )

			console.log( "🚀 ~ runResult:", runResult )

			while (
				runResult?.status === "requires_action" &&
				runResult.required_action?.type === "submit_tool_outputs"
			) {
				const tool_outputs = await Promise.all(
					runResult.required_action.submit_tool_outputs.tool_calls.map(
						async ( toolCall: {
							function: { name: string; arguments: string }
							id: string
						} ) => {
							console.log( "🚀 ~ file: route.ts:89 ~ toolCall:", toolCall )

							console.log( "🚀 ~ file: route.ts:138 ~ runResult:", runResult )

							console.log( "🚀 ~ file: route.ts:89 ~ toolCall:", toolCall )

							const parameters = JSON.parse( toolCall.function.arguments )

							console.log( "🚀 ~ parameters:", parameters )

							switch ( toolCall.function.name ) {
								case "searchDatabase": {
									const { query, response } = parameters

									console.log( "🚀 ~ POST ~ response:", response )

									// Use executeDatabaseTableQuery to search the database
									const searchResults = await executeDatabaseTableQuery( {
										keyword: query,
										table: "all", // Using "all" as default, adjust as needed
									} )

									console.log( "🚀 ~ query:", query )
									console.log( "🚀 ~ searchResults:", searchResults )

									return {
										tool_call_id: toolCall.id,
										output: JSON.stringify( {
											success: true,
											results: searchResults,
										} ),
									}
								}

								case "transformXYFlow": {
									console.log( "transformXYFlow" )
									console.log( "🚀 ~ POST ~ parameters:", parameters )
									// Call xataToXYFlow with the parameters
									const { records, query: searchQuery } = parameters
									console.log( "🚀 ~ POST ~ searchQuery:", searchQuery )
									console.log( "🚀 ~ POST ~ records:", records )

									const result = await streamText( {
										model: anthropic( "claude-3-7-sonnet-20250219" ),
										messages: [
											{
												role: "user",
												content: `Transform the following records into a graph visualization for XYFlow.
												Query: ${searchQuery}
												Records: ${JSON.stringify( records )}
												`,
											},
										],
										providerOptions: {
											anthropic: {
												thinking: { type: "enabled", budgetTokens: 12000 },
											} satisfies AnthropicProviderOptions,
										},
									} )
									return {
										tool_call_id: toolCall.id,
										output: result.toDataStreamResponse( {
											sendReasoning: true,
										} ),
									}
								}

								default:
									return {
										tool_call_id: toolCall.id,
										output: JSON.stringify( {
											success: false,
											message: "No tool call function found",
										} ),
									}

								// throw new Error(
								// 	`Unknown tool call function: ${toolCall.function.name}`,
								// );
							}
						},
					),
				)
				console.log( "🚀 ~ file: route.ts:124 ~ tool_outputs:", tool_outputs )
				runResult = await forwardStream(
					openai.beta.threads.runs.submitToolOutputsStream(
						threadId,
						runResult.id,
						{ tool_outputs },
						// { signal: req.signal }
						tool_outputs[0].tool_call_id,
						// { tool_outputs },
					),
				)
			}
			return runResult
			// return {
			//   threadMessages
			// }
		},
	)
}

