"use client";

import type { MindMapContextType } from "@/contexts/mindmap/mindmap.interface";
import { useStateOfDisclosure } from "@/contexts/state-of-disclosure-provider";
import type { DatabaseSchema } from "@/db/xata";
import {
	BASE_ENTITY_NODE_HEIGHT,
	BASE_ENTITY_NODE_WIDTH,
	CHILD_DIMENSIONS,
	GROUP_NODE_DIMENSIONS,
	GROUP_NODE_LANDSCAPE,
	PADDING,
	ROOT_DIMENSIONS,
	ROOT_NODE_HEIGHT,
	ROOT_NODE_POSITIONS,
	ROOT_NODE_WIDTH,
	entityGroupNodeBaseConfig,
} from "@/features/mindmap/config/index.config";
import {
	type MindMapNode,
	fetchNextMindmapRecords,
} from "@/features/mindmap/queries/fetch-next-mindmap-records";
import type { MindMapState } from "@/features/mindmap/store";
import { useMindMapStore } from "@/features/mindmap/store";
import { use3DGraph } from "@/hooks/use3dGraph";
import { DOMAIN_MODEL_COLORS } from "@/utils";
import { capitalize } from "@/utils/functions";
import {
	type Edge,
	type Node,
	type XYPosition,
	useConnection,
	useEdges,
	useHandleConnections,
	useNodeConnections,
	useNodes,
	useNodesData,
	useReactFlow,
	useUpdateNodeInternals,
} from "@xyflow/react";
import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { useShallow } from "zustand/react/shallow";

export type RootNodeKey =
	| "events-root-node"
	| "personnel-root-node"
	| "testimonies-root-node"
	| "topics-root-node"
	| "organizations-root-node"
	| "documents-root-node"
	| "artifacts-root-node";

// Type for positions
type FlowPosition = {
	x: number;
	y: number;
	zoom?: number;
	duration?: number;
};

// Type for adding connection nodes from search
type AddConnectionNodesFromSearchParams = {
	source: {
		id: string;
		position?: XYPosition;
		data?: Record<string, unknown>;
		type?: string;
	};
	searchResults: Array<{
		id?: string;
		type?: string;
		name?: string;
		label?: string;
		position?: XYPosition;
		data?: Record<string, unknown>;
	}>;
};
// Create a selector for the store values we need
const storeSelector = (store: MindMapState) => ({
	nodes: store.nodes,
	edges: store.edges,
	addNodes: store.addNodes,
	addEdges: store.addEdges,
	onNodesChange: store.onNodesChange,
	onEdgesChange: store.onEdgesChange,
	onConnect: store.onConnect,
	onNodesDelete: store.onNodesDelete,
	setNodes: store.setNodes,
	setEdges: store.setEdges,
	addNode: store.addNode,
	updateNodeData: store.updateNodeData,
	deleteNode: store.deleteNode,
	addEdge: store.addEdge,
	updateEdgeData: store.updateEdgeData,
});

// Define context interface with utility functions and UI store

// Create the context
export const MindMapContext = createContext<MindMapContextType | null>(null);

// Provider component
export const MindMapProvider = ({
	children,
}: { children: React.ReactNode }) => {
	// Access the Zustand store with the shallow selector
	const store = useMindMapStore(useShallow(storeSelector));

	// Get ReactFlow utilities
	const reactFlowInstance = useReactFlow();

	// Local state for UI and visualization
	const [graph, setGraph] = useState<
		Record<string, { nodes: Node[]; edges: Edge[] }>
	>({});
	const [activeNode, setActiveNode] = useState<Node | null>(null);
	const [conciseViewActive, setConciseViewActive] = useState<boolean>(true);
	const [showLocationVisualization, setShowLocationVisualization] =
		useState<boolean>(false);
	const [locationsToVisualize, setLocationsToVisualize] = useState<
		Array<Record<string, unknown>>
	>([]);
	const [keepLoadedOnMap, setKeepLoadedOnMap] = useState<boolean>(false);
	const [mindMapInstance, setMindMapInstance] = useState<Record<
		string,
		unknown
	> | null>(null);
	const [rootNodeState, setRootNodeState] = useState<
		Record<RootNodeKey, { lastIndex: number; cursor?: string }>
	>({
		"events-root-node": { lastIndex: 0 },
		"personnel-root-node": { lastIndex: 0 },
		"testimonies-root-node": { lastIndex: 0 },
		"topics-root-node": { lastIndex: 0 },
		"organizations-root-node": { lastIndex: 0 },
		"documents-root-node": { lastIndex: 0 },
		"artifacts-root-node": { lastIndex: 0 },
	});

	// Access state of disclosure
	const { mindMapIntialGraphState } = useStateOfDisclosure();
	const { graph3d } = use3DGraph({ mindMapIntialGraphState }) as {
		graph3d: Record<string, Record<string, unknown>>;
	};

	// Configuration
	const childNodeBatchSize = 3;
	const flowKey = "mindmap-cache";

	// Local state management functions
	const updateActiveNode = useCallback(
		(node: Node | null) => setActiveNode(node),
		[],
	);
	const toggleConciseView = useCallback(
		() => setConciseViewActive((prev) => !prev),
		[],
	);
	const turnOffConciseView = useCallback(() => setConciseViewActive(false), []);
	const turnOnConciseView = useCallback(() => setConciseViewActive(true), []);
	const toggleLocationVisualization = useCallback(
		() => setShowLocationVisualization((prev) => !prev),
		[],
	);
	const closeLocationVisualization = useCallback(
		() => setShowLocationVisualization(false),
		[],
	);
	const addLocationsToVisualize = useCallback(
		(locations: Array<Record<string, unknown>>) => {
			setLocationsToVisualize((prev) => [...prev, ...locations]);
		},
		[],
	);
	const toggleKeepLoaded = useCallback(
		() => setKeepLoadedOnMap((prev) => !prev),
		[],
	);

	// Root node creation
	const createRootNode = useCallback(
		(
			node: {
				id: string;
				label?: string;
				name?: string;
				fill?: string;
				data: Record<string, unknown> & { type: string };
				childNodes?: Array<unknown>;
			},
			index: number,
		) => {
			const { id, label, name, fill, data } = node;
			const title = label || name;
			const childCount = node?.childNodes ? node?.childNodes?.length : 0;

			return {
				id,
				type: "rootNode",
				position:
					ROOT_NODE_POSITIONS[data.type as keyof typeof ROOT_NODE_POSITIONS],
				data: {
					childCount,
					...data,
					label: title,
					fill,
				},
			};
		},
		[],
	);

	// Node creation
	const createRootNodeChild = useCallback(
		(node: {
			id: string;
			label?: string;
			name?: string;
			fill?: string;
			data: Record<string, unknown>;
		}) => {
			const { id, label, name, fill, data } = node;
			const title = label || name;

			return {
				id,
				data: {
					...data,
					label: title,
					fill,
				},
				type: "entityNode",
			};
		},
		[],
	);

	// Edge creation utilities
	const createSiblingEdge = useCallback(
		(sourceNode: { id: string }, targetNode: { id: string }, type?: string) => {
			const id = `${sourceNode.id}:${targetNode.id}`;
			const edgeType = type || "siblingEdge";

			return {
				id,
				source: sourceNode.id,
				target: targetNode.id,
				animated: true,
				type: edgeType,
				markerEnd: "custom-marker",
				style: {
					stroke: "#fff",
				},
				sourceHandle: `handle:${id}`,
			};
		},
		[],
	);

	const createRootNodeEdge = useCallback(
		(
			rootNodeChildNode: { id: string; data?: Record<string, unknown> },
			source: string | { id: string; data?: Record<string, unknown> },
		) => {
			const isObject = typeof source === "object";
			const isString = typeof source === "string";
			const sourceNode = isString
				? reactFlowInstance.getNode(source)
				: isObject
					? source
					: null;

			if (!sourceNode) return null;

			const id = `${sourceNode.id}:${rootNodeChildNode.id}`;

			return {
				id,
				source: sourceNode.id,
				target: rootNodeChildNode.id,
				animated: true,
				type: "rootNodeEdge",
				markerEnd: "custom-marker",
				style: {
					stroke: "#fff",
				},
				sourceHandle: `handle:${id}`,
			};
		},
		[reactFlowInstance],
	);

	const createRootNodeEdges = useCallback(
		(rootNodeChildNodes: Node[], source: any) => {
			return rootNodeChildNodes.map((node) => createRootNodeEdge(node, source));
		},
		[createRootNodeEdge],
	);

	// Node positioning
	const assignPositionsToChildNodes = useCallback(
		(parentNode: any, childNodes: any[]): any[] => {
			const existingChildren = parentNode?.data?.children;
			const bounds = existingChildren
				? reactFlowInstance.getNodesBounds(existingChildren)
				: null;

			const rectX = bounds ? bounds.x : parentNode.position.x;
			const rectY = bounds ? bounds.y : parentNode.position.y;

			let currentX = rectX + ROOT_DIMENSIONS.width + PADDING;
			let currentY = rectY + ROOT_DIMENSIONS.height + PADDING;

			return childNodes.map((childNode) => {
				currentX += CHILD_DIMENSIONS.width + PADDING;
				if (currentX + CHILD_DIMENSIONS.width > rectX + 500) {
					currentX = rectX;
					currentY += CHILD_DIMENSIONS.height + PADDING;
				}

				return {
					...childNode,
					position: { x: currentX, y: currentY },
				};
			});
		},
		[reactFlowInstance],
	);

	// Helper functions for layout
	function calculateDiagonal(width: number, height: number) {
		return Math.sqrt(width ** 2 + height ** 2);
	}

	function calculateCircumcircleRadius(width: number, height: number): number {
		const diagonal = calculateDiagonal(width, height);
		return diagonal / 2;
	}

	// Mind map persistence
	const saveMindMap = useCallback(async () => {
		if (mindMapInstance) {
			const json = mindMapInstance.toObject();
			localStorage.setItem(flowKey, JSON.stringify(json));
		}
	}, [mindMapInstance]);

	const restore = useCallback(() => {
		const restoreFlow = async () => {
			const flow = JSON.parse(localStorage.getItem(flowKey) || "null");
			if (flow) {
				const { x = 0, y = 0, zoom = 1 } = flow.viewport;
				store.setNodes(flow.nodes || []);
				store.setEdges(flow.edges || []);
				reactFlowInstance.setViewport({ x, y, zoom });
			}
		};
		restoreFlow();
	}, [store, reactFlowInstance]);

	// Viewport adjustment
	const adjustViewport = useCallback(
		({ x, y, zoom = 0, duration = 800 }: FlowPosition) => {
			reactFlowInstance.setViewport({ x, y, zoom }, { duration });
		},
		[reactFlowInstance],
	);

	// Child node batch index management
	const updateChildNodeBatchIndex = useCallback(
		(type: RootNodeKey, amount?: number, cursor?: string) => {
			setRootNodeState(
				(
					state: Record<RootNodeKey, { lastIndex: number; cursor?: string }>,
				) => ({
					...state,
					[type]: {
						...state[type],
						lastIndex: state[type].lastIndex + (amount || childNodeBatchSize),
						...(cursor && { cursor }),
					},
				}),
			);
		},
		[childNodeBatchSize],
	);

	// Node detection functions
	const detectNodeOverlap = useCallback(
		(node: { id: string }): Node[] => {
			const source = reactFlowInstance.getNode(node.id);
			if (!source) return [];

			return reactFlowInstance.getIntersectingNodes(source);
		},
		[reactFlowInstance],
	);

	// Group and node management
	const addMindMapGroupNode = useCallback(
		({
			connectionNode,
			model,
			nodeType = "entityGroupNode",
			groupId,
			position,
		}: {
			model: string;
			childNodes?: any[];
			nodeType: string;
			position: XYPosition;
			groupId: string;
			connectionNode: Node;
		}) => {
			const edgeId = `${groupId}`;
			const newNode: any = {
				...entityGroupNodeBaseConfig,
				id: groupId,
				type: nodeType,
				data: { model },
				position,
			};

			const newEdge = {
				id: edgeId,
				source: connectionNode.id,
				target: newNode.id,
				type: "smoothstep",
			};

			store.addNodes(newNode);
			store.addEdges([newEdge]);
		},
		[store.addNodes, store.addEdges],
	);

	// Initialize graph from 3D graph data
	useEffect(() => {
		// Only set graph state if it's empty or null
		if (!graph || Object.keys(graph).length === 0) {
			const formattedGraphNodesObject: any = {};
			for (const key in graph3d) {
				const graphModel = graph3d[key];
				const tempNodes = graphModel.nodes.map(createRootNodeChild);
				const tempLinks = [].concat(
					...Object.keys(graphModel.links).map((key) => {
						const links = graphModel.links[key].connectedTo;
						return [...links];
					}),
				);

				formattedGraphNodesObject[key] = {
					nodes: tempNodes,
					edges: tempLinks,
				};
			}

			setGraph(formattedGraphNodesObject);
		}

		// const initialRootNodes = graph3d.root.nodes.map(createRootNode);
	}, [createRootNodeChild, graph, graph3d]);

	// Layout functions
	const createGroupNodeLayoutWithoutRootNode = useCallback(
		({ groupId, childNodes }: any) => {
			const model = groupId.split("-")[0];
			const isPersonnel = model === "personnel";
			const isEvents = model === "events";

			// Configure node based on type
			const personnelGroupNodeConfig = {
				id: groupId,
				type: "personnelGroupNode",
				initialHeight: 150,
				initialWidth: 450,
				style: {
					width: "450px",
					height: "150px",
					background: "none",
					border: "none",
				},
				data: {
					label: groupId,
					name: groupId,
				},
			};

			const constrainedConfig = {
				id: groupId,
				type: "entityGroupNode",
				data: {
					label: groupId,
					name: groupId,
					type: "base-config-group",
				},
				initialHeight: GROUP_NODE_DIMENSIONS.height,
				initialWidth: GROUP_NODE_DIMENSIONS.width,
				style: {
					// width: `${GROUP_NODE_DIMENSIONS.width}px`,
					// height: `${GROUP_NODE_DIMENSIONS.height}px`,
				},
			};

			const config = isPersonnel ? personnelGroupNodeConfig : constrainedConfig;
			const allNodes = reactFlowInstance.getNodes();
			const bounds = allNodes?.length
				? reactFlowInstance.getNodesBounds(allNodes)
				: null;

			// Decide position based on existing nodes
			const groupNodePosition = bounds
				? {
						x: bounds.x + bounds.width + PADDING,
						y: bounds.y,
					}
				: { x: 0, y: 0 };

			const groupNode: any = {
				...config,
				position: groupNodePosition,
			};

			// Configure child node layout
			const parentHeight = config.initialHeight;
			const parentWidth = config.initialWidth;
			const amount = model === "events" ? 4 : childNodeBatchSize;
			const divisor = model === "events" ? 3 : 0;
			const baseChildWidth = Math.floor(parentWidth / childNodeBatchSize);
			const childContainerStart =
				parentWidth - Math.floor(parentWidth / divisor);
			const childNodeHeight = isPersonnel ? 100 : baseChildWidth;
			const childNodeWidth = isPersonnel ? 150 : baseChildWidth;
			const centerX = (parentWidth - childNodeWidth) / 2;
			const horizontalSpacing = 0;

			let startX = childContainerStart;
			let xPosition = childContainerStart;
			let yPosition = 0;

			const suffix = capitalize(model);

			// Position children within the group
			const groupNodeChildren = childNodes.map(
				(childNode: any, index: number) => {
					startX += (childNodeWidth + horizontalSpacing) * index;

					if (isEvents) {
						// Grid layout for events
						if (index === 0) {
							xPosition = childNodeWidth;
							yPosition = 0;
						} else if (index === 1) {
							xPosition = childNodeWidth * 2;
							yPosition = 0;
						} else if (index === 2) {
							xPosition = childNodeWidth;
							yPosition = childNodeHeight;
						} else if (index === 3) {
							xPosition = childNodeWidth * 2;
							yPosition = childNodeHeight;
						}

						return {
							...childNode,
							type: `entityGroupNodeChild${suffix}`,
							position: reactFlowInstance.screenToFlowPosition({
								x: xPosition,
								y: yPosition,
							}),
							hidden: false,
							parentId: groupId,
							extent: "parent",
							className: groupId,
							style: {
								width: `${childNodeWidth}px`,
								height: `${childNodeHeight}px`,
							},
						};
					}
				},
			);

			groupNode.data.children = [...groupNodeChildren];
			return { groupNode, groupNodeChildren };
		},
		[reactFlowInstance],
	);

	// Node connection functions
	const addConnectionNodesFromSearch = useCallback(
		({ source, searchResults }: AddConnectionNodesFromSearchParams) => {
			const siblingSourceNode: any = reactFlowInstance.getNode(source.id);
			if (!siblingSourceNode) return null;

			const incomingNodes: any = [];
			const incomingEdges: any = [];
			const existingNodes = reactFlowInstance
				.getNodes()
				.filter((node: any) => node.id !== siblingSourceNode.id);
			const nodeRadius = calculateCircumcircleRadius(
				ROOT_NODE_WIDTH,
				ROOT_NODE_HEIGHT,
			);
			const circleRadius = searchResults.reduce((sum: number) => {
				return (
					sum + calculateCircumcircleRadius(ROOT_NODE_WIDTH, ROOT_NODE_HEIGHT)
				);
			}, 0);

			searchResults.forEach((result: { id?: any; type?: any }, i: number) => {
				const { type, id, ...rest } = result;

				// Calculate placement
				const totalNodes = searchResults.length;
				const angleIncrement = (2 * Math.PI) / totalNodes;
				let angle = i * angleIncrement;
				let x: number = siblingSourceNode.position.x;
				let y: number = siblingSourceNode.position.y;
				let positionFound = false;
				let attempts = 0;
				const maxAttempts = 10;

				// Find a non-overlapping position
				while (!positionFound && attempts < maxAttempts) {
					x = circleRadius * Math.cos(angle) + siblingSourceNode.position.x;
					y = circleRadius * Math.sin(angle) + siblingSourceNode.position.y;

					const overlaps = existingNodes.some((existingNode) => {
						const dx = existingNode.position.x - x;
						const dy = existingNode.position.y - y;
						const distance = Math.sqrt(dx * dx + dy * dy);
						return distance < nodeRadius * 2;
					});

					if (!overlaps) {
						positionFound = true;
					} else {
						angle += angleIncrement / 2;
						attempts++;
					}
				}

				// Create the node and edge
				const positionedNode = {
					id,
					type: `${type}Node`,
					label: rest?.label || rest?.name,
					data: {
						...rest,
						type,
					},
					position: { x, y },
				};

				const edgeId = `${siblingSourceNode.id}:${positionedNode.id}`;
				const siblingEdge = {
					id: edgeId,
					source: siblingSourceNode.id,
					target: positionedNode.id,
					animated: true,
					type: "siblingEdge",
					markerEnd: "custom-marker",
					style: {
						stroke: DOMAIN_MODEL_COLORS[type],
					},
					sourceHandle: `handle:${edgeId}`,
				};

				incomingNodes.push(positionedNode);
				incomingEdges.push(siblingEdge);
			});

			// Update source node with new handle connections
			const incomingSiblingHandles: any = incomingEdges.map(
				(edge: any) => edge.sourceHandle,
			);

			store.updateNodeData(siblingSourceNode.id, {
				handles: siblingSourceNode.data?.handles?.length
					? [...siblingSourceNode.data.handles, ...incomingSiblingHandles]
					: incomingSiblingHandles,
			});

			// Update graph
			store.addNodes(incomingNodes);
			store.addEdges(incomingEdges);

			return {
				siblingNodes: incomingNodes,
				siblingEdges: incomingEdges,
			};
		},
		[reactFlowInstance, store.updateNodeData, store.addNodes, store.addEdges],
	);

	// Node interaction functions
	const addUserInputNode = useCallback(
		({
			input,
			user,
			position,
		}: { input: string; user: string; position?: XYPosition }) => {
			const newNode = {
				id: `user-input-node-${Math.random().toString(36).substr(2, 9)}`,
				type: "userInputNode",
				position: position || { x: 0, y: 0 },
				data: { label: "New User Input Node", input, user },
			};
			store.addNode(newNode);
			return newNode;
		},
		[store.addNode],
	);

	// Connection finding
	const findConnections = useCallback(
		(node: any) => {
			const { id } = node;
			const { links } = mindMapIntialGraphState;
			const currentNodes = reactFlowInstance.getNodes();

			// Find all links to/from this node
			const nodeLinks = links
				.filter((link: any) => link.target === id || link.source === id)
				.map((link: any) => {
					if (link.target === id) return link.source;
					if (link.source === id) return link.target;
					return null;
				})
				.filter(Boolean);

			// Find the nodes on the map that match the links
			const connections = currentNodes.filter((nodeOnMap: any) =>
				nodeLinks.includes(nodeOnMap.id),
			);

			// Create edges to these connections
			const handles = connections.map((connection: any) =>
				createRootNodeEdge(node, connection),
			);

			// Update the node with the new connections
			store.updateNodeData(node.id, { ...node.data, handles });
			store.addEdges(handles);

			return connections;
		},
		[
			store.addEdges,
			createRootNodeEdge,
			reactFlowInstance,
			mindMapIntialGraphState,
			store.updateNodeData,
		],
	);

	// User input result rendering
	const renderUserInputResultsLayout = useCallback(
		({ groupId, sourceNode, results }: any) => {
			const model = capitalize(groupId.split("-")[0]);
			const childNodeType = `groupResultsNodeChild${model}`;

			// Initial configuration
			const initialConfig = {
				id: groupId,
				type: "groupResultsNode",
				initialHeight: GROUP_NODE_LANDSCAPE.height,
				initialWidth: GROUP_NODE_LANDSCAPE.width,
				label: groupId,
				style: {
					width: `${GROUP_NODE_LANDSCAPE.width}px`,
					height: `${GROUP_NODE_LANDSCAPE.height}px`,
				},
				data: {
					sourceNode,
					label: sourceNode.data.type,
					name: groupId,
					type: "groupResultsNode",
					childrenClassName: childNodeType,
				},
			};

			// Calculate position
			const allNodes = reactFlowInstance.getNodes();
			const bounds = reactFlowInstance.getNodesBounds(allNodes);
			const [{ position }]: any = assignPositionsToChildNodes(sourceNode, [
				initialConfig,
			]);

			const groupNode: any = {
				...initialConfig,
				position,
			};

			// Configure child layout
			const childNodeWidth = BASE_ENTITY_NODE_WIDTH;
			const childNodeHeight = BASE_ENTITY_NODE_HEIGHT;
			const parentHeight = GROUP_NODE_LANDSCAPE.height;
			const parentWidth = GROUP_NODE_LANDSCAPE.width;
			const centerY = (parentHeight - childNodeHeight) / 2;
			const horizontalSpacing = 20;
			const totalWidth =
				childNodeWidth * results.length +
				horizontalSpacing * (results.length - 1);
			const startX = (parentWidth - totalWidth) / 2;

			// Position child nodes
			const groupNodeChildren = results.map((childNode: any, index: any) => ({
				...childNode,
				type: childNodeType,
				position: {
					x: startX + index * (childNodeWidth + horizontalSpacing),
					y: centerY,
				},
				hidden: false,
				parentId: groupId,
				className: childNodeType,
				extent: "parent",
			}));

			groupNode.data.children = [...groupNodeChildren];
			return { groupNode, groupNodeChildren };
		},
		[assignPositionsToChildNodes, reactFlowInstance],
	);

	// Entity retrieval
	const retrieveEntitiesFromStore = useCallback(
		async (model: keyof DatabaseSchema): Promise<MindMapNode[]> => {
			console.log("🚀 ~ model:", model);

			const sourceModelIndex = `${model}-root-node` as RootNodeKey;

			const sourceModelNodesState = rootNodeState[sourceModelIndex];
			console.log("🚀 ~ sourceModelNodesState:", sourceModelNodesState);
			const { lastIndex, cursor } = sourceModelNodesState;

			console.log("🚀 ~ lastIndex:", lastIndex);
			console.log("🚀 ~ cursor:", cursor);

			// Static Node slice for testing
			const nextNodes = graph[model]?.nodes.slice(
				lastIndex,
				lastIndex + childNodeBatchSize,
			);

			console.log("🚀 ~ nextNodes:", nextNodes);

			// Call the server action and await the response
			const result = await fetchNextMindmapRecords({
				table: model,
				size: childNodeBatchSize,
				offset: lastIndex,
				cursor, // Pass the cursor if available
			});

			// Get the nodes and cursor from the result
			const { nodes, meta } = result;

			// Update the cursor for next fetch
			updateChildNodeBatchIndex(sourceModelIndex, undefined, meta.cursor);

			// Return the entity nodes
			console.log("🚀 ~ nodes:", nodes);
			return nodes;
		},
		[rootNodeState, updateChildNodeBatchIndex],
	);

	// Entity loading functions
	const addNextEntitiesToMindMap = useCallback(
		async (source: any) => {
			const {
				type: nodeType,
				data: { type: model },
			} = source;

			const isUserInputNode = nodeType === "userInputNode";
			const amount = model === "events" ? 4 : childNodeBatchSize;
			const sourceModelIndex = `${model}-root-node` as RootNodeKey;

			// Get the next batch of nodes using the server action
			const resultNodes = await retrieveEntitiesFromStore(
				model as keyof DatabaseSchema,
			);

			// If no nodes were returned, return early
			if (!resultNodes || resultNodes.length === 0) {
				console.log("No more records to load");
				return null;
			}

			const groupId = `${model}-group-${Date.now()}`;

			// Create the group layout
			const { groupNode, groupNodeChildren }: any = isUserInputNode
				? renderUserInputResultsLayout({
						groupId,
						sourceNode: source,
						results: resultNodes,
					})
				: createGroupNodeLayoutWithoutRootNode({
						groupId,
						childNodes: resultNodes,
					});

			// Create edges connecting the group node to the source node
			const edgeId = `${source.id}:${groupNode.id}`;
			const edge = {
				id: edgeId,
				source: source.id,
				target: groupNode.id,
				sourceHandle: `${source.id}:${groupNode.id}`,
				targetHandle: `${groupNode.id}:${source.id}`,
				data: { label: "related" },
				type: "siblingEdge",
			};

			const sourceHandles = source.data?.handles || [];

			// Add the handle to the source node data
			store.updateNodeData(source.id, {
				handles: [...sourceHandles, edge.sourceHandle],
			});

			// Add children nodes to the graph
			store.addNodes([groupNode, ...groupNodeChildren]);
			store.addEdges(edge);

			// Return the created nodes for further processing
			return {
				groupNode,
				groupNodeChildren,
			};
		},
		[
			rootNodeState,
			retrieveEntitiesFromStore,
			createGroupNodeLayoutWithoutRootNode,
			renderUserInputResultsLayout,
			childNodeBatchSize,
			store.addNodes,
			store.addEdges,
			store.updateNodeData,
			graph,
		],
	);

	// Layout functions
	const createSearchResultsLayout = useCallback(
		({ sourceNode, searchResults }: any) => {
			const searchResultNodes: any = [];
			const searchResultEdges: any = [];

			searchResults.forEach((result: any, i: any) => {
				const { type } = result;
				const node = graph[type]?.nodes.find(
					(node: { id: any }) => node?.id === result.id,
				);
				p;

				if (node) {
					const degrees = i * (360 / 8);
					const radians = degrees * (Math.PI / 180);
					const x = 250 * Math.cos(radians) + sourceNode.position.x;
					const y = 250 * Math.sin(radians) + sourceNode.position.y;

					const searchResultNode = {
						...node,
						position: { x, y },
					};

					const siblingEdge = createSiblingEdge(
						searchResultNode,
						sourceNode,
						"floating",
					);
					searchResultNodes.push(searchResultNode);
					searchResultEdges.push(siblingEdge);
				}
			});

			const searchResultHandles: any = searchResultEdges.map(
				(edge: any) => edge.sourceHandle,
			);

			store.updateNodeData(sourceNode.id, {
				handles: sourceNode.data.handles
					? [...sourceNode.data.handles, ...searchResultHandles]
					: searchResultHandles,
			});

			store.addNodes(searchResultNodes);
			store.addEdges(searchResultEdges);

			return { searchResultNodes, searchResultEdges };
		},
		[
			store.addNodes,
			store.addEdges,
			createSiblingEdge,
			graph,
			store.updateNodeData,
		],
	);

	// Entity management
	const addMindmapChildNode = useCallback(
		({
			parentNode,
			type,
			childNode,
			position,
		}: {
			parentNode: Node;
			type: string;
			childNode: any;
			position: XYPosition;
		}) => {
			const nodeType = `${type || childNode.type}Node`;
			const edgeId = `${parentNode.id}:${childNode.id}`;

			const newNode: any = {
				...childNode,
				type: nodeType,
				position,
				parentId: parentNode.id,
			};

			const newEdge: any = {
				id: edgeId,
				source: parentNode.id,
				target: newNode.id,
				type: "smoothstep",
			};

			return { newNode, newEdge };
		},
		[],
	);

	// Database query functions
	const loadNodesFromTableQuery = useCallback(
		async ({ type, searchResults, searchTerm }: any) => {
			const groupId = `${type}-group-${searchTerm}`;

			// Map search results to nodes
			const childNodes = searchResults
				.map((result: any) => {
					return graph[type]?.nodes.find(
						(node: { id: any }) => node?.id === result.id,
					);
				})
				.filter(Boolean);

			// Create the group layout
			const { groupNode, groupNodeChildren }: any =
				createGroupNodeLayoutWithoutRootNode({
					groupId,
					childNodes,
				});

			// Add the nodes to the graph
			store.addNodes([groupNode, ...groupNodeChildren]);

			return {
				childNodes: {
					groupNode,
					groupNodeChildren,
				},
			};
		},
		[createGroupNodeLayoutWithoutRootNode, graph, store.addNodes],
	);

	// Define the context value
	const contextValue: MindMapContextType = {
		// Store state and actions
		...store,

		// Context-specific state
		// @ts-ignore
		graph,

		// @ts-ignore
		activeNode,

		conciseViewActive,
		showLocationVisualization,
		locationsToVisualize,
		keepLoadedOnMap,
		mindMapInstance,

		// Context state setters
		// @ts-ignore
		setGraph,

		// @ts-ignore
		updateActiveNode,

		toggleConciseView,
		turnOffConciseView,
		turnOnConciseView,
		toggleLocationVisualization,
		closeLocationVisualization,
		addLocationsToVisualize,
		toggleKeepLoaded,
		setMindMapInstance,
		useNodeConnections,
		useConnection,
		useHandleConnections,
		useEdges,
		useNodes,
		useUpdateNodeInternals,
		// Utility functions
		// @ts-ignore
		createRootNodeEdges,

		assignPositionsToChildNodes,
		// @ts-ignore
		detectNodeOverlap,

		// @ts-ignore
		addMindMapGroupNode,

		// ReactFlow utilities
		fitView: reactFlowInstance.fitView,
		screenToFlowPosition: reactFlowInstance.screenToFlowPosition,
		// @ts-ignore
		getNode: reactFlowInstance.getNode,
		getNodes: reactFlowInstance.getNodes,
		getEdges: reactFlowInstance.getEdges,

		adjustViewport,
		zoomIn: reactFlowInstance.zoomIn,
		zoomOut: reactFlowInstance.zoomOut,
		saveMindMap,
		restore,

		// Additional utility methods would be implemented and added here
		reactFlowInstance,
		useNodesData,
		addConnectionNodesFromSearch,
		// @ts-ignore
		addUserInputNode,

		// @ts-ignore
		// @ts-ignore
		findConnections,
		// @ts-ignore
		retrieveEntitiesFromStore,
		// @ts-ignore
		addNextEntitiesToMindMap,
		createSearchResultsLayout,
		// @ts-ignore - This function now returns Promise<MindMapNode[]> instead of any[]
		addMindmapChildNode,

		loadNodesFromTableQuery,
	};

	return (
		<MindMapContext.Provider value={contextValue}>
			<div id="mindmap-container">{children}</div>
		</MindMapContext.Provider>
	);
};

// Custom hook to access the context
export const useMindMap = () => {
	const context = useContext(MindMapContext);

	if (!context) {
		throw new Error("useMindMap must be used within a MindMapProvider");
	}

	return context;
};
export type { AddConnectionNodesFromSearchParams };
