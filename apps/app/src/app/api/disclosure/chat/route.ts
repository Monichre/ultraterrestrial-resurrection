
import { openai } from "@/lib/openai/client"
import { PROMETHEUS_ASSISTANT_ID, PROMETHEUS_VECTOR_STORE_ID } from "@/services/ai/openai/config"
import { assistantEventHandler } from "@/services/ai/openai/stream-handler"
import { NER_EXTRACTION_PROMPT } from "@/services/ai/prompts/ner-extraction-prompt"
import { streamText } from "ai"
import { createSSEBridge, sseHeaders } from "@/services/ai/openai/sse"
import { searchDatabase } from "@/services/ai/openai/tools/search-database"

import { streamObject } from "ai"
import { z } from "zod"
import { openai as openaiSdk } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import type { AnthropicProviderOptions } from "@ai-sdk/anthropic"
import { searchXata } from "@db/postgres"

/**
 * Input validation schema for disclosure chat API
 * Prevents XSS, injection attacks, and ensures type safety
 */
const ChatRequestSchema = z.object({
	threadId: z.string().uuid().nullable().optional(),
	message: z.string()
		.min(1, "Message cannot be empty")
		.max(4000, "Message exceeds maximum length of 4000 characters")
		.transform(str => str.trim()), // Sanitize whitespace
	resourceContext: z.object({
		resourceId: z.string().max(255).optional(),
		content: z.string().max(50000).optional(), // 50KB limit
		summary: z.string().max(2000).optional(),
		sourceUrl: z.string().url().max(500).optional(),
		fileName: z.string().max(255).optional()
	}).optional()
})

type ChatRequest = z.infer<typeof ChatRequestSchema>

export async function POST( req: Request ) {
	// Validate and sanitize input
	let input: ChatRequest
	try {
		const rawInput = await req.json()
		input = ChatRequestSchema.parse(rawInput)
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response(
				JSON.stringify({
					error: "Invalid request",
					details: error.errors.map(e => ({
						field: e.path.join('.'),
						message: e.message
					}))
				}),
				{
					status: 400,
					headers: { "Content-Type": "application/json" }
				}
			)
		}
		return new Response(
			JSON.stringify({ error: "Invalid JSON format" }),
			{
				status: 400,
				headers: { "Content-Type": "application/json" }
			}
		)
	}
	console.log( "🚀 ~ file: route.ts:51 ~ POST ~ input:", input )
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

	// SSE bridge
	const { readable, writeSSE, forwardStream, sendDataMessage, close } = createSSEBridge()

	;(async () => {
		try {
			// { type: 'function', function: { name: 'search_database' } }

			const runStream = openai.beta.threads.runs.stream(
				threadId,
				{
					include: ['step_details.tool_calls[*].file_search.results[*].content'],
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
						PROMETHEUS_ASSISTANT_ID ??
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
									const searchResults = await searchXata( {
										query,
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
										model: anthropic( "claude-4-sonnet-20250115" ),
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
									const text = await result.text
									return {
										tool_call_id: toolCall.id,
										output: JSON.stringify( {
											success: true,
											transformation: text,
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
						runResult.id,
						{ tool_outputs },
					),
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
