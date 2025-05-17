import type { AskOptions } from "@xata.io/client";
import { getXataClient, type XataClient } from "./xata";

const xata = getXataClient();

export const askXata = async (
	table: string,
	question: string,
	options: AskOptions = {},
) => {
	try {
		// Handle new question
		return await xata.db[table].ask(question, {
			rules: options.rules,
			searchType: options.searchType,
			search: options.search,
			vectorSearch: options.vectorSearch,
		});
	} catch (error) {
		console.error("Error asking question:", error);
		throw error;
	}
};

export const askXataWithAi = async ({
	table,
	question,
}: { table: string; question: string }) => {
	console.log(`Querying ${table} with question: ${question}`);
	// Mock implementation that simulates querying Xata
	return {
		answer: `This is a mock answer for ${question} about ${table}`,
		records: [
			{
				id: `mock-${table}-id`,
				name: `Mock ${table} Record`,
				data: "Sample data",
			},
		],
	};
};

/**
 * Ask a follow-up question in an existing conversation
 *
 * @param xata The Xata client instance
 * @param table The table to search in
 * @param question The follow-up question
 * @param sessionId The session ID from a previous question
 * @returns The AI-generated answer and related metadata
 */
export const askFollowUp = async (
	xata: XataClient,
	table: string,
	question: string,
	sessionId: string,
): Promise<AskResponse> => {
	return askXata(table, question, { sessionId });
};

/**
 * Process the SSE response stream from Xata's ask endpoint
 */
const processStream = (stream: ReadableStream) => {
	const reader = stream.getReader();
	const decoder = new TextDecoder();

	return new ReadableStream({
		async start(controller) {
			try {
				while (true) {
					const { done, value } = await reader.read();

					if (done) {
						controller.close();
						return;
					}

					const chunk = decoder.decode(value, { stream: true });
					const lines = chunk.split("\n");

					for (const line of lines) {
						if (line.startsWith("data: ")) {
							const data = line.slice(6); // Remove 'data: ' prefix

							try {
								const parsedData = JSON.parse(data);
								controller.enqueue(parsedData);

								// If this is the final chunk with done:true, close the stream
								if (parsedData.done) {
									controller.close();
									return;
								}
							} catch (e) {
								console.error("Error parsing SSE data:", e);
							}
						}
					}
				}
			} catch (error) {
				controller.error(error);
			}
		},
	});
};

/**
 * Create a streaming ask request that returns the answer as a stream of events
 *
 * @param xata The Xata client instance
 * @param table The table to search in
 * @param question The question to ask
 * @param options Options for the ask operation
 * @returns A ReadableStream of the AI-generated answer chunks
 */
export const askStream = async (
	xata: XataClient,
	table: string,
	question: string,
	options: AskOptions = {},
): Promise<ReadableStream<AskStreamChunk>> => {
	try {
		// Setting up headers for server-sent events
		const fetchOptions: any = {
			headers: {
				Accept: "text/event-stream",
				"Content-Type": "application/json",
			},
			method: "POST",
		};

		// Prepare the request body
		const requestBody: any = {
			question,
		};

		// Add optional parameters
		if (options.rules) requestBody.rules = options.rules;
		if (options.searchType) requestBody.searchType = options.searchType;
		if (options.search) requestBody.search = options.search;
		if (options.vectorSearch) requestBody.vectorSearch = options.vectorSearch;

		fetchOptions.body = JSON.stringify(requestBody);

		let url: string;

		// Determine if this is a new question or a follow-up
		if (options.sessionId) {
			url = `${xata.fetch.baseURL}/db/${xata.databaseURL}/tables/${table}/ask/${options.sessionId}`;
		} else {
			url = `${xata.fetch.baseURL}/db/${xata.databaseURL}/tables/${table}/ask`;
		}

		// Send the request
		const response = await fetch(url, fetchOptions);

		if (!response.ok || !response.body) {
			throw new Error(`Failed to stream response: ${response.statusText}`);
		}

		// Process and return the stream
		return processStream(response.body);
	} catch (error) {
		console.error("Error streaming question:", error);
		throw error;
	}
};
