import { openai } from "@/lib/openai/client";
import { DISCLOSURE_ASSISTANT_ID } from "@/services/ai/openai/config";
import { searchDatabase } from "@/services/ai/openai/tools/search-database";
import { NER_EXTRACTION_PROMPT } from "@/services/ai/prompts/ner-extraction-prompt";
import { AssistantResponse } from "ai";

// Define types for tool results and entities
interface ToolResults {
	fileSearchResult?: {
		response: string;
		entities: Record<string, string>[];
	};
}

export async function POST(req: Request) {
	const input: {
		threadId: string | null;
		message: string;
	} = await req.json();

	const threadId =
		input.threadId ??
		(
			await openai.beta.threads.create({
				tool_resources: {
					file_search: {
						vector_store_ids: ["vs_meWOEnUiUxtQWf0W6NBsNpCG"],
					},
				},
			})
		).id;

	const createdMessage = await openai.beta.threads.messages.create(threadId, {
		role: "user",
		content: input.message,
	});

	// Store tool results between steps
	const toolResults: ToolResults = {};

	return AssistantResponse(
		{ threadId, messageId: createdMessage.id },
		async ({ forwardStream, sendDataMessage }) => {
			// Set up for sequential tool calls
			const runStream = openai.beta.threads.runs.stream(threadId, {
				// Only define the searchDatabase tool - file_search is built-in
				tools: [
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
				],
				additional_instructions: `
						${NER_EXTRACTION_PROMPT}
						
						# Sequential Tool Execution Instructions
						Always follow this exact sequence:
						1. First use the file_search to retrieve relevant information from the knowledge base
						2. Then use searchDatabase with entities extracted from the file_search results
						
						Do not skip either step, and make sure to extract entities from the first result.
					`,
				assistant_id:
					DISCLOSURE_ASSISTANT_ID ??
					(() => {
						throw new Error("ASSISTANT_ID environment is not set");
					})(),
			});

			let runResult = await forwardStream(runStream);

			// Process potentially multiple rounds of tool calls
			while (
				runResult?.status === "requires_action" &&
				runResult.required_action?.type === "submit_tool_outputs"
			) {
				const toolCalls =
					runResult.required_action.submit_tool_outputs.tool_calls;

				// Process tool calls sequentially to maintain state between them
				const tool_outputs = [];

				for (const toolCall of toolCalls) {
					// Handle built-in file_search tool results
					if (toolCall.type === "retrieval") {
						// File search is handled automatically by OpenAI
						// But we need to extract entities from the results for the next step

						// In a real implementation, we would extract entities from the file search content
						// For now, we'll extract from the original user query as a placeholder
						const fileSearchResult = {
							response: "Information retrieved from file search",
							entities: extractEntitiesFromQuery(input.message),
						};

						// Store result for the next tool to use
						toolResults.fileSearchResult = fileSearchResult;

						sendDataMessage({
							role: "data",
							data: {
								tool: "file_search",
								status: "complete",
								result: fileSearchResult,
							},
						});

						// No need to add output for retrieval tool calls
						continue;
					}

					const parameters = JSON.parse(toolCall.function.arguments);

					// Notify frontend about current step
					sendDataMessage({
						role: "data",
						data: {
							tool: toolCall.function.name,
							status: "processing",
							parameters,
						},
					});

					if (toolCall.function.name === "searchDatabase") {
						// Use entities from file search results
						const previousResult = toolResults.fileSearchResult;

						// Get search terms either from parameters or extract from previous result
						const searchTerms =
							parameters.search_terms ||
							previousResult?.entities?.map((e) => e.name) ||
							[];

						const searchResult = await searchDatabase({
							table: parameters.table,
							searchTerms,
							searchFields: parameters.search_fields,
						});

						sendDataMessage({
							role: "data",
							data: {
								tool: "searchDatabase",
								status: "complete",
								result: searchResult,
							},
						});

						tool_outputs.push({
							tool_call_id: toolCall.id,
							output: JSON.stringify(searchResult),
						});
					}
				}

				// Submit all tool outputs and continue the run
				runResult = await forwardStream(
					openai.beta.threads.runs.submitToolOutputsStream(
						threadId,
						runResult.id,
						{ tool_outputs },
					),
				);
			}

			return runResult;
		},
	);
}

// Helper function to extract entities from a query
function extractEntitiesFromQuery(query: string): Record<string, string>[] {
	// In a real implementation, this would use a proper NER model
	// This is a simplified version for demonstration
	const entities: Record<string, string>[] = [];
	const possibleEntities = query.match(/\b[A-Z][a-z]+\b/g) || [];

	for (const entity of possibleEntities) {
		const personNames = ["John", "Bob", "Alice", "David", "James"];
		const organizationNames = ["NASA", "CIA", "FBI", "Pentagon"];

		let type = "TOPIC";
		if (personNames.includes(entity)) type = "PERSONNEL";
		if (organizationNames.includes(entity)) type = "ORGANIZATION";

		entities.push({
			name: entity,
			type,
		});
	}

	return entities;
}
