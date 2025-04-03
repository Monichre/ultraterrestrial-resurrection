import { useEffect, useRef, useState, useCallback } from "react";
import { fetchRecords } from "@/features/mindmap/actions/xata-to-xyflow";

// Simple type for Xata records
type XataRecord = Record<string, unknown>;

// Basic message types
interface XataMessage {
	text?: string;
	done?: boolean;
	records?: string[];
	sessionId?: string;
	error?: string;
}

// Hook options
interface UseAskXataOptions {
	onStreamingUpdate?: (text: string) => void;
	onComplete?: (data: {
		answer: string;
		records: XataRecord[];
		sessionId: string;
	}) => void;
	onError?: (error: Error) => void;
	endpoint?: string;
}

// Query parameters
interface AskXataParams {
	question: string;
	table: string;
	rules?: string[];
	sessionId?: string;
}

/**
 * Simplified hook to handle streaming responses from Xata's ask endpoint
 */
export function useAskXata(options: UseAskXataOptions = {}) {
	const endpoint = "/api/sse/xata/ask";
	
	// Core state
	const [isConnected, setIsConnected] = useState(false);
	const [isStreaming, setIsStreaming] = useState(false);
	const [streamingText, setStreamingText] = useState("");
	const [answer, setAnswer] = useState("");
	const [records, setRecords] = useState<XataRecord[]>([]);
	const [sessionId, setSessionId] = useState("");
	const [isError, setIsError] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	
	// Connection refs
	const eventSourceRef = useRef<EventSource | null>(null);
	const fullTextRef = useRef<string>("");
	const activeQueryRef = useRef<AskXataParams | null>(null);
	
	// Cleanup function
	const cancel = useCallback(() => {
		if (eventSourceRef.current) {
			eventSourceRef.current.close();
			eventSourceRef.current = null;
			setIsConnected(false);
			setIsStreaming(false);
		}
	}, []);

	// Error handler
	const handleError = useCallback((err: Error) => {
		if (!isError) {
			setIsError(true);
			setError(err);
			setIsStreaming(false);
			if (options.onError) options.onError(err);
		}
	}, [isError, options.onError]);

	// Set up SSE connection
	useEffect(() => {
		// Skip if server-side or not streaming
		if (typeof window === "undefined" || !isStreaming) return;
		
		// Create connection if needed
		if (!eventSourceRef.current) {
			const eventSource = new EventSource(endpoint);
			eventSourceRef.current = eventSource;
			
			// Connection opened
			eventSource.onopen = () => setIsConnected(true);

			// Process messages
			eventSource.onmessage = (event) => {
				console.log("Raw event data:", event.data?.substring(0, 100));
				
				try {
					const data = JSON.parse(event.data);
					console.log("Parsed event data:", data);
					
					// Handle streaming text from answer property (not text)
					if (data.answer) {
						console.log("Processing answer update:", data.answer.substring(0, 50));
						const newText = fullTextRef.current + data.answer;
						fullTextRef.current = newText;
						
						// Directly update state - simpler and more reliable
						setStreamingText(newText);
						
						// Call callback for the consuming component
						if (options.onStreamingUpdate) options.onStreamingUpdate(newText);
					}
					
					// Handle completion with records
					if (data.records && Array.isArray(data.records)) {
						console.log(`Received ${data.records.length} records`);
						
						// If we have records, this is likely the completion message
						if (!data.answer) {
							setIsStreaming(false);
							
							// Process records
							if (data.records.length > 0 && activeQueryRef.current) {
								console.log(`Fetching ${data.records.length} records from ${activeQueryRef.current.table}`);
								fetchRecords(data.records, activeQueryRef.current.table)
									.then((fullRecords) => {
										setRecords(fullRecords);
										if (options.onComplete) {
											options.onComplete({
												answer: fullTextRef.current,
												records: fullRecords,
												sessionId: data.sessionId || "",
											});
										}
									})
									.catch((err) => handleError(new Error(`Error fetching records: ${err instanceof Error ? err.message : "Unknown error"}`)));
							} else if (options.onComplete) {
								options.onComplete({
									answer: fullTextRef.current,
									records: [],
									sessionId: data.sessionId || "",
								});
							}
							
							// Update session ID
							if (data.sessionId) setSessionId(data.sessionId);
						}
					}
					
					// Handle explicit done flag (might not be needed if records signal completion)
					if (data.done) {
						console.log("Query complete - Final text:", fullTextRef.current.substring(0, 50));
						setAnswer(fullTextRef.current);
						setIsStreaming(false);
						
						if (options.onComplete && !data.records) {
							options.onComplete({
								answer: fullTextRef.current,
								records: [],
								sessionId: data.sessionId || "",
							});
						}
					}
				} catch (error) {
					console.error("Error processing SSE message:", error);
					handleError(new Error(`Failed to parse SSE message: ${error instanceof Error ? error.message : "Unknown error"}`));
				}
			};
			
			// Handle connection errors
			eventSource.onerror = () => {
				console.error("EventSource connection error");
				setIsConnected(false);
				if (isStreaming) {
					setTimeout(() => {
						if (eventSourceRef.current) {
							eventSourceRef.current.close();
							eventSourceRef.current = null;
						}
					}, 3000);
				} else if (eventSourceRef.current) {
					eventSourceRef.current.close();
					eventSourceRef.current = null;
				}
			};
		}
		
		// Cleanup on unmount or when streaming stops
		return () => {
			if (!isStreaming && eventSourceRef.current) {
				eventSourceRef.current.close();
				eventSourceRef.current = null;
				setIsConnected(false);
			}
		};
	}, [endpoint, isStreaming, options.onComplete, options.onStreamingUpdate, handleError, isConnected]);
	
	// Start a streaming question to Xata
	const askQuestion = useCallback(async (params: AskXataParams) => {
		console.log("Starting question:", params.question, "table:", params.table);
		
		// Store the active query and reset state
		activeQueryRef.current = params;
		setIsStreaming(true);
		setStreamingText("");
		fullTextRef.current = "";
		setAnswer("");
		setRecords([]);
		setSessionId(params.sessionId || "");
		setIsError(false);
		setError(null);
		
		try {
			// Ensure connection is established before sending query (fixes race condition)
			if (!eventSourceRef.current) {
				const eventSource = new EventSource(endpoint);
				eventSourceRef.current = eventSource;
				
				// Wait for connection to open
				await new Promise<void>((resolve, reject) => {
					const timeout = setTimeout(() => reject(new Error("Connection timeout")), 5000);
					
					eventSource.onopen = () => {
						setIsConnected(true);
						clearTimeout(timeout);
						resolve();
					};
					
					eventSource.onerror = () => {
						clearTimeout(timeout);
						reject(new Error("Failed to establish SSE connection"));
					};
				});
			}
			
			// Send the query via POST
			const response = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					question: params.question,
					table: params.table,
					rules: params.rules || [],
					sessionId: params.sessionId || "",
				}),
			});
			
			if (!response.ok) {
				throw new Error(`Failed to send query: ${response.status} ${response.statusText}`);
			}
			
			// The POST request is now in progress, events will come through EventSource
		} catch (err) {
			handleError(new Error(`Failed to start streaming: ${err instanceof Error ? err.message : "Unknown error"}`));
		}
	}, [endpoint, handleError]);
	
	return {
		askQuestion,
		isStreaming,
		isConnected,
		streamingText,
		answer,
		records,
		sessionId,
		isError,
		error,
		cancel
	};
}
