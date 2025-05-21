import {
	ExaAnswerParams,
	AnswerResponse,
	Citation,
} from "../deep-research/src/types";
import { exa } from "./client";

/**
 * Generate an answer to a question using Exa's web content
 * @param query The question to answer
 * @param options Answer generation options
 * @returns Answer with citations
 * @example
 * const answer = await answer("What is quantum computing?");
 */
export const answer = async (
	query: string,
	options: ExaAnswerParams = {},
): Promise<AnswerResponse> => {
	return await exa.answer(query, options);
};

/**
 * Generate an answer with the enhanced Exa Pro model
 * @param query The question to answer
 * @param options Additional answer options
 * @returns Enhanced answer with citations
 * @example
 * const answer = await answerWithExaPro("What are the latest developments in CRISPR?");
 */
export const answerWithExaPro = async (
	query: string,
	options: Omit<ExaAnswerParams, "model"> = {},
): Promise<AnswerResponse> => {
	return await exa.answer(query, {
		...options,
		model: "exa-pro",
	});
};

/**
 * Generate an answer with full text of citations
 * @param query The question to answer
 * @param options Additional answer options
 * @returns Answer with full citation texts
 * @example
 * const answer = await answerWithFullText("How does quantum entanglement work?");
 */
export const answerWithFullText = async (
	query: string,
	options: Omit<ExaAnswerParams, "text"> = {},
): Promise<AnswerResponse> => {
	return await exa.answer(query, {
		...options,
		text: true,
	});
};

/**
 * Stream an answer response for progressive rendering
 * @param query The question to answer
 * @param options Additional answer options
 * @param onChunk Callback function to process each chunk of the answer
 * @returns Complete answer with citations when finished
 * @example
 * await streamAnswer("Explain dark matter", {},
 *   chunk => console.log(chunk.answer)
 * );
 */
export const streamAnswer = async (
	query: string,
	options: Omit<ExaAnswerParams, "stream"> = {},
	onChunk: (chunk: { answer: string; citations: Citation[] }) => void,
): Promise<AnswerResponse> => {
	const stream = await exa.answer(query, {
		...options,
		stream: true,
	});

	let finalAnswer: AnswerResponse = {
		answer: "",
		citations: [],
	};

	for await (const chunk of stream) {
		onChunk(chunk);
		finalAnswer = {
			answer: chunk.answer,
			citations: chunk.citations,
			costDollars: chunk.costDollars,
		};
	}

	return finalAnswer;
};
