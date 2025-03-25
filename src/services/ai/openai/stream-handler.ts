import { openai } from "@/lib/openai/client";
import { searchDatabase } from "@/services/ai/openai/tools/search-database";

import EventEmitter from "events";
import type OpenAI from "openai";

export class AssistantStreamEventHandler extends EventEmitter {
	client: OpenAI;
	toolResults: Record<string, any>; // Store results for future tool calls

	constructor(client: OpenAI) {
		super();
		this.client = client;
		this.toolResults = {};
	}

	async onEvent(event: { event: string; data: Record<string, any> }) {
		console.log(
			"🚀 ~ file: stream-handler.ts:15 ~ AssistantStreamEventHandler ~ onEvent ~ event:",
			event,
		);

		try {
			// Retrieve events that are denoted with 'requires_action'
			// since these will have our tool_calls
			if (event.event === "thread.run.requires_action") {
				await this.handleRequiresAction(
					event.data,
					event.data.id,
					event.data.thread_id,
				);
			} else if (event.event === "thread.message.completed") {
				console.log(event.data);
				await this.handleFinished(
					event.data,
					event.data.id,
					event.data.thread_id,
				);
			}
		} catch (error) {
			console.error("Error handling event:", error);
		}
	}

	async handleFinished(data: any, runId: any, threadId: any) {
		console.log(
			"🚀 ~ file: event-handler.ts:33 ~ AssistantStreamEventHandler ~ handleFinished ~ threadId:",
			threadId,
		);
		try {
			// Reset tool results for new conversations
			this.toolResults = {};
			console.log("Chat history saved successfully.");
		} catch (error) {
			console.error("Error saving chat history:", error);
		}
	}

	async handleRequiresAction(data: any, runId: any, threadId: any) {
		console.log(
			"🚀 ~ file: stream-handler.ts:47 ~ AssistantStreamEventHandler ~ handleRequiresAction ~ data:",
			data,
		);

		try {
			const toolCalls = data.required_action.submit_tool_outputs.tool_calls;
			const toolOutputs = [];

			// Process each tool call sequentially
			for (const toolCall of toolCalls) {
				const { name } = toolCall.function;
				const args = JSON.parse(toolCall.function.arguments);

				console.log(`Processing tool call: ${name} with args:`, args);

				let result;

				if (name === "queryKnowledgeBase") {
					// First tool: query the knowledge base
					const { query } = args;
					
					// Simulate a knowledge base query with a simple response
					// In a real implementation, you'd query your actual knowledge base
					result = {
						response: `Information about ${query} from knowledge base`,
						entities: extractEntities(query), // Helper function to extract entities
					};

					// Store the result for the second tool call
					this.toolResults.knowledgeBaseResult = result;
				} 
				else if (name === "searchDatabase") {
					// Second tool: use the results from the first tool
					const previousResult = this.toolResults.knowledgeBaseResult;
					
					// Get search terms either from previous result or directly from args
					const searchTerms = args.search_terms || 
						(previousResult?.entities?.map((e: any) => e.name) || []);
					
					const analogousRecords = await searchDatabase({
						table: args.table,
						searchTerms,
						searchFields: args.search_fields,
					});

					result = analogousRecords;
				}

				toolOutputs.push({
					tool_call_id: toolCall.id,
					output: JSON.stringify(result),
				});
			}

			// Submit all the tool outputs together
			await this.submitToolOutputs(toolOutputs, runId, threadId);
		} catch (error) {
			console.error("Error processing required action:", error);
		}
	}

	async submitToolOutputs(toolOutputs: any, runId: any, threadId: any) {
		try {
			// Use the submitToolOutputsStream helper
			const stream = this.client.beta.threads.runs.submitToolOutputsStream(
				threadId,
				runId,
				{ tool_outputs: toolOutputs },
			);
			for await (const event of stream) {
				this.emit("event", event);
			}
		} catch (error) {
			console.error("Error submitting tool outputs:", error);
		}
	}
}

// Helper function to extract entities from text
function extractEntities(text: string) {
	// This is a very simplified entity extraction
	// In a real implementation, you'd use NER models or more sophisticated techniques
	const entities = [];
	const keywords = text.match(/\b[A-Z][a-z]+\b/g) || [];
	
	for (const keyword of keywords) {
		entities.push({
			name: keyword,
			type: determineEntityType(keyword),
		});
	}
	
	return entities;
}

// Simple helper to determine entity type
function determineEntityType(entity: string) {
	// This would be more sophisticated in a real implementation
	const personNames = ["John", "Bob", "Alice", "David", "James"];
	const organizationNames = ["NASA", "CIA", "FBI", "Pentagon"];
	
	if (personNames.includes(entity)) return "PERSONNEL";
	if (organizationNames.includes(entity)) return "ORGANIZATION";
	return "TOPIC";
}

const assistantEventHandler: any = new AssistantStreamEventHandler(openai);
assistantEventHandler.on(
	"event",
	assistantEventHandler.onEvent.bind(assistantEventHandler),
);

export { assistantEventHandler };