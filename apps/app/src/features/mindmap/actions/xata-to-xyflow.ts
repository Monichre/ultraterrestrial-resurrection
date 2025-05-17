"use server";
import { xata } from "@db";
import { organizeNodeLayout } from "../layouts/organizeNodeLayout";

type AskParams = {
	question: string;
	rules?: string;
	table?: string;
};

// 2. Fetch actual record data using the record IDs
export const fetchRecords = async (recordIds: string[], table: string) =>
	await Promise.all(
		recordIds.map(
			async (recordId) =>
				await xata.db[table].read(recordId).then((res) => res.toSerializable()),
		),
	);

export const askAIAction = async ({ question, rules, table }: AskParams) => {
	try {
		const dbResponse = await askXataWithAi({ question, table, rules });
		console.log("dbResponse: ", dbResponse);
		const plainData = JSON.parse(JSON.stringify(dbResponse));
		console.log("plainData: ", plainData);
		// const assistantResponse = await askDisclosureAgentToFindRelatedRecords( { subject: question, type: table } )
		// !TODO: figure out how to process the response
		const response = {
			...plainData,
			// assistantResponse
		};
		console.log("response: ", response);
		return response;
	} catch (error) {
		console.error("Error in askAIAction:", error);
		throw error;
	}
};

// Types for the React Flow data structure
export type ReactFlowNode = {
	id: string;
	type: string;
	position: { x: number; y: number };
	data: Record<string, any>;
	parentId?: string;
};

export type ReactFlowEdge = {
	id: string;
	source: string;
	target: string;
	type?: string;
	animated?: boolean;
	label?: string;
	style?: Record<string, any>;
};

export type XataToXYFlowResult = {
	nodes: ReactFlowNode[];
	edges: ReactFlowEdge[];
	answer?: string;
	sessionId?: string;
};

type XataResult = {
	answer: string;
	sessionId: string;
	records: any[];
};

async function transformForReactflow(
	xataResult: XataResult,
	sourceNode: ReactFlowNode,
	existingNodes: ReactFlowNode[],
	originalType: string,
	layoutType: 'horizontal' | 'vertical' | 'radial' | 'grid' = 'horizontal'
): Promise<XataToXYFlowResult> {
	// Extract the related records from the Xata query result
	const { answer, records } = xataResult;
	const nodes: ReactFlowNode[] = [];
	const edges: ReactFlowEdge[] = [];

	// Create a central node as the starting point for our graph
	const centralNodeId = sourceNode.id;

	// Create nodes for each record with parentId set to the source node
	for (const record of records) {
		if (!record) continue;

		// Create a node for this record
		const nodeId = record.id;
		nodes.push({
			id: nodeId,
			type: "entityNode",
			position: { x: 0, y: 0 }, // Initial position will be set by layout
			data: {
				...record,
				type: originalType,
			},
			parentId: centralNodeId,
		});

		// Create an edge connecting to the central node
		edges.push({
			id: `edge-${centralNodeId}-${nodeId}`,
			source: centralNodeId,
			target: nodeId,
			type: "smoothstep",
			animated: true,
		});
	}

	// Determine the best layout based on number of nodes and type
	const direction = layoutType;
	let spacing = 50;
	
	// For radial layouts with many nodes, increase the radius
	// by adjusting parentChildSpacing
	let parentChildSpacing = 100;
	if (direction === 'radial' && nodes.length > 5) {
		parentChildSpacing = 120 + nodes.length * 5; // Scale with node count
	}
	
	// For grid layouts, adjust spacing based on node count
	if (direction === 'grid') {
		spacing = 30;
	}

	// Apply our layout algorithm to position the nodes
	const layoutedNodes = organizeNodeLayout(nodes, edges, {
		direction,
		parentChildSpacing,
		siblingSpacing: spacing,
		nodeWidth: 200,
		nodeHeight: 100,
		centerChildren: true,
	});

	return {
		nodes: layoutedNodes,
		edges,
	};
}

// !should validate the structure of output
type AskXataResponse = {
	answer: string;
	sessionId: string;
	records: string[];
};

export type XataToXYFlowParams = {
	question: string;
	table: string;
	rules: string;
	context: string;
	existingNodes: ReactFlowNode[];
	sourceNode: ReactFlowNode;
	sessionId?: string;
	layoutType?: 'horizontal' | 'vertical' | 'radial' | 'grid';
};

export type XataToXYFlowResponse = {
	nodes: ReactFlowNode[];
	edges: ReactFlowEdge[];
	xataResponse?: {
		answer: string;
		records: any[];
		sessionId: string;
		isStreaming?: boolean;
		streamingText?: string;
	};
	startStreaming?: () => Promise<{
		eventSource: EventSource;
		close: () => void;
	}>;
};

// This function is meant to be called from client components that need streaming
export const xataToXYFlow = async ({
	question,
	table,
	rules,
	context,
	existingNodes,
	sourceNode,
	sessionId,
	layoutType = 'horizontal',
}: XataToXYFlowParams): Promise<XataToXYFlowResponse> => {
	console.log("🚀 ~ xataToXYFlow ~ question:", question);
	const response = await askXataWithAi({ question, table, rules })
	console.log("🚀 ~ xataToXYFlow ~ response:", response)
	
	// Pass the layoutType to transformForReactflow
	const { nodes, edges } = await transformForReactflow(
		response, 
		sourceNode, 
		existingNodes, 
		table,
		layoutType
	)

	console.log("🚀 ~ edges:", edges)
	console.log("🚀 ~ nodes:", nodes)

	// To use with EventSource, we need to provide a callback system
	const streamingUrl = sessionId
		? `/api/sse/xata/ask/${sessionId}`
		: "/api/sse/xata/ask";

	// Return an object with methods to start streaming and handle events
	return {
		nodes,
		edges,
		xataResponse: {
			answer: response.answer,
			records: response.records,
			sessionId: response.sessionId,
		},
	
	};
};

// Server action that initiates a streaming query and returns the first chunk
// This is intended for components that can't directly use EventSource
export async function initiateStreamingQuery({
	question,
	table,
	rules,
}: {
	question: string;
	table: string;
	rules?: string;
}) {
	try {
		// Make a request to our API route
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/sse/xata/ask`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					question,
					table,
					rules: rules ? [rules] : [],
				}),
			},
		);

		if (!response.ok) {
			throw new Error("Failed to initiate streaming query");
		}

		// Return the initial response
		return {
			success: true,
			streamUrl: "/api/sse/xata/ask",
		};
	} catch (error) {
		console.error("Error initiating streaming query:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

// Helper to transform streamed records to nodes and edges
export async function transformStreamResponse(
	streamingText: string,
	records: Record<string, unknown>[],
	sessionId: string,
	sourceNode: ReactFlowNode,
	existingNodes: ReactFlowNode[],
	table: string,
): Promise<XataToXYFlowResponse> {
	// Use the existing transformForReactflow to generate the nodes and edges
	const reactFlowData = await transformForReactflow(
		{
			answer: streamingText,
			sessionId,
			records,
		},
		sourceNode,
		existingNodes,
		table,
	);

	return {
		...reactFlowData,
		xataResponse: {
			answer: streamingText,
			records,
			sessionId,
			isStreaming: false,
		},
	};
}

// export const summarizeRecordConnections = async ({
// 	id,
// 	table,
// 	columns,
// }: { id: string; table: string; columns: string[] }) => {
// 	const summary = await xata.db[table].summarize({
// 		columns: [
// 			"settings.*", // group by all columns in the `settings` object
// 			"username", // group by the username field
// 			"user.hobbies.name", // group by a linked column
// 		],
// 	});
// };
