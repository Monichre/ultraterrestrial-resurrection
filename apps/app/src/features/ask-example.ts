import { getXataClient } from "@db/xata/xata";
import {
	ask,
	askFollowUp,
	askStream,
	AskStreamChunk,
} from "@db/src/xata-typescript-sdk/api/ask";

/**
 * Example 1: Simple question about data
 */
const simpleQuestionExample = async () => {
	const xata = getXataClient();

	try {
		// Ask a simple question about data in the "events" table
		const result = await ask(
			xata,
			"events",
			"What are the most recent UFO sightings?",
		);

		console.log("Answer:", result.answer);
		console.log("Session ID for follow-up questions:", result.sessionId);
		console.log("Records used as context:", result.records);
	} catch (error) {
		console.error("Error in simple question example:", error);
	}
};

/**
 * Example 2: Question with rules and vector search
 */
const vectorSearchExample = async () => {
	const xata = getXataClient();

	try {
		// Ask a question using vector search with specific rules
		const result = await ask(
			xata,
			"events",
			"Tell me about sightings in Nevada",
			{
				rules: [
					"Focus only on verified sightings with multiple witnesses",
					"Include the date and location of each sighting",
					"Do not speculate on the nature of the sightings",
				],
				searchType: "vector",
				vectorSearch: {
					column: "embedding",
					contentColumn: "description",
					filter: {
						country: "USA",
						state: "Nevada",
					},
				},
			},
		);

		console.log("Answer:", result.answer);
		console.log("Session ID:", result.sessionId);
	} catch (error) {
		console.error("Error in vector search example:", error);
	}
};

/**
 * Example 3: Conversation with follow-up questions
 */
const conversationExample = async () => {
	const xata = getXataClient();

	try {
		// Initial question
		console.log("Initial question: What are the most credible UFO sightings?");
		const initialResult = await ask(
			xata,
			"events",
			"What are the most credible UFO sightings?",
			{
				searchType: "keyword",
				search: {
					fuzziness: 1,
					prefix: "phrase",
					target: ["description", { column: "title", weight: 3 }, "summary"],
				},
			},
		);

		console.log("Initial answer:", initialResult.answer);
		const sessionId = initialResult.sessionId;

		// Follow-up question
		console.log("\nFollow-up question: Which of these had physical evidence?");
		const followUpResult = await askFollowUp(
			xata,
			"events",
			"Which of these had physical evidence?",
			sessionId,
		);

		console.log("Follow-up answer:", followUpResult.answer);

		// Another follow-up
		console.log("\nAnother follow-up: Were there any official investigations?");
		const anotherFollowUp = await askFollowUp(
			xata,
			"events",
			"Were there any official investigations?",
			sessionId,
		);

		console.log("Another follow-up answer:", anotherFollowUp.answer);
	} catch (error) {
		console.error("Error in conversation example:", error);
	}
};

/**
 * Example 4: Streaming response
 */
const streamingExample = async () => {
	const xata = getXataClient();

	try {
		console.log(
			"Streaming question: Describe the Phoenix Lights incident in detail",
		);

		// Get a streaming response
		const stream = await askStream(
			xata,
			"events",
			"Describe the Phoenix Lights incident in detail",
			{
				searchType: "keyword",
				search: {
					target: ["title", "description", "summary"],
					filter: {
						title: { $contains: "Phoenix Lights" },
					},
				},
			},
		);

		// Process the stream
		const reader = stream.getReader();
		let answer = "";

		// Function to read from the stream
		const readStream = async () => {
			while (true) {
				const { done, value } = await reader.read();

				if (done) {
					break;
				}

				const chunk = value as AskStreamChunk;

				if (chunk.text) {
					// Append text to the answer
					answer += chunk.text;
					// Print the text fragment as it arrives
					process.stdout.write(chunk.text);
				}

				if (chunk.done) {
					// Stream is complete
					console.log("\n\nStream complete!");
					console.log("Session ID for follow-up:", chunk.sessionId);
					console.log("Records used as context:", chunk.records);
					break;
				}
			}
		};

		await readStream();
	} catch (error) {
		console.error("Error in streaming example:", error);
	}
};

// Run examples
(async () => {
	console.log("=== Simple Question Example ===");
	await simpleQuestionExample();

	console.log("\n=== Vector Search Example ===");
	await vectorSearchExample();

	console.log("\n=== Conversation Example ===");
	await conversationExample();

	console.log("\n=== Streaming Example ===");
	await streamingExample();
})();
