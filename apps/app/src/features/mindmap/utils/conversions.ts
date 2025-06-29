import type { Node } from '@xyflow/react'

// Enhanced interfaces for better type safety
export interface MindMapNodeData {
	label: string
	type: string
	[key: string]: any
}

export interface GraphNodeData extends MindMapNodeData {
	name: string
}

export interface EdgeData {
	source: string
	target: string
	id: string
	type?: string
	animated?: boolean
	label?: string
}

// Position validation and enhancement utilities
export interface PositionOptions {
	x?: number
	y?: number
	avoidCollisions?: boolean
	existingNodes?: Node[]
	minDistance?: number
}

export const convert3dNodeToMindMapNode = (threeDNode: any, positionOptions?: PositionOptions) => {
	try {
		if (!threeDNode) {
			throw new Error('convert3dNodeToMindMapNode: Invalid threeDNode parameter')
		}

		const { id, label, name, fill, data } = threeDNode
		
		if (!id) {
			throw new Error('convert3dNodeToMindMapNode: Node must have an id')
		}

		const title = label || name || `Node ${id}`

		const position = calculateNodePosition(positionOptions)

		return {
			id: String(id),
			position,
			data: {
				...data,
				label: title,
				fill: fill || '#ffffff',
				type: '3d-node'
			},
			type: "enhancedEntityNodePOC",
		}
	} catch (error) {
		console.error('convert3dNodeToMindMapNode: Conversion failed:', error)
		
		// Return a fallback node to prevent crashes
		return {
			id: threeDNode?.id ? String(threeDNode.id) : 'fallback-node',
			position: { x: 0, y: 0 },
			data: {
				label: 'Error Node',
				type: 'error'
			},
			type: "enhancedEntityNodePOC",
		}
	}
}

export const convertDatabaseRecordToMindMapNode = (record: any, positionOptions?: PositionOptions) => {
	try {
		if (!record) {
			throw new Error('convertDatabaseRecordToMindMapNode: Invalid record parameter')
		}

		const { id, xata, name, title, ...rest } = record
		
		if (!id) {
			throw new Error('convertDatabaseRecordToMindMapNode: Record must have an id')
		}

		const nodeTitle = title || name || `Record ${id}`
		const position = calculateNodePosition(positionOptions)

		return {
			id: String(id),
			position,
			data: {
				...rest,
				label: nodeTitle,
				type: 'database-record'
			},
			type: "enhancedEntityNodePOC",
		}
	} catch (error) {
		console.error('convertDatabaseRecordToMindMapNode: Conversion failed:', error)
		
		// Return a fallback node to prevent crashes
		return {
			id: record?.id ? String(record.id) : 'fallback-record',
			position: { x: 0, y: 0 },
			data: {
				label: 'Error Record',
				type: 'error'
			},
			type: "enhancedEntityNodePOC",
		}
	}
}

export const convertDatabaseRecordToGraphNode = ({ record, type }: { record: any; type: string }) => {
	try {
		if (!record) {
			throw new Error('convertDatabaseRecordToGraphNode: Invalid record parameter')
		}

		if (!type || typeof type !== 'string') {
			throw new Error('convertDatabaseRecordToGraphNode: Invalid type parameter')
		}

		const { id, name, label, title, ...rest } = record
		
		if (!id) {
			throw new Error('convertDatabaseRecordToGraphNode: Record must have an id')
		}

		const nodeTitle = title || name || label || `${type} ${id}`

		const node: GraphNodeData = {
			id: String(id),
			label: nodeTitle,
			data: {
				...rest,
				name: nodeTitle,
				label: nodeTitle,
				type: type.toLowerCase(),
			},
		}
		
		return node
	} catch (error) {
		console.error('convertDatabaseRecordToGraphNode: Conversion failed:', error)
		
		// Return a fallback node
		return {
			id: record?.id ? String(record.id) : 'fallback-graph-node',
			label: 'Error Node',
			data: {
				name: 'Error Node',
				label: 'Error Node',
				type: type || 'error',
			},
		}
	}
}

export const formatGraphEdge = ({ targetNode, sourceNode, edgeType }: { 
	targetNode: any; 
	sourceNode: any; 
	edgeType?: string 
}): EdgeData => {
	try {
		if (!targetNode?.id || !sourceNode?.id) {
			throw new Error('formatGraphEdge: Both source and target nodes must have ids')
		}

		const edge: EdgeData = {
			source: String(sourceNode.id),
			target: String(targetNode.id),
			id: `${sourceNode.id}->${targetNode.id}`,
			type: edgeType || 'smoothstep',
			animated: true,
			label: `${sourceNode.label || sourceNode.id} → ${targetNode.label || targetNode.id}`
		}
		
		return edge
	} catch (error) {
		console.error('formatGraphEdge: Edge formatting failed:', error)
		
		// Return a fallback edge
		return {
			source: sourceNode?.id ? String(sourceNode.id) : 'unknown-source',
			target: targetNode?.id ? String(targetNode.id) : 'unknown-target',
			id: `fallback-edge-${Date.now()}`,
			type: 'default'
		}
	}
}

// Enhanced positioning utilities
function calculateNodePosition(options?: PositionOptions): { x: number; y: number } {
	try {
		if (!options) {
			return { x: 0, y: 0 }
		}

		const { x = 0, y = 0, avoidCollisions = false, existingNodes = [], minDistance = 50 } = options

		const preferredPosition = { x, y }

		if (!avoidCollisions || existingNodes.length === 0) {
			return preferredPosition
		}

		// Check if preferred position has collisions
		if (isPositionValid(preferredPosition, existingNodes, minDistance)) {
			return preferredPosition
		}

		// Find alternative position
		return findOptimalPosition(existingNodes, preferredPosition, minDistance)
	} catch (error) {
		console.error('calculateNodePosition: Error calculating position:', error)
		return { x: 0, y: 0 }
	}
}

function isPositionValid(
	position: { x: number; y: number },
	existingNodes: Node[],
	minDistance: number
): boolean {
	try {
		for (const node of existingNodes) {
			if (!node?.position) continue

			const distance = Math.sqrt(
				Math.pow(position.x - node.position.x, 2) + 
				Math.pow(position.y - node.position.y, 2)
			)

			if (distance < minDistance) {
				return false
			}
		}

		return true
	} catch (error) {
		console.warn('isPositionValid: Error validating position:', error)
		return false
	}
}

function findOptimalPosition(
	existingNodes: Node[],
	preferredPosition: { x: number; y: number },
	minDistance: number
): { x: number; y: number } {
	try {
		// Try spiral pattern around preferred position
		const maxRadius = 300
		const angleStep = Math.PI / 4 // 45 degrees
		const radiusStep = minDistance

		for (let radius = radiusStep; radius <= maxRadius; radius += radiusStep) {
			for (let angle = 0; angle < 2 * Math.PI; angle += angleStep) {
				const candidate = {
					x: preferredPosition.x + radius * Math.cos(angle),
					y: preferredPosition.y + radius * Math.sin(angle)
				}

				if (isPositionValid(candidate, existingNodes, minDistance)) {
					return candidate
				}
			}
		}

		// Fallback: return preferred position with warning
		console.warn('findOptimalPosition: Could not find collision-free position')
		return preferredPosition
	} catch (error) {
		console.error('findOptimalPosition: Error finding optimal position:', error)
		return preferredPosition
	}
}

// Enhanced node creation with positioning
export const createEnhancedUserInputNode = (
	id: string,
	input: string,
	position: { x: number; y: number },
	existingNodes: Node[] = [],
	entityType?: string
) => {
	try {
		const enhancedPosition = calculateNodePosition({
			...position,
			avoidCollisions: true,
			existingNodes,
			minDistance: 100
		})

		return {
			id: String(id),
			type: 'userInputNode',
			position: enhancedPosition,
			data: {
				input,
				label: input,
				entityType: entityType || 'general',
				timestamp: new Date().toISOString()
			}
		}
	} catch (error) {
		console.error('createEnhancedUserInputNode: Error creating node:', error)
		
		return {
			id: String(id),
			type: 'userInputNode',
			position,
			data: {
				input: input || 'Error Node',
				label: input || 'Error Node',
				entityType: 'error'
			}
		}
	}
}

export const createEnhancedEntityNode = (
	id: string,
	data: any,
	position: { x: number; y: number },
	existingNodes: Node[] = []
) => {
	try {
		const enhancedPosition = calculateNodePosition({
			...position,
			avoidCollisions: true,
			existingNodes,
			minDistance: 80
		})

		return {
			id: String(id),
			type: 'enhancedEntityNodePOC',
			position: enhancedPosition,
			data: {
				...data,
				label: data.label || data.name || data.title || `Entity ${id}`,
				timestamp: new Date().toISOString()
			}
		}
	} catch (error) {
		console.error('createEnhancedEntityNode: Error creating node:', error)
		
		return {
			id: String(id),
			type: 'enhancedEntityNodePOC',
			position,
			data: {
				label: 'Error Entity',
				type: 'error'
			}
		}
	}
}

// Export types for external use
export type { MindMapNodeData, GraphNodeData, EdgeData, PositionOptions }
