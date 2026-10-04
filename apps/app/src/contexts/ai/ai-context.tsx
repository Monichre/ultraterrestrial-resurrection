"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
import { OpenAIStream, StreamingTextResponse } from "ai";
import type { Message } from "ai/react";
import { Anthropic } from "@anthropic-ai/sdk";
import { ReactFlowProvider } from "@xyflow/react";
import type { Edge, Node } from "@xyflow/react";
import { aiReducer } from "@/contexts/ai/ai-reducer";

export interface AIContextState {
	nodes: any[]; // Node[]
	edges: any[]; // Edge[]
	messages: Message[];
	isProcessing: boolean;
	insights: Record<string, any>[];
}

export interface AIContextValue extends AIContextState {
	updateMindmap: (nodes: Node[], edges: Edge[]) => void;
	processNewRecords: (records: any[]) => Promise<void>;
	streamNodeUpdate: (node: Node) => void;
}

const AIContext = createContext<AIContextValue | undefined>(undefined);

const initialState: AIContextState = {
	nodes: [],
	edges: [],
	messages: [],
	isProcessing: false,
	insights: [],
};

export function AIContextProvider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(aiReducer, initialState);
	const anthropic = new Anthropic({
		apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
	});

	const updateMindmap = (nodes: any[], edges: any[]) => {
		dispatch({ type: "UPDATE_MINDMAP", payload: { nodes, edges } });
	};

	const streamNodeUpdate = (node: any) => {
		dispatch({ type: "ADD_NODE", payload: node });
	};

	const processNewRecords = async (records: any[]) => {
		dispatch({ type: "SET_PROCESSING", payload: true });

		// Commented out implementation - keeping for reference
		/*
		try {
			// Start background processing
			// const worker = new Worker("/workers/relationshipWorker.ts");

			// worker.postMessage({ records, currentState: state });

			// worker.onmessage = (event) => {
			// 	const { insights, suggestedNodes, suggestedEdges } = event.data;

			// 	dispatch({
			// 		type: "UPDATE_INSIGHTS",
			// 		payload: {
			// 			insights,
			// 			nodes: suggestedNodes,
			// 			edges: suggestedEdges,
			// 		},
			// 	});
			// }
		} finally {
			// dispatch({ type: "SET_PROCESSING", payload: false });
		}
		*/

		// Temporary implementation
		try {
			console.log("Processing records:", records);
			// Implementation will be added later
		} finally {
			dispatch({ type: "SET_PROCESSING", payload: false });
		}
	};

	return (
		<AIContext.Provider
			value={{
				...state,
				updateMindmap,
				processNewRecords,
				streamNodeUpdate,
			}}
		>
			<ReactFlowProvider>{children}</ReactFlowProvider>
		</AIContext.Provider>
	);
}
