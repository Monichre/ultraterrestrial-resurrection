import { useCallback, useState } from "react";
import { getXataClient } from "@db/xata/xata";
import {
	ask,
	askFollowUp,
	askStream,
	AskOptions,
	AskResponse,
	AskStreamChunk,
} from "@db/xata/api/ask";

interface UseXataAskProps {
	table: string;
	options?: AskOptions;
}

interface UseXataAskReturn {
	answer: string;
	isLoading: boolean;
	error: Error | null;
	sessionId: string | null;
	records: string[];
	isStreaming: boolean;
	streamProgress: string;
	askQuestion: (question: string) => Promise<AskResponse>;
	askFollowUpQuestion: (
		question: string,
		sessionId: string,
	) => Promise<AskResponse>;
	askStreamingQuestion: (question: string) => Promise<void>;
	cancelStream: () => void;
}

/**
 * React hook for using Xata's AI-powered ask functionality
 *
 * @param table The table to search in
 * @param options Optional configuration for the ask operation
 * @returns Methods and state for interacting with Xata's ask functionality
 */
export const useXataAsk = ({
	table,
	options = {},
}: UseXataAskProps): UseXataAskReturn => {
	const [answer, setAnswer] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [records, setRecords] = useState<string[]>([]);
	const [isStreaming, setIsStreaming] = useState<boolean>(false);
	const [streamProgress, setStreamProgress] = useState<string>("");
	const [abortController, setAbortController] =
		useState<AbortController | null>(null);

	/**
	 * Ask a question and get a complete response at once
	 */
	const askQuestion = useCallback(
		async (question: string): Promise<AskResponse> => {
			setIsLoading(true);
			setError(null);
			setAnswer("");

			try {
				const xata = getXataClient();
				const result = await ask(xata, table, question, options);

				setAnswer(result.answer);
				setSessionId(result.sessionId);
				setRecords(result.records);

				return result;
			} catch (err) {
				const error = err instanceof Error ? err : new Error(String(err));
				setError(error);
				throw error;
			} finally {
				setIsLoading(false);
			}
		},
		[table, options],
	);

	/**
	 * Ask a follow-up question in an existing conversation
	 */
	const askFollowUpQuestion = useCallback(
		async (question: string, sessionId: string): Promise<AskResponse> => {
			setIsLoading(true);
			setError(null);
			setAnswer("");

			try {
				const xata = getXataClient();
				const result = await askFollowUp(xata, table, question, sessionId);

				setAnswer(result.answer);
				setSessionId(result.sessionId);
				setRecords(result.records);

				return result;
			} catch (err) {
				const error = err instanceof Error ? err : new Error(String(err));
				setError(error);
				throw error;
			} finally {
				setIsLoading(false);
			}
		},
		[table],
	);

	/**
	 * Cancel an ongoing streaming operation
	 */
	const cancelStream = useCallback(() => {
		if (abortController) {
			abortController.abort();
			setIsStreaming(false);
			setAbortController(null);
		}
	}, [abortController]);

	/**
	 * Ask a question and stream the response gradually
	 */
	const askStreamingQuestion = useCallback(
		async (question: string): Promise<void> => {
			setIsStreaming(true);
			setIsLoading(true);
			setError(null);
			setAnswer("");
			setStreamProgress("");

			// Create a new abort controller for this stream request
			const controller = new AbortController();
			setAbortController(controller);

			try {
				const xata = getXataClient();
				const stream = await askStream(xata, table, question, options);

				const reader = stream.getReader();
				let fullAnswer = "";

				while (true) {
					const { done, value } = await reader.read();

					if (done) break;

					const chunk = value as AskStreamChunk;

					// If this is a text chunk, update the progress
					if (chunk.text) {
						fullAnswer += chunk.text;
						setStreamProgress(fullAnswer);
					}

					// If this is the final chunk, update the session info
					if (chunk.done) {
						setAnswer(fullAnswer);
						setSessionId(chunk.sessionId ?? null);
						setRecords(chunk.records ?? []);
						break;
					}
				}
			} catch (err) {
				// Only set error if it's not an abort error
				if (err instanceof Error && err.name !== "AbortError") {
					const error = err;
					setError(error);
					throw error;
				}
			} finally {
				setIsLoading(false);
				setIsStreaming(false);
				setAbortController(null);
			}
		},
		[table, options],
	);

	return {
		answer,
		isLoading,
		error,
		sessionId,
		records,
		isStreaming,
		streamProgress,
		askQuestion,
		askFollowUpQuestion,
		askStreamingQuestion,
		cancelStream,
	};
};

export default useXataAsk;
