import { useCallback } from "react";
import { Position } from "@xyflow/react";
import { enhanceLayoutWithAI } from "@/features/mindmap/actions/ai-actions";

interface Entity {
	id: string;
	[key: string]: any;
}

interface UseAILoadingProps {
	addNodes: (nodes: any[]) => void;
	addEdges: (edges: any[]) => void;
	getCenter: () => { x: number; y: number };
	updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
}

interface LoadRecordsParams {
	entities: Entity[];
	type: string;
	sourceNodeId: string;
	amount?: number;
}

export function useAILoading({
	addNodes,
	addEdges,
	getCenter,
	updateNodeData,
}: UseAILoadingProps) {
	// Function to compute child positions
	const computeChildPositions = useCallback(
		(parentNodeId: string, childCount: number) => {
			const entityWidth = 200;
			const entitySpacing = 20;
			const totalWidth =
				childCount * entityWidth + (childCount - 1) * entitySpacing;
			const center = getCenter();
			const startX = center.x - totalWidth / 2;
			const childY = center.y + 200;

			return {
				startX,
				childY,
				entityWidth,
				entitySpacing,
			};
		},
		[getCenter],
	);

	// Main function to load records with AI enhancement
	const loadRecordsWithAI = useCallback(
		async ({ entities, type, sourceNodeId, amount = 5 }: LoadRecordsParams) => {
			if (!entities || entities.length === 0) {
				updateNodeData(sourceNodeId, {
					label: `No ${type} Data`,
					input: `No ${type} records found`,
					isLoading: false,
					isError: true,
				});
				return;
			}

			// Update node to show we're analyzing data
			updateNodeData(sourceNodeId, {
				label: `Analyzing ${type}`,
				input: `Analyzing ${entities.length} ${type} records...`,
				isLoading: true,
			});

			try {
				// Try to use AI to enhance layout if available
				const enhancedLayout = await enhanceLayoutWithAI({
					entities,
					sourceNodeId,
					entityType: type,
				});

				// If we got AI layout suggestions
				if (enhancedLayout?.success && enhancedLayout.positions) {
					// Update the source node with insight
					updateNodeData(sourceNodeId, {
						label: `${type} Analysis`,
						input:
							enhancedLayout.summary ||
							`Analysis of ${entities.length} ${type} records`,
						isLoading: false,
					});

					// Position nodes using AI suggestions
					const childNodes = entities.map((entity: Entity) => ({
						...entity,
						type: "enhancedEntityNodePOC",
						position: enhancedLayout.positions?.[entity.id] || {
							// Fallback positioning logic
							x: Math.random() * 800 - 400 + getCenter().x,
							y: Math.random() * 400 + 100 + getCenter().y,
						},
						parentId: sourceNodeId,
					}));

					// Create enhanced edges
					const edges = entities.map((entity: Entity) => ({
						id: `${sourceNodeId}-${entity.id}`,
						source: sourceNodeId,
						target: entity.id,
						// Use AI animated edge if we have relationship data
						type: "aiAnimatedEdge",
						data: {
							animated: true,
							pathType: "bezier",
							relationType:
								enhancedLayout.relationships?.[entity.id]?.type || "default",
						},
					}));

					// Add nodes and edges to the graph
					addNodes(childNodes);
					addEdges(edges);

					// If we have insights, add annotation node
					if (enhancedLayout.insights && enhancedLayout.insights.length > 0) {
						const mainInsight = enhancedLayout.insights[0];

						if (mainInsight) {
							// Add an AI annotation node
							addNodes([
								{
									id: `ai-annotation-${Date.now()}`,
									type: "aiAnnotationNode",
									position: {
										x: getCenter().x + 300,
										y: getCenter().y - 100,
									},
									data: {
										text: mainInsight.text || `Analysis of ${type}`,
										label: mainInsight.label || "AI Insight",
										insightType: mainInsight.type || "insight",
										relatedNodeIds: [
											sourceNodeId,
											...entities.map((e: Entity) => e.id),
										],
									},
								},
							]);
						}
					}
				} else {
					// Fallback to standard layout if AI enhancement failed
					const { startX, childY, entityWidth, entitySpacing } =
						computeChildPositions(sourceNodeId, entities.length);

					// Update the source node
					updateNodeData(sourceNodeId, {
						label: `${type} Data`,
						input: `Loaded ${entities.length} ${type} records`,
						isLoading: false,
					});

					// Position child nodes using standard layout
					const childNodes = entities.map((entity: Entity, index: number) => ({
						...entity,
						type: "enhancedEntityNodePOC",
						position: {
							x: startX + index * (entityWidth + entitySpacing),
							y: childY,
						},
						parentId: sourceNodeId,
					}));

					// Create standard edges
					const edges = entities.map((entity: Entity) => ({
						id: `${sourceNodeId}-${entity.id}`,
						source: sourceNodeId,
						target: entity.id,
						type: "smoothstep",
					}));

					// Add nodes and edges to the graph
					addNodes(childNodes);
					addEdges(edges);
				}
			} catch (error) {
				console.error("Error in AI loading:", error);

				// Fallback to standard layout on error
				const { startX, childY, entityWidth, entitySpacing } =
					computeChildPositions(sourceNodeId, entities.length);

				// Update the source node with error info
				updateNodeData(sourceNodeId, {
					label: `${type} Data`,
					input: `Loaded ${entities.length} ${type} records (AI enhancement failed)`,
					isLoading: false,
				});

				// Standard node positioning
				const childNodes = entities.map((entity: Entity, index: number) => ({
					...entity,
					type: "enhancedEntityNodePOC",
					position: {
						x: startX + index * (entityWidth + entitySpacing),
						y: childY,
					},
					parentId: sourceNodeId,
				}));

				// Standard edges
				const edges = entities.map((entity: Entity) => ({
					id: `${sourceNodeId}-${entity.id}`,
					source: sourceNodeId,
					target: entity.id,
					type: "smoothstep",
				}));

				// Add nodes and edges to the graph
				addNodes(childNodes);
				addEdges(edges);
			}
		},
		[addNodes, addEdges, updateNodeData, computeChildPositions, getCenter],
	);

	return {
		loadRecordsWithAI,
	};
}
