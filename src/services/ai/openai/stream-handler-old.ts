import { openai } from "@/lib/openai/client";
import { searchDatabase } from "@/services/ai/openai/tools/search-database";

import EventEmitter from "events";
import type OpenAI from "openai";
export class AssistantStreamEventHandler extends EventEmitter {
	client: OpenAI;
	constructor(client: OpenAI) {
		super();
		this.client = client;
	}

	async onEvent(event: { event: string; data: Record<string, any> }) {
		console.log(
			"🚀 ~ file: stream-handler.ts:15 ~ AssistantStreamEventHandler ~ onEvent ~ event:",
			event,
		);

		console.log(
			"🚀 ~ file: stream-handler.ts:15 ~ AssistantStreamEventHandler ~ onEvent ~ data:",
			event.data,
		);

		console.log(
			"🚀 ~ file: event-handler.ts:10 ~ AssistantStreamEventHandler ~ onEvent ~ event:",
			event,
		);
		try {
			console.log(event);
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
		console.log(
			"🚀 ~ file: event-handler.ts:33 ~ AssistantStreamEventHandler ~ handleFinished ~ runId:",
			runId,
		);
		console.log(
			"🚀 ~ file: event-handler.ts:33 ~ AssistantStreamEventHandler ~ handleFinished ~ data:",
			data,
		);
		try {
			// Implement your chat saving logic here
			// await saveChat( { runId, threadId, data } )
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
			const toolOutputs =
				data.required_action.submit_tool_outputs.tool_calls.map(
					async (toolCall: {
						function: { name: string; arguments: string };
						id: any;
					}) => {
						if (toolCall.function.name === "searchDatabase") {
							const {
								table,
								search_terms: searchTerms,
								search_fields: searchFields,
							} = JSON.parse(toolCall.function.arguments);

							const analogousRecords = await searchDatabase({
								table,
								searchTerms,
								searchFields,
							});

							console.log(
								"🚀 ~ file: actions.tsx:112 ~ forawait ~ analogousRecords:",
								analogousRecords,
							);

							return {
								tool_call_id: toolCall.id,
								output: JSON.stringify(analogousRecords),
							};
						}
					},
				);
			// Submit all the tool outputs at the same time
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

const assistantEventHandler: any = new AssistantStreamEventHandler(openai);
assistantEventHandler.on(
	"event",
	assistantEventHandler.onEvent.bind(assistantEventHandler),
);

export { assistantEventHandler };

// Run Exponent Anywhere

// Software development happens in many places, from your local dev environment to CI.You can bring Exponent to any environment using the Exponent CLI.

//   Optimized for frontier models

// Exponent uses a mixture of the latest frontier models in combination to give you the best possible AI pair programming experience that just works.

// Reference and edit files

// Quickly reference files and have Exponent directly edit them in your filesystem, even if they're very long.  No more copy pasting back and forth between your editor and the browser.

// Specialized Modes

// Exponent is a developer platform and can be configured to carry out specialized tasks, such as writing SQL against your analytics DB or reviewing PRs on Github.
