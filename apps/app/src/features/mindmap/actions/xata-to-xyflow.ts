"use server"

import { askXataWithAi } from "@db/xata/api"
import { organizeNodeLayout } from "../layouts/organizeNodeLayout"
import { xata } from "@db/xata/client"
import type { Node, Edge } from '@xyflow/react'
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

// Types for the React Flow data structure - fully compatible with @xyflow/react
export type ReactFlowNode = Node & {
	id: string
	type: string
	position: { x: number; y: number }
	data: Record<string, any>
	parentId?: string
	// React Flow compatible properties
	width?: number
	height?: number
	selected?: boolean
	dragging?: boolean
	resizing?: boolean
	focusable?: boolean
	deletable?: boolean
	connectable?: boolean
	selectable?: boolean
	hidden?: boolean
	zIndex?: number
	extent?: 'parent' | [[number, number], [number, number]]
	expandParent?: boolean
	positionAbsolute?: { x: number; y: number }
	style?: React.CSSProperties
	className?: string
	sourcePosition?: 'top' | 'right' | 'bottom' | 'left'
	targetPosition?: 'top' | 'right' | 'bottom' | 'left'
	dragHandle?: string
}

export type ReactFlowEdge = Edge & {
	id: string
	source: string
	target: string
	type?: string
	animated?: boolean
	label?: string
	style?: Record<string, any>
	// React Flow compatible properties
	sourceHandle?: string | null
	targetHandle?: string | null
	selected?: boolean
	hidden?: boolean
	deletable?: boolean
	focusable?: boolean
	updatable?: boolean
	markerStart?: string
	markerEnd?: string
	pathOptions?: any
	interactionWidth?: number
	zIndex?: number
	className?: string
	labelStyle?: React.CSSProperties
	labelShowBg?: boolean
	labelBgStyle?: React.CSSProperties
	labelBgPadding?: [number, number]
	labelBgBorderRadius?: number
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
	// Enhanced historical filtering options
	historicalFilter?: {
		mode: 'chronological' | 'contextual' | 'free-form'
		dateRange?: {
			startYear?: number
			endYear?: number
		}
		significance?: 'historically_important' | 'all' | 'disclosure_related'
		progression?: 'forward' | 'backward' | 'context-based'
	}
	// Tour context for guided exploration
	tourContext?: {
		tourId: string
		waypointId: string
		tourMode: 'guided' | 'free-form'
		narrativeContext: string
	}
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
	historicalFilter,
	tourContext,
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

		// Enhance rules with historical filtering if provided
		if ( historicalFilter ) {
			const historicalRules = generateHistoricalFilterRules( historicalFilter, table )
			validRules.push( ...historicalRules )
		}

		// Add tour context rules if in guided mode
		if ( tourContext && tourContext.tourMode === 'guided' ) {
			validRules.push( `Following guided tour waypoint: ${tourContext.waypointId}` )
			validRules.push( `Tour narrative context: ${tourContext.narrativeContext}` )
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

/**
 * Generate historical filter rules for database queries
 * Follows React Flow best practices for node creation and relationships
 */
function generateHistoricalFilterRules(
	historicalFilter: {
		mode: 'chronological' | 'contextual' | 'free-form'
		dateRange?: {
			startYear?: number
			endYear?: number
		}
		significance?: 'historically_important' | 'all' | 'disclosure_related'
		progression?: 'forward' | 'backward' | 'context-based'
	},
	table: string
): string[] {
	const rules: string[] = []

	// Date range filtering
	if (historicalFilter.dateRange) {
		const { startYear, endYear } = historicalFilter.dateRange
		if (startYear && endYear) {
			rules.push(`Filter records by date range from ${startYear} to ${endYear}`)
		} else if (startYear) {
			rules.push(`Focus on records from ${startYear} onwards`)
		} else if (endYear) {
			rules.push(`Focus on records up to ${endYear}`)
		}
	}

	// Significance filtering - React Flow optimal node creation
	if (historicalFilter.significance === 'historically_important') {
		rules.push('Prioritize historically significant events that shaped UFO/UAP disclosure')
		rules.push('Include watershed moments that will create impactful node clusters')
		rules.push('Focus on events that have clear chronological connections for edge creation')
	} else if (historicalFilter.significance === 'disclosure_related') {
		rules.push('Focus specifically on disclosure-related events for coherent graph structure')
		rules.push('Include government transparency initiatives with clear relationship chains')
		rules.push('Prioritize records that enhance node connectivity and narrative flow')
	}

	// Chronological progression - optimized for React Flow layouts
	if (historicalFilter.progression === 'forward') {
		rules.push('Emphasize chronological progression for temporal edge creation')
		rules.push('Connect events that led to subsequent developments for clear flow direction')
		rules.push('Structure results for horizontal or timeline-based React Flow layouts')
	} else if (historicalFilter.progression === 'backward') {
		rules.push('Trace historical antecedents for reverse chronological edge connections')
		rules.push('Show causal relationships moving backward through time')
		rules.push('Optimize for radial layouts showing historical convergence')
	}

	// Mode-specific rules - React Flow layout optimization
	switch (historicalFilter.mode) {
		case 'chronological':
			rules.push('Maintain strict chronological ordering for linear React Flow layouts')
			rules.push('Group events by periods for clustered node arrangements')
			rules.push('Ensure clear temporal edge directions for optimal visual flow')
			break
		case 'contextual':
			rules.push('Balance chronological accuracy with thematic node groupings')
			rules.push('Create contextual clusters while maintaining temporal edge accuracy')
			rules.push('Optimize for mixed radial and hierarchical React Flow layouts')
			break
		case 'free-form':
			rules.push('Allow flexible exploration optimized for dynamic React Flow interactions')
			rules.push('Maintain loose chronological awareness without strict positioning')
			rules.push('Support organic node positioning based on user interaction patterns')
			break
	}

	return rules
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
