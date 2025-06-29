"use server"

import { askXataWithAi } from "@db/xata/api"
import { organizeNodeLayout } from "../layouts/organizeNodeLayout"
import { xata } from "@db/xata/client"
type AskParams = {
	question: string
	rules?: string
	table?: string
}

// 2. Fetch actual record data using the record IDs
export const fetchRecords = async ( recordIds: string[], table: string ) => {
	try {
		if ( !recordIds || recordIds.length === 0 ) {
			console.warn( 'fetchRecords: No record IDs provided' )
			return []
		}

		if ( !table || typeof table !== 'string' ) {
			throw new Error( 'fetchRecords: Invalid table parameter' )
		}

		return await Promise.all(
			recordIds.map(
				async ( recordId ) => {
					try {
						if ( !recordId || typeof recordId !== 'string' ) {
							console.warn( `fetchRecords: Invalid record ID: ${recordId}` )
							return null
						}

						const result = await xata.db[table].read( recordId )
						return result?.toSerializable() || null
					} catch ( error ) {
						console.error( `fetchRecords: Error fetching record ${recordId} from ${table}:`, error )
						return null
					}
				}
			)
		).then( records => records.filter( Boolean ) ) // Filter out null results
	} catch ( error ) {
		console.error( 'fetchRecords: Failed to fetch records:', error )
		throw new Error( `Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}` )
	}
}

export const askAIAction = async ( { question, rules, table }: AskParams ) => {
	try {
		const dbResponse = await askXataWithAi( { question, table, rules } )
		console.log( "dbResponse: ", dbResponse )
		const plainData = JSON.parse( JSON.stringify( dbResponse ) )
		console.log( "plainData: ", plainData )
		// const assistantResponse = await askDisclosureAgentToFindRelatedRecords( { subject: question, type: table } )
		// !TODO: figure out how to process the response
		const response = {
			...plainData,
			// assistantResponse
		}
		console.log( "response: ", response )
		return response
	} catch ( error ) {
		console.error( "Error in askAIAction:", error )
		throw error
	}
}

// Types for the React Flow data structure
export type ReactFlowNode = {
	id: string
	type: string
	position: { x: number; y: number }
	data: Record<string, any>
	parentId?: string
}

export type ReactFlowEdge = {
	id: string
	source: string
	target: string
	type?: string
	animated?: boolean
	label?: string
	style?: Record<string, any>
}

export type XataToXYFlowResult = {
	nodes: ReactFlowNode[]
	edges: ReactFlowEdge[]
	answer?: string
	sessionId?: string
}

type XataResult = {
	answer: string
	sessionId: string
	records: any[]
}

async function transformForReactflow(
	xataResult: XataResult,
	sourceNode: ReactFlowNode,
	existingNodes: ReactFlowNode[],
	originalType: string,
	layoutType: "horizontal" | "vertical" | "radial" | "grid" = "horizontal",
): Promise<XataToXYFlowResult> {
	try {
		// Validate inputs
		if ( !xataResult ) {
			throw new Error( 'transformForReactflow: Invalid xataResult parameter' )
		}

		if ( !sourceNode || !sourceNode.id ) {
			throw new Error( 'transformForReactflow: Invalid or missing sourceNode' )
		}

		if ( !Array.isArray( existingNodes ) ) {
			console.warn( 'transformForReactflow: existingNodes is not an array, using empty array' )
			existingNodes = []
		}

		// Extract the related records from the Xata query result
		const { answer, records } = xataResult

		if ( !Array.isArray( records ) ) {
			console.warn( 'transformForReactflow: Records is not an array, using empty array' )
			return { nodes: [], edges: [], answer }
		}

		const nodes: ReactFlowNode[] = []
		const edges: ReactFlowEdge[] = []

		// Create a central node as the starting point for our graph
		const centralNodeId = sourceNode.id

		// Create nodes for each record with parentId set to the source node
		for ( const record of records ) {
			if ( !record || !record.id ) {
				console.warn( 'transformForReactflow: Skipping invalid record:', record )
				continue
			}

			try {
				// Create a node for this record
				const nodeId = record.id
				nodes.push( {
					id: nodeId,
					type: "enhancedEntityNodePOC",
					position: { x: 0, y: 0 }, // Initial position will be set by layout
					data: {
						...record,
						type: originalType,
					},
					parentId: centralNodeId,
				} )

				// Create an edge connecting to the central node
				edges.push( {
					id: `edge-${centralNodeId}-${nodeId}`,
					source: centralNodeId,
					target: nodeId,
					type: "smoothstep",
					animated: true,
				} )
			} catch ( error ) {
				console.error( `transformForReactflow: Error processing record ${record.id}:`, error )
				// Continue processing other records
			}
		}

		// Validate layout parameters
		const validLayoutTypes = ["horizontal", "vertical", "radial", "grid"]
		if ( !validLayoutTypes.includes( layoutType ) ) {
			console.warn( `transformForReactflow: Invalid layoutType ${layoutType}, using horizontal` )
			layoutType = "horizontal"
		}

		// Determine the best layout based on number of nodes and type
		const direction = layoutType
		let spacing = 50

		// For radial layouts with many nodes, increase the radius
		// by adjusting parentChildSpacing
		let parentChildSpacing = 100
		if ( direction === "radial" && nodes.length > 5 ) {
			parentChildSpacing = 120 + nodes.length * 5 // Scale with node count
		}

		// For grid layouts, adjust spacing based on node count
		if ( direction === "grid" ) {
			spacing = 30
		}

		try {
			// Apply our layout algorithm to position the nodes
			const layoutedNodes = organizeNodeLayout( nodes, edges, {
				direction,
				parentChildSpacing,
				siblingSpacing: spacing,
				nodeWidth: 200,
				nodeHeight: 100,
				centerChildren: true,
			} )

			return {
				nodes: layoutedNodes,
				edges,
				answer,
			}
		} catch ( layoutError ) {
			console.error( 'transformForReactflow: Layout algorithm failed:', layoutError )
			// Return nodes with default positions if layout fails
			return {
				nodes: nodes.map( ( node, index ) => ( {
					...node,
					position: { x: index * 220, y: 0 } // Simple fallback positioning
				} ) ),
				edges,
				answer,
			}
		}
	} catch ( error ) {
		console.error( 'transformForReactflow: Transformation failed:', error )
		throw new Error( `Data transformation failed: ${error instanceof Error ? error.message : 'Unknown error'}` )
	}
}

// !should validate the structure of output
type AskXataResponse = {
	answer: string
	sessionId: string
	records: string[]
}

export type XataToXYFlowParams = {
	question: string
	table: string
	rules: string | string[] // Allow both string and string array
	context: string
	existingNodes: ReactFlowNode[]
	sourceNode: ReactFlowNode
	sessionId?: string
	layoutType?: "horizontal" | "vertical" | "radial" | "grid"
}

export type XataToXYFlowResponse = {
	nodes: ReactFlowNode[]
	edges: ReactFlowEdge[]
	xataResponse?: {
		answer: string
		records: any[]
		sessionId: string
		isStreaming?: boolean
		streamingText?: string
	}
	startStreaming?: () => Promise<{
		eventSource: EventSource
		close: () => void
	}>
}

// This function is meant to be called from client components that need streaming
export const xataToXYFlow = async ( {
	question,
	table,
	rules,
	context,
	existingNodes,
	sourceNode,
	sessionId,
	layoutType = "horizontal",
}: XataToXYFlowParams ): Promise<XataToXYFlowResponse> => {
	try {
		// Input validation
		if ( !question || typeof question !== 'string' || question.trim().length === 0 ) {
			throw new Error( 'xataToXYFlow: Invalid or empty question parameter' )
		}

		if ( !table || typeof table !== 'string' ) {
			throw new Error( 'xataToXYFlow: Invalid table parameter' )
		}

		if ( !sourceNode || !sourceNode.id ) {
			throw new Error( 'xataToXYFlow: Invalid sourceNode parameter' )
		}

		if ( !Array.isArray( existingNodes ) ) {
			console.warn( 'xataToXYFlow: existingNodes is not an array, using empty array' )
			existingNodes = []
		}

		console.log( "🚀 ~ xataToXYFlow ~ question:", question )

		// Convert rules to array if it's a string
		const rulesArray = Array.isArray( rules ) ? rules : [rules]

		// Validate rules array
		const validRules = rulesArray.filter( rule =>
			rule && typeof rule === 'string' && rule.trim().length > 0
		)

		if ( validRules.length === 0 ) {
			console.warn( 'xataToXYFlow: No valid rules provided, using default' )
			validRules.push( `Find relevant ${table} records` )
		}

		const response = await askXataWithAi( {
			question,
			table,
			rules: validRules,
			sessionId
		} )

		if ( !response ) {
			throw new Error( 'xataToXYFlow: No response from askXataWithAi' )
		}

		console.log( "🚀 ~ xataToXYFlow ~ response:", response )

		// Pass the layoutType to transformForReactflow
		const { nodes, edges, answer } = await transformForReactflow(
			response,
			sourceNode,
			existingNodes,
			table,
			layoutType,
		)

		console.log( "🚀 ~ edges:", edges )
		console.log( "🚀 ~ nodes:", nodes )

		// To use with EventSource, we need to provide a callback system
		const streamingUrl = sessionId
			? `/api/sse/xata/ask/${sessionId}`
			: "/api/sse/xata/ask"

		// Return an object with methods to start streaming and handle events
		return {
			nodes,
			edges,
			xataResponse: {
				answer: response.answer,
				records: response.records,
				sessionId: response.sessionId,
			},
		}
	} catch ( error ) {
		console.error( 'xataToXYFlow: Operation failed:', error )

		// Return a minimal error response to prevent UI crashes
		return {
			nodes: [],
			edges: [],
			xataResponse: {
				answer: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
				records: [],
				sessionId: sessionId || '',
			},
		}
	}
}

// Server action that initiates a streaming query and returns the first chunk
// This is intended for components that can't directly use EventSource
export async function initiateStreamingQuery( {
	question,
	table,
	rules,
}: {
	question: string
	table: string
	rules?: string | string[] // Allow both string and string array
} ) {
	try {
		// Convert rules to array if it's a string
		const rulesArray = rules ? ( Array.isArray( rules ) ? rules : [rules] ) : []

		// Make a request to our API route
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/sse/xata/ask`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify( {
					question,
					table,
					rules: rulesArray,
				} ),
			},
		)

		if ( !response.ok ) {
			throw new Error( "Failed to initiate streaming query" )
		}

		// Return the initial response
		return {
			success: true,
			streamUrl: "/api/sse/xata/ask",
		}
	} catch ( error ) {
		console.error( "Error initiating streaming query:", error )
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		}
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
	)

	return {
		...reactFlowData,
		xataResponse: {
			answer: streamingText,
			records,
			sessionId,
			isStreaming: false,
		},
	}
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
