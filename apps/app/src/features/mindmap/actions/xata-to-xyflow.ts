"use server"


import { organizeNodeLayout } from "../layouts/organizeNodeLayout"
import { xata } from "@db/xata"
import { askXataWithAi } from "@db/xata/api"




import { getEnhancedNodeData } from "@/features/ai/actions/actions"
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

		// Add timeout and retry logic for database calls
		const fetchWithTimeout = async (recordId: string, retries = 2): Promise<any> => {
			for (let attempt = 0; attempt <= retries; attempt++) {
				try {
					if ( !recordId || typeof recordId !== 'string' ) {
						console.warn( `fetchRecords: Invalid record ID: ${recordId}` )
						return null
					}

					// Add timeout wrapper
					const controller = new AbortController()
					const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
					
					try {
						const result = await xata.db[table].read( recordId )
						clearTimeout(timeoutId)
						return result?.toSerializable() || null
					} finally {
						clearTimeout(timeoutId)
					}
				} catch ( error ) {
					console.error( `fetchRecords: Error fetching record ${recordId} from ${table} (attempt ${attempt + 1}):`, error )
					
					if (attempt === retries) {
						// Return a minimal record object with just the ID if all retries fail
						return { id: recordId, _error: 'Failed to fetch', _table: table }
					}
					
					// Wait before retry
					await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
				}
			}
			return null
		}

		const results = await Promise.all(
			recordIds.map(recordId => fetchWithTimeout(recordId))
		)
		
		return results.filter( Boolean ) // Filter out null results
	} catch ( error ) {
		console.error( 'fetchRecords: Failed to fetch records:', error )
		throw new Error( `Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}` )
	}
}

export const askAIAction = async ( { question, rules, table }: AskParams ) => {
	try {
		// Use Prometheus AI instead of direct Xata calls
		console.log( "🤖 Using Prometheus AI for enhanced node data" )
		const enhancedData = await getEnhancedNodeData( question, table, rules )

		console.log( "enhancedData: ", enhancedData )

		// The enhanced data now returns full records, not just IDs
		// Return the full response with reasoning for edge annotations
		const response = {
			answer: enhancedData.answer,
			sessionId: enhancedData.sessionId,
			records: enhancedData.records, // Full records, not just IDs
			reasoning: enhancedData.reasoning // Prometheus reasoning for edge annotations
		}

		console.log( "response: ", response )
		return response
	} catch ( error ) {
		console.error( "Error in askAIAction:", error )
		// Fallback to direct Xata if Prometheus fails
		console.log( "⚠️ Falling back to direct Xata query" )
		const dbResponse = await askXataWithAi( { question, table, rules } )
		return JSON.parse( JSON.stringify( dbResponse ) )
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
	measured?: {
		width: number
		height: number
	}
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
	reasoning?: any[]
	xataResponse?: any
}

type XataResult = {
	answer: string
	sessionId: string
	records: any[]
	reasoning?: any[]
}

async function transformForReactflow(
	xataResult: XataResult,
	sourceNode: ReactFlowNode,
	existingNodes: ReactFlowNode[],
	originalType: string,
	layoutType: "horizontal" | "vertical" | "radial" | "grid" = "horizontal",
): Promise<XataToXYFlowResult> {
	const transformStartTime = performance.now()

	try {
		console.log( '🔄 transformForReactflow: Starting data transformation' )
		console.log( '📋 Transform parameters:', {
			hasXataResult: !!xataResult,
			sourceNodeId: sourceNode?.id,
			existingNodesCount: existingNodes?.length || 0,
			originalType,
			layoutType
		} )

		// Enhanced input validation
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

		// Validate xataResult structure
		if ( typeof xataResult.answer !== 'string' ) {
			console.warn( 'transformForReactflow: Missing or invalid answer field' )
		}

		if ( typeof xataResult.sessionId !== 'string' ) {
			console.warn( 'transformForReactflow: Missing or invalid sessionId field' )
		}

		// Extract the related records from the Xata query result
		const { answer, records } = xataResult

		console.log( '📊 Data extraction analysis:', {
			hasAnswer: !!answer,
			answerLength: answer?.length || 0,
			hasRecords: Array.isArray( records ),
			recordCount: records?.length || 0
		} )

		if ( !Array.isArray( records ) ) {
			console.warn( 'transformForReactflow: Records is not an array, using empty array' )
			return {
				nodes: [],
				edges: [],
				answer: answer || 'No answer provided',
				sessionId: xataResult.sessionId
			}
		}

		if ( records.length === 0 ) {
			console.log( '📭 transformForReactflow: No records to process, returning empty result' )
			return {
				nodes: [],
				edges: [],
				answer: answer || 'No records found',
				sessionId: xataResult.sessionId
			}
		}

		const nodes: ReactFlowNode[] = []
		const edges: ReactFlowEdge[] = []
		const processingErrors: string[] = []

		// Create a central node as the starting point for our graph
		const centralNodeId = sourceNode.id

		console.log( `🔄 Processing ${records.length} records for node/edge creation` )

		// Create nodes for each record with parentId set to the source node
		for ( let i = 0; i < records.length; i++ ) {
			const record = records[i]

			try {
				console.log( `📝 Processing record ${i + 1}/${records.length}: ${record?.id || 'unknown'}` )

				if ( !record || !record.id ) {
					const warning = `Record ${i} is invalid or missing ID`
					console.warn( `⚠️ transformForReactflow: ${warning}:`, record )
					processingErrors.push( warning )
					continue
				}

				// Validate record structure
				if ( typeof record.id !== 'string' || record.id.trim().length === 0 ) {
					const warning = `Record ${i} has invalid ID: ${record.id}`
					console.warn( `⚠️ transformForReactflow: ${warning}` )
					processingErrors.push( warning )
					continue
				}

				// Create enhanced node data with metadata
				const nodeData = {
					...record,
					type: originalType,
					// Add transformation metadata for debugging
					_transformMeta: {
						sourceIndex: i,
						transformedAt: new Date().toISOString(),
						sourceTable: originalType,
						transformationId: `${centralNodeId}-${Date.now()}-${i}`
					}
				}

				// Create a node for this record
				const nodeId = record.id
				const newNode: ReactFlowNode = {
					id: nodeId,
					type: "enhancedEntityNode", // Use the production enhanced entity node
					position: { x: 0, y: 0 }, // Initial position will be set by layout
					data: nodeData,
					parentId: centralNodeId,
				}

				nodes.push( newNode )

				// Create an edge connecting to the central node
				const edgeId = `edge-${centralNodeId}-${nodeId}`
				const newEdge: ReactFlowEdge = {
					id: edgeId,
					source: centralNodeId,
					target: nodeId,
					type: "smoothstep",
					animated: true,
				}

				edges.push( newEdge )

				console.log( `✅ Created node and edge for record: ${nodeId}` )
			} catch ( error ) {
				const errorMsg = `Error processing record ${record?.id || i}: ${error instanceof Error ? error.message : 'Unknown error'}`
				console.error( `❌ transformForReactflow: ${errorMsg}` )
				processingErrors.push( errorMsg )
				// Continue processing other records
			}
		}

		console.log( `📈 Node/Edge creation summary:` )
		console.log( `  - Records processed: ${records.length}` )
		console.log( `  - Nodes created: ${nodes.length}` )
		console.log( `  - Edges created: ${edges.length}` )
		console.log( `  - Processing errors: ${processingErrors.length}` )

		if ( processingErrors.length > 0 ) {
			console.warn( `⚠️ Processing errors encountered:`, processingErrors )
		}

		// Enhanced layout algorithm section with comprehensive error handling
		const layoutStartTime = performance.now()

		// Validate layout parameters
		const validLayoutTypes = ["horizontal", "vertical", "radial", "grid"]
		if ( !validLayoutTypes.includes( layoutType ) ) {
			console.warn( `transformForReactflow: Invalid layoutType '${layoutType}', using 'horizontal'` )
			layoutType = "horizontal"
		}

		if ( nodes.length === 0 ) {
			console.log( '📭 transformForReactflow: No nodes to layout, skipping layout algorithm' )
			return {
				nodes: [],
				edges: [],
				answer: answer || 'No records found',
				sessionId: xataResult.sessionId
			}
		}

		// Determine the best layout based on number of nodes and type
		const direction = layoutType
		let spacing = 50
		let parentChildSpacing = 100

		// Adaptive layout parameters based on node count and type
		console.log( `🎨 Calculating layout parameters for ${nodes.length} nodes with '${direction}' layout` )

		if ( direction === "radial" && nodes.length > 5 ) {
			parentChildSpacing = 120 + nodes.length * 5 // Scale with node count
			console.log( `📐 Radial layout: Adjusted parentChildSpacing to ${parentChildSpacing} for ${nodes.length} nodes` )
		}

		if ( direction === "grid" ) {
			spacing = 30
			console.log( `📐 Grid layout: Using spacing of ${spacing}` )
		}

		// Validate layout configuration
		const layoutConfig = {
			direction,
			parentChildSpacing,
			siblingSpacing: spacing,
			nodeWidth: 200,
			nodeHeight: 100,
			centerChildren: true,
		}

		console.log( '🎨 Layout configuration:', layoutConfig )

		let layoutedNodes: ReactFlowNode[]

		try {
			console.log( `🚀 Applying ${direction} layout algorithm...` )

			// Apply our layout algorithm to position the nodes
			layoutedNodes = organizeNodeLayout( nodes, edges, layoutConfig )

			const layoutDuration = performance.now() - layoutStartTime
			console.log( `✅ Layout algorithm completed successfully in ${layoutDuration.toFixed( 2 )}ms` )

			// Validate layout results
			const invalidPositions = layoutedNodes.filter( node =>
				!node.position ||
				typeof node.position.x !== 'number' ||
				typeof node.position.y !== 'number' ||
				isNaN( node.position.x ) ||
				isNaN( node.position.y )
			)

			if ( invalidPositions.length > 0 ) {
				console.warn( `⚠️ Layout produced ${invalidPositions.length} nodes with invalid positions` )
				// Fix invalid positions
				invalidPositions.forEach( ( node, index ) => {
					node.position = { x: index * 220, y: 0 }
					console.log( `🔧 Fixed position for node ${node.id}: (${node.position.x}, ${node.position.y})` )
				} )
			}

		} catch ( layoutError ) {
			const layoutDuration = performance.now() - layoutStartTime
			const errorMsg = `Layout algorithm failed after ${layoutDuration.toFixed( 2 )}ms: ${layoutError instanceof Error ? layoutError.message : 'Unknown error'}`
			console.error( `❌ transformForReactflow: ${errorMsg}` )

			// Apply fallback positioning
			console.log( '🔄 Applying fallback linear positioning...' )
			layoutedNodes = nodes.map( ( node, index ) => {
				const fallbackPosition = { x: index * 220, y: 0 }
				console.log( `🔧 Fallback position for ${node.id}: (${fallbackPosition.x}, ${fallbackPosition.y})` )

				return {
					...node,
					position: fallbackPosition
				}
			} )

			console.log( `✅ Fallback positioning applied to ${layoutedNodes.length} nodes` )
		}

		const transformDuration = performance.now() - transformStartTime
		console.log( `🎯 transformForReactflow completed successfully in ${transformDuration.toFixed( 2 )}ms` )
		console.log( `📊 Final transformation results:` )
		console.log( `  - Nodes: ${layoutedNodes.length}` )
		console.log( `  - Edges: ${edges.length}` )
		console.log( `  - Processing errors: ${processingErrors.length}` )
		console.log( `  - Layout type: ${direction}` )

		return {
			nodes: layoutedNodes,
			edges,
			answer: answer || 'Transformation completed',
			sessionId: xataResult.sessionId
		}
	} catch ( error ) {
		const transformDuration = performance.now() - transformStartTime
		const errorMsg = `Data transformation failed after ${transformDuration.toFixed( 2 )}ms: ${error instanceof Error ? error.message : 'Unknown error'}`
		console.error( `❌ transformForReactflow: ${errorMsg}` )
		console.error( `📊 Error context:`, {
			sourceNodeId: sourceNode?.id,
			originalType,
			layoutType,
			hasXataResult: !!xataResult,
			recordCount: xataResult?.records?.length || 0
		} )
		throw new Error( errorMsg )
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
	const startTime = performance.now()

	try {
		console.log( "🚀 xataToXYFlow: Starting enhanced flow with comprehensive logging" )
		console.log( "📋 Parameters:", { question, table, sourceNodeId: sourceNode?.id, layoutType } )

		// Enhanced input validation
		if ( !question || typeof question !== 'string' || question.trim().length === 0 ) {
			throw new Error( 'xataToXYFlow: Invalid or empty question parameter' )
		}

		if ( !table || typeof table !== 'string' ) {
			throw new Error( 'xataToXYFlow: Invalid table parameter' )
		}

		// Validate table exists in Xata client
		if ( !xata.db[table] ) {
			throw new Error( `xataToXYFlow: Table '${table}' does not exist in database` )
		}

		if ( !sourceNode || !sourceNode.id ) {
			throw new Error( 'xataToXYFlow: Invalid sourceNode parameter' )
		}

		if ( !Array.isArray( existingNodes ) ) {
			console.warn( 'xataToXYFlow: existingNodes is not an array, using empty array' )
			existingNodes = []
		}

		console.log( "🚀 ~ xataToXYFlow ~ question:", question )
		console.log( "📊 ~ xataToXYFlow ~ existingNodes count:", existingNodes.length )

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

		console.log( "🤖 Calling Prometheus AI with:", { question, table, rulesCount: validRules.length, sessionId } )

		let response
		try {
			// Use Prometheus AI for enhanced contextual search
			const enhancedData = await getEnhancedNodeData(
				question,
				table,
				validRules.join( '. ' ) // Combine rules into a single string
			)

			// Convert enhanced data to expected format
			// Now we have full records, not just IDs
			response = {
				answer: enhancedData.answer,
				sessionId: enhancedData.sessionId,
				records: enhancedData.records // Full records with all data
			}
		} catch ( aiError ) {
			console.error( "❌ Prometheus AI failed, falling back to direct Xata:", aiError )
			// Fallback to direct Xata query
			response = await askXataWithAi( {
				question,
				table,
				rules: validRules,
				sessionId
			} )
		}

		if ( !response ) {
			throw new Error( 'xataToXYFlow: No response from askXataWithAi' )
		}

		console.log( "✅ askXataWithAi response received" )
		console.log( "📊 Response analysis:", {
			hasAnswer: !!response.answer,
			answerLength: response.answer?.length || 0,
			hasRecords: Array.isArray( response.records ),
			recordCount: response.records?.length || 0,
			hasSessionId: !!response.sessionId
		} )
		console.log( "🚀 ~ xataToXYFlow ~ response:", response )

		// Check if we have full records or just IDs
		console.log( "🔄 Checking record format..." )
		let fullRecords: any[] = []

		try {
			// If records are already full objects (from Prometheus), use them directly
			if ( response.records && response.records.length > 0 && typeof response.records[0] === 'object' ) {
				console.log( "✅ Records are already full objects from Prometheus AI" )
				fullRecords = response.records
			} else if ( response.records && response.records.length > 0 ) {
				// Fallback: if we only have IDs, fetch full records
				console.log( "🔄 Converting record IDs to full record objects..." )
				fullRecords = await fetchRecords( response.records, table )
			}
		} catch ( fetchError ) {
			console.error( "❌ Failed to process records:", fetchError )
			// Continue with empty records rather than failing completely
			fullRecords = []
		}

		console.log( "📊 Record processing results:", {
			originalRecords: response.records?.length || 0,
			fullRecordsRetrieved: fullRecords?.length || 0,
			sampleRecord: fullRecords?.[0] ? Object.keys( fullRecords[0] ) : []
		} )

		// Create enhanced response with full record objects
		const enhancedResponse = {
			...response,
			records: fullRecords
		}

		// Pass the layoutType to transformForReactflow
		const { nodes, edges, answer } = await transformForReactflow(
			enhancedResponse,
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
	layoutType: 'horizontal' | 'vertical' | 'radial' | 'grid' = 'horizontal',
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
		layoutType,
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
	if ( historicalFilter.dateRange ) {
		const { startYear, endYear } = historicalFilter.dateRange
		if ( startYear && endYear ) {
			rules.push( `Filter records by date range from ${startYear} to ${endYear}` )
		} else if ( startYear ) {
			rules.push( `Focus on records from ${startYear} onwards` )
		} else if ( endYear ) {
			rules.push( `Focus on records up to ${endYear}` )
		}
	}

	// Significance filtering - React Flow optimal node creation
	if ( historicalFilter.significance === 'historically_important' ) {
		rules.push( 'Prioritize historically significant events that shaped UFO/UAP disclosure' )
		rules.push( 'Include watershed moments that will create impactful node clusters' )
		rules.push( 'Focus on events that have clear chronological connections for edge creation' )
	} else if ( historicalFilter.significance === 'disclosure_related' ) {
		rules.push( 'Focus specifically on disclosure-related events for coherent graph structure' )
		rules.push( 'Include government transparency initiatives with clear relationship chains' )
		rules.push( 'Prioritize records that enhance node connectivity and narrative flow' )
	}

	// Chronological progression - optimized for React Flow layouts
	if ( historicalFilter.progression === 'forward' ) {
		rules.push( 'Emphasize chronological progression for temporal edge creation' )
		rules.push( 'Connect events that led to subsequent developments for clear flow direction' )
		rules.push( 'Structure results for horizontal or timeline-based React Flow layouts' )
	} else if ( historicalFilter.progression === 'backward' ) {
		rules.push( 'Trace historical antecedents for reverse chronological edge connections' )
		rules.push( 'Show causal relationships moving backward through time' )
		rules.push( 'Optimize for radial layouts showing historical convergence' )
	}

	// Mode-specific rules - React Flow layout optimization
	switch ( historicalFilter.mode ) {
		case 'chronological':
			rules.push( 'Maintain strict chronological ordering for linear React Flow layouts' )
			rules.push( 'Group events by periods for clustered node arrangements' )
			rules.push( 'Ensure clear temporal edge directions for optimal visual flow' )
			break
		case 'contextual':
			rules.push( 'Balance chronological accuracy with thematic node groupings' )
			rules.push( 'Create contextual clusters while maintaining temporal edge accuracy' )
			rules.push( 'Optimize for mixed radial and hierarchical React Flow layouts' )
			break
		case 'free-form':
			rules.push( 'Allow flexible exploration optimized for dynamic React Flow interactions' )
			rules.push( 'Maintain loose chronological awareness without strict positioning' )
			rules.push( 'Support organic node positioning based on user interaction patterns' )
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
