import { askXataWithAi } from "@/db/xata/db/search-operations";
import { openai } from "@/lib/openai/client";
import { DISCLOSURE_ASSISTANT_ID } from "@/services/ai/openai/config";
import { assistantEventHandler } from "@/services/ai/openai/stream-handler";
import { NER_EXTRACTION_PROMPT } from "@/services/ai/prompts/ner-extraction-prompt";
import { AssistantResponse } from "ai";

/*
{
  "name": "search_database",
  "description": "Search a specified table in the Xata (Postgres) database using provided search terms.",
  "strict": false,
  "parameters": {
    "type": "object",
    "properties": {
     
      "search_terms": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "description": "List of search terms to use in the query."
      },
      "search_fields": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "description": "Fields to search within the table. If omitted, all text fields are searched."
      },
  
     
    },
    "required": [
    
    ]
  }
}
*/

export async function POST(req: Request) {
	console.log("🚀 ~ file: route.ts:49 ~ POST ~ req:", req);

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

	console.log("🚀 ~ file: route.ts:24 ~ POST ~ threadId:", threadId);

	const createdMessage = await openai.beta.threads.messages.create(threadId, {
		role: "user",
		content: input.message,
	});

	return AssistantResponse(
		{ threadId, messageId: createdMessage.id },
		async ({ forwardStream, sendDataMessage }: any) => {
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
							},
						},
					],
					additional_instructions: NER_EXTRACTION_PROMPT,
					// tool_choice: { "type": "file_search" },
					assistant_id:
						DISCLOSURE_ASSISTANT_ID ??
						(() => {
							throw new Error("ASSISTANT_ID environment is not set");
						})(),
				},
				assistantEventHandler,
				// { signal: req.signal }
				// assistantEventHandler
			);

			let runResult = await forwardStream(runStream);

			console.log("🚀 ~ runResult:", runResult);

			while (
				runResult?.status === "requires_action" &&
				runResult.required_action?.type === "submit_tool_outputs"
			) {
				const tool_outputs = await Promise.all(
					runResult.required_action.submit_tool_outputs.tool_calls.map(
						async (toolCall: any) => {
							console.log("🚀 ~ file: route.ts:89 ~ toolCall:", toolCall);

							console.log("🚀 ~ file: route.ts:138 ~ runResult:", runResult);

							console.log("🚀 ~ file: route.ts:89 ~ toolCall:", toolCall);

							const parameters = JSON.parse(toolCall.function.arguments);

							console.log("🚀 ~ file: route.ts:87 ~ parameters:", parameters);

							switch (toolCall.function.name) {
								case "searchDatabase":
									// const {
									// 	table,
									// 	search_terms: searchTerms,
									// 	search_fields: searchFields,
									// } = parameters;

									// const analogousRecords = await searchDatabase({
									// 	table,
									// 	searchTerms,
									// 	searchFields,
									// });

									const askPersonnel = await askXataWithAi({
										table: "personnel",
										question: input.message,
									}).then((res) => {
										const { answer, records } = res;
										return {
											answer,
											record: records[0],
										};
									});

									console.log("🚀 ~ askPersonnel:", askPersonnel);

									const askEvents = await askXataWithAi({
										table: "events",
										question: input.message,
									}).then((res) => {
										const { answer, records } = res;
										return {
											answer,
											record: records[0],
										};
									});

									const askTestimonies = await askXataWithAi({
										table: "testimonies",
										question: input.message,
									}).then((res) => {
										const { answer, records } = res;
										return {
											answer,
											record: records[0],
										};
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

								default:
									throw new Error(
										`Unknown tool call function: ${toolCall.function.name}`,
									);
							}
						},
					),
				);
				console.log("🚀 ~ file: route.ts:124 ~ tool_outputs:", tool_outputs);
				runResult = await forwardStream(
					openai.beta.threads.runs.submitToolOutputsStream(
						threadId,
						runResult.id,
						{ tool_outputs },
						// { signal: req.signal }
						// tool_outputs[0].tool_call_id,
						// { tool_outputs },
					),
				);
			}
			return runResult;
			// return {
			//   threadMessages
			// }
		},
	);
}
