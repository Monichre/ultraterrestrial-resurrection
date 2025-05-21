import { askXataWithAi } from "@/db/xata/db/search-operations";
import { openai } from "@/lib/openai/client";
import { DISCLOSURE_ASSISTANT_ID } from "@/services/ai/openai/config";
import { assistantEventHandler } from "@/services/ai/openai/stream-handler";
import { NER_EXTRACTION_PROMPT } from "@/services/ai/prompts/ner-extraction-prompt";
import { AssistantResponse } from "ai";

export async function POST(req: Request) {
	console.log("🚀 ~ POST ~ req:", req);

	const input: {
		threadId: string | null;
		message: string;
	} = await req.json();

	// If no threadId, create one with file_search tool resources enabled
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

	console.log("🚀 ~ threadId:", threadId);

	const createdMessage = await openai.beta.threads.messages.create(threadId, {
		role: "user",
		content: input.message,
	});

	return AssistantResponse(
		{ threadId, messageId: createdMessage.id },
		async ({ forwardStream, sendDataMessage }) => {
			// Initiate a three-step run with three tools:
			// 1. file_search, 2. searchDatabase, and 3. transformReactflow
			const runStream = openai.beta.threads.runs.stream(
				threadId,
				{
					tools: [
						{ type: "file_search" },
						{
							type: "function",
							function: {
								name: "searchDatabase",
								description:
									"Search multiple tables in the Xata database based on the user's query",
							},
						},
						{
							type: "function",
							function: {
								name: "transformReactflow",
								description:
									"Transform database results into ReactFlow nodes and edges",
								parameters: {
									type: "object",
									properties: {
										data: {
											type: "object",
											description:
												"The data from the previous step to transform",
										},
									},
									required: ["data"],
								},
							},
						},
					],
					additional_instructions: NER_EXTRACTION_PROMPT,
					assistant_id:
						DISCLOSURE_ASSISTANT_ID ??
						(() => {
							throw new Error("ASSISTANT_ID environment is not set");
						})(),
				},
				assistantEventHandler,
			);

			// Start the stream and forward its output to the client
			let runResult = await forwardStream(runStream);
			console.log("🚀 ~ initial runResult:", runResult);

			// Process tool calls until the workflow is complete
			while (
				runResult?.status === "requires_action" &&
				runResult.required_action?.type === "submit_tool_outputs"
			) {
				const tool_outputs = await Promise.all(
					runResult.required_action.submit_tool_outputs.tool_calls.map(
						async (toolCall: any) => {
							console.log("🚀 ~ toolCall:", toolCall);
							const parameters = JSON.parse(
								toolCall.function.arguments || "{}",
							);

							switch (toolCall.function.name) {
								case "searchDatabase": {
									// STEP 2: Database Search using the context from file search
									// Note: The file_search results are already available to the assistant
									// and have been used to formulate the searchDatabase request

									// Query multiple tables in parallel
									const [askPersonnel, askEvents, askTestimonies] =
										await Promise.all([
											askXataWithAi({
												table: "personnel",
												question: input.message,
											}).then((res) => ({
												answer: res.answer,
												record: res.records[0] || null,
											})),
											askXataWithAi({
												table: "events",
												question: input.message,
											}).then((res) => ({
												answer: res.answer,
												record: res.records[0] || null,
											})),
											askXataWithAi({
												table: "testimonies",
												question: input.message,
											}).then((res) => ({
												answer: res.answer,
												record: res.records[0] || null,
											})),
										]);

									// Send a data message to update the client on progress
									sendDataMessage({
										type: "progress_update",
										step: "Database search completed",
										progress: 66, // 2/3 of the workflow complete
									});

									return {
										tool_call_id: toolCall.id,
										output: JSON.stringify({
											data: {
												relatedRecords: {
													personnel: askPersonnel,
													events: askEvents,
													testimonies: askTestimonies,
												},
											},
										}),
									};
								}
								case "transformReactflow": {
									// STEP 3: Transform the database results into ReactFlow format
									const xataResult = parameters.data;
									const reactflowData = await transformForReactflow(xataResult);

									// Send a data message to update the client on progress
									sendDataMessage({
										type: "progress_update",
										step: "ReactFlow transformation completed",
										progress: 100, // Workflow complete
									});

									return {
										tool_call_id: toolCall.id,
										output: JSON.stringify({
											data: {
												reactflow: reactflowData,
											},
										}),
									};
								}
								default:
									throw new Error(
										`Unknown tool call function: ${toolCall.function.name}`,
									);
							}
						},
					),
				);

				console.log("🚀 ~ tool_outputs:", tool_outputs);

				// Submit the outputs for the current tool calls and continue the stream
				runResult = await forwardStream(
					openai.beta.threads.runs.submitToolOutputsStream(
						threadId,
						runResult.id,
						{ tool_outputs },
					),
				);
			}

			// Return the final result of the multi-step workflow
			return runResult;
		},
	);
}
