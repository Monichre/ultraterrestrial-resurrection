// "use client";

// import { use3DGraph } from "@/hooks/use3dGraph";
// import type React from "react";
// import {
// 	createContext,
// 	useCallback,
// 	useContext,
// 	useEffect,
// 	useState,
// } from "react";

// import {
// 	type Edge,
// 	type Node,
// 	type OnConnect,
// 	type OnEdgesChange,
// 	type OnNodesChange,
// 	type XYPosition,
// 	addEdge,
// 	applyEdgeChanges,
// 	applyNodeChanges,
// 	getConnectedEdges,
// 	getIncomers,
// 	getOutgoers,
// 	useInternalNode,
// 	useNodes,
// 	useNodesData,
// 	useReactFlow,
// 	useStoreApi,
// 	useUpdateNodeInternals,
// } from "@xyflow/react";

// import {
// 	BASE_ENTITY_NODE_HEIGHT,
// 	BASE_ENTITY_NODE_WIDTH,
// 	CHILD_DIMENSIONS,
// 	GROUP_NODE_DIMENSIONS,
// 	GROUP_NODE_LANDSCAPE,
// 	PADDING,
// 	ROOT_DIMENSIONS,
// 	ROOT_NODE_HEIGHT,
// 	ROOT_NODE_POSITIONS,
// 	ROOT_NODE_WIDTH,
// 	entityGroupNodeBaseConfig,
// } from "@/features/mindmap/config/index.config";

// import { useStateOfDisclosure } from "@/contexts/state-of-disclosure-provider";
// import type { DatabaseSchema } from "@/db/xata";
// import { DOMAIN_MODEL_COLORS } from "@/utils";
// import { capitalize } from "@/utils/functions";

// // Types
// type NodeData = {
// 	label?: string;
// 	name?: string;
// 	fill?: string;
// 	handles?: string[];
// 	children?: Node[];
// 	position?: XYPosition;
// 	style?: React.CSSProperties;
// 	className?: string;
// 	parentId?: string;
// 	extent?: string;
// 	hidden?: boolean;
// 	zIndex?: number;
// 	[key: string]: unknown;
// };

// type FlowPosition = {
// 	x: number;
// 	y: number;
// 	zoom?: number;
// 	duration?: number;
// };

// type AddConnectionNodesFromSearchParams = {
// 	source: {
// 		id: string;
// 		position?: XYPosition;
// 		data?: NodeData;
// 		type?: string;
// 	};
// 	searchResults: Array<{
// 		id?: string;
// 		type?: string;
// 		name?: string;
// 		label?: string;
// 		position?: XYPosition;
// 		data?: NodeData;
// 	}>;
// };

// // Define MindMap context interface
// interface MindMapContextType {
// 	nodes: Node[];
// 	setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void;
// 	edges: Edge[];
// 	setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void;
// 	graph: Record<string, { nodes: Node[]; edges: Edge[] }>;
// 	createRootNodeEdges: (nodes: Node[], source: string | Node) => Edge[];
// 	store: ReturnType<typeof useStoreApi>;
// 	addNodes: (nodes: Node | Node[]) => void;
// 	assignPositionsToChildNodes: (parentNode: Node, childNodes: Node[]) => Node[];
// 	addEdges: (edges: Edge | Edge[]) => void;
// 	updateNodes: (newNodes: Node[]) => void;
// 	getRootNodeChildren: (type: string) => Promise<{
// 		groupNode: Node;
// 		groupNodeChildren: Node[];
// 		incomingEdges: Edge[];
// 	}>;
// 	addConnectionNodesFromSearch: (
// 		params: AddConnectionNodesFromSearchParams,
// 	) => {
// 		siblingNodes: Node[];
// 		siblingEdges: Edge[];
// 	} | null;
// 	onNodesChange: OnNodesChange;
// 	onEdgesChange: OnEdgesChange;
// 	onConnect: OnConnect;
// 	getNodes: () => Node[];
// 	useUpdateNodeInternals: typeof useUpdateNodeInternals;
// 	fitView: () => void;
// 	getEdges: () => Edge[];
// 	useInternalNode: typeof useInternalNode;
// 	useNodes: typeof useNodes;
// 	screenToFlowPosition: (position: XYPosition) => XYPosition;
// 	useNodesData: typeof useNodesData;
// 	getOutgoers: typeof getOutgoers;
// 	updateNode: (id: string, nodeUpdates: Partial<Node["data"]>) => void;
// 	getNode: (id: string) => Node | undefined;
// 	adjustViewport: (params: FlowPosition) => void;
// 	zoomIn: () => void;
// 	zoomOut: () => void;

// 	// UI State
// 	activeNode: Node | null;
// 	updateActiveNode: (node: Node | null) => void;
// 	conciseViewActive: boolean;
// 	toggleConciseView: () => void;
// 	turnOffConciseView: () => void;
// 	turnOnConciseView: () => void;

// 	// Visualization features
// 	locationsToVisualize: any[];
// 	addLocationsToVisualize: (locations: any[]) => void;
// 	showLocationVisualization: boolean;
// 	toggleLocationVisualization: () => void;
// 	closeLocationVisualization: () => void;

// 	// Node management
// 	addUserInputNode: (params: {
// 		input: string;
// 		user: any;
// 		position?: XYPosition;
// 	}) => Node;
// 	findConnections: (node: Node) => Node[];
// 	addNextEntitiesToMindMap: (source: Node) => {
// 		groupNode: Node;
// 		groupNodeChildren: Node[];
// 	};
// 	detectNodeOverlap: (node: { id: string }) => Node[];

// 	// Mind map persistence
// 	updateMindMapInstance: (instance: any) => void;
// 	mindMapInstance: any;
// 	saveMindMap: () => Promise<void>;
// 	restore: () => void;

// 	// Layout functions
// 	organizeLayout: () => void;
// 	onNodesDelete: (nodes: Node[]) => void;
// 	createSearchResultsLayout: (params: {
// 		sourceNode: Node;
// 		searchResults: any[];
// 	}) => { searchResultNodes: Node[]; searchResultEdges: Edge[] };

// 	// Entity management
// 	retrieveEntitiesFromStore: (model: keyof DatabaseSchema) => any[];
// 	addMindmapChildNode: (params: {
// 		parentNode: Node;
// 		type: string;
// 		childNode: any;
// 		position: XYPosition;
// 	}) => { newNode: Node; newEdge: Edge };
// 	addMindMapGroupNode: (params: {
// 		connectionNode: Node;
// 		model: string;
// 		nodeType?: string;
// 		groupId: string;
// 		position: XYPosition;
// 	}) => void;

// 	// Reactflow functions
// 	getNodesBounds: (nodes: Node[]) => any;
// 	updateNodeData: (id: string, data: any) => void;
// 	getIntersectingNodes: (node: Node) => Node[];
// 	isNodeIntersecting: (node: Node, other: Node) => boolean;
// 	deleteElements: (params: { nodes?: Node[]; edges?: Edge[] }) => void;

// 	// Database loading
// 	loadNodesFromTableQuery: (params: {
// 		type: string;
// 		searchResults: any[];
// 		searchTerm: string;
// 	}) => Promise<{ childNodes: { groupNode: Node; groupNodeChildren: Node[] } }>;
// 	keepLoadedOnMap: boolean;
// 	toggleKeepLoaded: () => void;
// 	reactFlowInstance: any;
// }

// // Create the context with proper typing
// const MindMapContext = createContext<MindMapContextType | null>(null);

// export type RootNodeKey =
// 	| "events-root-node"
// 	| "personnel-root-node"
// 	| "testimonies-root-node"
// 	| "topics-root-node"
// 	| "organizations-root-node"
// 	| "documents-root-node"
// 	| "artifacts-root-node";

// export const MindMapProvider = ({
// 	children,
// }: { children: React.ReactNode }) => {
// 	// Get ReactFlow utilities
// 	const reactFlowInstance = useReactFlow();
// 	const {
// 		getNodes,
// 		fitView,
// 		getEdges,
// 		addNodes,
// 		addEdges,
// 		getNode,
// 		screenToFlowPosition,
// 		setViewport,
// 		getNodesBounds,
// 		zoomIn,
// 		updateNode,
// 		zoomOut,
// 		updateNodeData,
// 		getIntersectingNodes,
// 		isNodeIntersecting,
// 		deleteElements,
// 		zoomTo,
// 		setCenter,
// 	} = reactFlowInstance;

// 	const { mindMapIntialGraphState } = useStateOfDisclosure();
// 	const store = useStoreApi();
// 	const { graph3d } = use3DGraph({ mindMapIntialGraphState }) as {
// 		graph3d: Record<string, any>;
// 	};

// 	// Core state
// 	const [nodes, setNodes] = useState<Node[]>([]);
// 	const [edges, setEdges] = useState<Edge[]>([]);
// 	const [graph, setGraph] = useState<
// 		Record<string, { nodes: Node[]; edges: Edge[] }>
// 	>({});

// 	// Mind map state
// 	const [rootNodeState, setRootNodeState] = useState<
// 		Record<RootNodeKey, { lastIndex: number }>
// 	>({
// 		"events-root-node": { lastIndex: 0 },
// 		"personnel-root-node": { lastIndex: 0 },
// 		"testimonies-root-node": { lastIndex: 0 },
// 		"topics-root-node": { lastIndex: 0 },
// 		"organizations-root-node": { lastIndex: 0 },
// 		"documents-root-node": { lastIndex: 0 },
// 		"artifacts-root-node": { lastIndex: 0 },
// 	});

// 	// UI state
// 	const [mindMapInstance, setMindMapInstance] = useState<any>(null);
// 	const [conciseViewActive, setConciseViewActive] = useState<boolean>(true);
// 	const [activeNode, setActiveNode] = useState(null);
// 	const [showLocationVisualization, setShowLocationVisualization] =
// 		useState(false);
// 	const [locationsToVisualize, setLocationsToVisualize] = useState<any[]>([]);
// 	const [keepLoadedOnMap, setKeepLoadedOnMap] = useState(false);

// 	// Configuration
// 	const childNodeBatchSize = 3;
// 	const flowKey = "mindmap-cache";

// 	// UI state management functions
// 	const toggleConciseView = useCallback(
// 		() => setConciseViewActive((prev) => !prev),
// 		[],
// 	);
// 	const turnOffConciseView = useCallback(() => setConciseViewActive(false), []);
// 	const turnOnConciseView = useCallback(() => setConciseViewActive(true), []);
// 	const updateActiveNode = useCallback(
// 		(node: Node | null) => setActiveNode(node),
// 		[],
// 	);
// 	const closeLocationVisualization = useCallback(
// 		() => setShowLocationVisualization(false),
// 		[],
// 	);
// 	const toggleLocationVisualization = useCallback(
// 		() => setShowLocationVisualization((prev) => !prev),
// 		[],
// 	);
// 	const toggleKeepLoaded = useCallback(
// 		() => setKeepLoadedOnMap((prev) => !prev),
// 		[],
// 	);
// 	const updateMindMapInstance = useCallback(
// 		(instance: any) => setMindMapInstance(instance),
// 		[],
// 	);

// 	// Data collection functions
// 	const addLocationsToVisualize = useCallback((locations: any[]) => {
// 		setLocationsToVisualize((prev) => [...prev, ...locations]);
// 	}, []);

// 	// Mind map persistence
// 	const saveMindMap = useCallback(async () => {
// 		if (mindMapInstance) {
// 			const json = mindMapInstance.toObject();
// 			localStorage.setItem(flowKey, JSON.stringify(json));
// 		}
// 	}, [mindMapInstance, flowKey]);

// 	const restore = useCallback(() => {
// 		const restoreFlow = async () => {
// 			const flow = JSON.parse(localStorage.getItem(flowKey) || "null");
// 			if (flow) {
// 				const { x = 0, y = 0, zoom = 1 } = flow.viewport;
// 				setNodes(flow.nodes || []);
// 				setEdges(flow.edges || []);
// 				setViewport({ x, y, zoom });
// 			}
// 		};
// 		restoreFlow();
// 	}, [flowKey, setNodes, setEdges, setViewport]);

// 	// Root node management
// 	const createRootNode = useCallback((node: any, index: number) => {
// 		const { id, label, name, fill, data } = node;
// 		const title = label || name;
// 		const childCount = node?.childNodes ? node?.childNodes?.length : 0;

// 		return {
// 			id,
// 			type: "rootNode",
// 			position: ROOT_NODE_POSITIONS[data.type],
// 			data: {
// 				childCount,
// 				...data,
// 				label: title,
// 				fill,
// 			},
// 		};
// 	}, []);

// 	// Edge creation
// 	const createSiblingEdge = useCallback(
// 		(sourceNode: any, targetNode: any, type?: string) => {
// 			const id = `${sourceNode.id}:${targetNode.id}`;
// 			const edgeType = type || "siblingEdge";

// 			return {
// 				id,
// 				source: sourceNode.id,
// 				target: targetNode.id,
// 				animated: true,
// 				type: edgeType,
// 				markerEnd: "custom-marker",
// 				style: {
// 					stroke: "#fff",
// 				},
// 				sourceHandle: `handle:${id}`,
// 			};
// 		},
// 		[],
// 	);

// 	const createRootNodeEdge = useCallback(
// 		(rootNodeChildNode: any, source: any) => {
// 			const isObject = typeof source === "object";
// 			const isString = typeof source === "string";
// 			const sourceNode: any = isString
// 				? getNode(source)
// 				: isObject
// 					? source
// 					: getNode(source.id);

// 			const sourceId = sourceNode.id;
// 			const { id: target, data } = rootNodeChildNode;
// 			const id = `${sourceId}:${target}`;
// 			const edgeType = "siblingEdge";
// 			const connectionLabel = `${rootNodeChildNode.data?.label || rootNodeChildNode.data?.name}::${source?.data?.name || source?.data?.label}`;

// 			return {
// 				id,
// 				source: sourceId,
// 				target,
// 				animated: true,
// 				type: edgeType,
// 				markerEnd: "custom-marker",
// 				style: {
// 					stroke: DOMAIN_MODEL_COLORS[sourceNode?.data?.type],
// 				},
// 				label: connectionLabel || null,
// 				sourceHandle: `handle:${id}`,
// 			};
// 		},
// 		[getNode],
// 	);

// 	const createRootNodeEdges = useCallback(
// 		(rootNodeChildNodes: Node[], source: any) => {
// 			return rootNodeChildNodes.map((node) => createRootNodeEdge(node, source));
// 		},
// 		[createRootNodeEdge],
// 	);

// 	// Node positioning
// 	const assignPositionsToChildNodes = useCallback(
// 		(parentNode: any, childNodes: any[]): any[] => {
// 			const existingChildren = parentNode?.data?.children;
// 			const bounds = existingChildren ? getNodesBounds(existingChildren) : null;

// 			const rectX = bounds ? bounds.x : parentNode.position.x;
// 			const rectY = bounds ? bounds.y : parentNode.position.y;

// 			let currentX = rectX + ROOT_DIMENSIONS.width + PADDING;
// 			let currentY = rectY + ROOT_DIMENSIONS.height + PADDING;

// 			return childNodes.map((childNode) => {
// 				currentX += CHILD_DIMENSIONS.width + PADDING;
// 				if (currentX + CHILD_DIMENSIONS.width > rectX + 500) {
// 					currentX = rectX;
// 					currentY += CHILD_DIMENSIONS.height + PADDING;
// 				}

// 				return {
// 					...childNode,
// 					position: { x: currentX, y: currentY },
// 				};
// 			});
// 		},
// 		[getNodesBounds],
// 	);

// 	// Node creation
// 	const createRootNodeChild = useCallback((node: any) => {
// 		const { id, label, name, fill, data } = node;
// 		const title = label || name;

// 		return {
// 			id,
// 			data: {
// 				...data,
// 				label: title,
// 				fill,
// 			},
// 			type: "entityNode",
// 		};
// 	}, []);

// 	// Helper functions for layout
// 	function calculateDiagonal(width: number, height: number) {
// 		return Math.sqrt(width ** 2 + height ** 2);
// 	}

// 	function calculateCircumcircleRadius(width: number, height: number): number {
// 		const diagonal = calculateDiagonal(width, height);
// 		return diagonal / 2;
// 	}

// 	// Layout functions
// 	const createSearchResultsLayout = useCallback(
// 		({ sourceNode, searchResults }: any) => {
// 			const searchResultNodes: any = [];
// 			const searchResultEdges: any = [];

// 			searchResults.forEach((result: any, i: any) => {
// 				const { type } = result;
// 				const node = graph[type].nodes.find(
// 					(node: { id: any }) => node?.id === result.id,
// 				);

// 				const degrees = i * (360 / 8);
// 				const radians = degrees * (Math.PI / 180);
// 				const x = 250 * Math.cos(radians) + sourceNode.position.x;
// 				const y = 250 * Math.sin(radians) + sourceNode.position.y;

// 				const searchResultNode = {
// 					...node,
// 					position: { x, y },
// 				};

// 				const siblingEdge = createSiblingEdge(
// 					searchResultNode,
// 					sourceNode,
// 					"floating",
// 				);
// 				searchResultNodes.push(searchResultNode);
// 				searchResultEdges.push(siblingEdge);
// 			});

// 			const searchResultHandles: any = searchResultEdges.map(
// 				(edge: any) => edge.sourceHandle,
// 			);

// 			updateNodeData(sourceNode.id, {
// 				handles: sourceNode.data.handles
// 					? [...sourceNode.data.handles, ...searchResultHandles]
// 					: searchResultHandles,
// 			});

// 			addNodes(searchResultNodes);
// 			addEdges(searchResultEdges);

// 			return { searchResultNodes, searchResultEdges };
// 		},
// 		[addEdges, addNodes, createSiblingEdge, graph, updateNodeData],
// 	);

// 	const positionAdjacentNodesRadially = ({
// 		sourceNode,
// 		adjacentNodes,
// 	}: { sourceNode: any; adjacentNodes: any }) => {
// 		const searchResultNodes: any = [];
// 		const searchResultEdges: any = [];

// 		adjacentNodes.forEach((result: any, i: any) => {
// 			const { type } = result;
// 			const node = graph[type].nodes.find(
// 				(node: { id: any }) => node?.id === result.id,
// 			);

// 			const degrees = i * (360 / adjacentNodes.length);
// 			const radians = degrees * (Math.PI / 180);
// 			const x = 250 * Math.cos(radians) + sourceNode.position.x;
// 			const y = 250 * Math.sin(radians) + sourceNode.position.y;

// 			const positionedNode = {
// 				...node,
// 				position: { x, y },
// 			};

// 			searchResultNodes.push(positionedNode);
// 			const siblingEdge = createSiblingEdge(
// 				sourceNode,
// 				positionedNode,
// 				"floating",
// 			);
// 			searchResultEdges.push(siblingEdge);
// 		});

// 		return { searchResultNodes, searchResultEdges };
// 	};

// 	// Node connection functions
// 	const addConnectionNodesFromSearch = useCallback(
// 		({ source, searchResults }: AddConnectionNodesFromSearchParams) => {
// 			const siblingSourceNode: any = getNode(source.id);
// 			if (!siblingSourceNode) return null;

// 			const incomingNodes: any = [];
// 			const incomingEdges: any = [];
// 			const existingNodes = getNodes().filter(
// 				(node: any) => node.id !== siblingSourceNode.id,
// 			);
// 			const nodeRadius = calculateCircumcircleRadius(
// 				ROOT_NODE_WIDTH,
// 				ROOT_NODE_HEIGHT,
// 			);
// 			const circleRadius = searchResults.reduce((sum: number) => {
// 				return (
// 					sum + calculateCircumcircleRadius(ROOT_NODE_WIDTH, ROOT_NODE_HEIGHT)
// 				);
// 			}, 0);

// 			searchResults.forEach((result: { id?: any; type?: any }, i: number) => {
// 				const { type, id, ...rest } = result;

// 				// Calculate placement
// 				const totalNodes = searchResults.length;
// 				const angleIncrement = (2 * Math.PI) / totalNodes;
// 				let angle = i * angleIncrement;
// 				let x: number = siblingSourceNode.position.x;
// 				let y: number = siblingSourceNode.position.y;
// 				let positionFound = false;
// 				let attempts = 0;
// 				const maxAttempts = 10;

// 				// Find a non-overlapping position
// 				while (!positionFound && attempts < maxAttempts) {
// 					x = circleRadius * Math.cos(angle) + siblingSourceNode.position.x;
// 					y = circleRadius * Math.sin(angle) + siblingSourceNode.position.y;

// 					const overlaps = existingNodes.some((existingNode) => {
// 						const dx = existingNode.position.x - x;
// 						const dy = existingNode.position.y - y;
// 						const distance = Math.sqrt(dx * dx + dy * dy);
// 						return distance < nodeRadius * 2;
// 					});

// 					if (!overlaps) {
// 						positionFound = true;
// 					} else {
// 						angle += angleIncrement / 2;
// 						attempts++;
// 					}
// 				}

// 				// Create the node and edge
// 				const positionedNode = {
// 					id,
// 					type: `${type}Node`,
// 					label: rest?.label || rest?.name,
// 					data: {
// 						...rest,
// 						type,
// 					},
// 					position: { x, y },
// 				};

// 				const edgeId = `${siblingSourceNode.id}:${positionedNode.id}`;
// 				const siblingEdge = {
// 					id: edgeId,
// 					source: siblingSourceNode.id,
// 					target: positionedNode.id,
// 					animated: true,
// 					type: "siblingEdge",
// 					markerEnd: "custom-marker",
// 					style: {
// 						stroke: DOMAIN_MODEL_COLORS[type],
// 					},
// 					sourceHandle: `handle:${edgeId}`,
// 				};

// 				incomingNodes.push(positionedNode);
// 				incomingEdges.push(siblingEdge);
// 			});

// 			// Update source node with new handle connections
// 			const incomingSiblingHandles: any = incomingEdges.map(
// 				(edge: any) => edge.sourceHandle,
// 			);
// 			updateNodeData(siblingSourceNode.id, {
// 				handles: siblingSourceNode.data?.handles?.length
// 					? [...siblingSourceNode.data.handles, ...incomingSiblingHandles]
// 					: incomingSiblingHandles,
// 			});

// 			// Update graph
// 			setNodes((nds: any) => [...nds, ...incomingNodes]);
// 			setEdges((edges: any) => [...edges, ...incomingEdges]);

// 			return {
// 				siblingNodes: incomingNodes,
// 				siblingEdges: incomingEdges,
// 			};
// 		},
// 		[getNode, getNodes, updateNodeData],
// 	);

// 	// Node interaction functions
// 	const addUserInputNode = useCallback(
// 		({ input, user, position }: any) => {
// 			const newNode = {
// 				id: `user-input-node-${Math.random().toString(36).substr(2, 9)}`,
// 				type: "userInputNode",
// 				position: position || { x: 0, y: 0 },
// 				data: { label: "New User Input Node", input, user },
// 			};
// 			addNodes(newNode);
// 			return newNode;
// 		},
// 		[addNodes],
// 	);

// 	// Group node creation
// 	const createGroupNodeLayoutWithoutRootNode = useCallback(
// 		({ groupId, childNodes }: any) => {
// 			const model = groupId.split("-")[0];
// 			const isPersonnel = model === "personnel";
// 			const isEvents = model === "events";

// 			// Configure node based on type
// 			const personnelGroupNodeConfig = {
// 				id: groupId,
// 				type: "personnelGroupNode",
// 				initialHeight: 150,
// 				initialWidth: 450,
// 				style: {
// 					width: "450px",
// 					height: "150px",
// 					background: "none",
// 					border: "none",
// 				},
// 				data: {
// 					label: groupId,
// 					name: groupId,
// 				},
// 			};

// 			const constrainedConfig = {
// 				id: groupId,
// 				type: "entityGroupNode",
// 				data: {
// 					label: groupId,
// 					name: groupId,
// 					type: "base-config-group",
// 				},
// 				initialHeight: GROUP_NODE_DIMENSIONS.height,
// 				initialWidth: GROUP_NODE_DIMENSIONS.width,
// 				style: {
// 					width: `${GROUP_NODE_DIMENSIONS.width}px`,
// 					height: `${GROUP_NODE_DIMENSIONS.height}px`,
// 				},
// 			};

// 			const config = isPersonnel ? personnelGroupNodeConfig : constrainedConfig;
// 			const allNodes = getNodes();
// 			const bounds = allNodes?.length ? getNodesBounds(allNodes) : null;

// 			// Decide position based on existing nodes
// 			const groupNodePosition = bounds
// 				? {
// 						x: bounds.x + bounds.width + PADDING,
// 						y: bounds.y,
// 					}
// 				: { x: 0, y: 0 };

// 			const groupNode: any = {
// 				...config,
// 				position: groupNodePosition,
// 			};

// 			// Configure child node layout
// 			const parentHeight = config.initialHeight;
// 			const parentWidth = config.initialWidth;
// 			const amount = model === "events" ? 4 : childNodeBatchSize;
// 			const divisor = model === "events" ? 3 : 0;
// 			const baseChildWidth = Math.floor(parentWidth / childNodeBatchSize);
// 			const childContainerStart =
// 				parentWidth - Math.floor(parentWidth / divisor);
// 			const childNodeHeight = isPersonnel ? 100 : baseChildWidth;
// 			const childNodeWidth = isPersonnel ? 150 : baseChildWidth;
// 			const centerX = (parentWidth - childNodeWidth) / 2;
// 			const horizontalSpacing = 0;

// 			let startX = childContainerStart;
// 			let xPosition = childContainerStart;
// 			let yPosition = 0;

// 			const suffix = capitalize(model);

// 			// Position children within the group
// 			const groupNodeChildren = childNodes.map(
// 				(childNode: any, index: number) => {
// 					startX += (childNodeWidth + horizontalSpacing) * index;

// 					if (isEvents) {
// 						// Grid layout for events
// 						if (index === 0) {
// 							xPosition = childNodeWidth;
// 							yPosition = 0;
// 						} else if (index === 1) {
// 							xPosition = childNodeWidth * 2;
// 							yPosition = 0;
// 						} else if (index === 2) {
// 							xPosition = childNodeWidth;
// 							yPosition = childNodeHeight;
// 						} else if (index === 3) {
// 							xPosition = childNodeWidth * 2;
// 							yPosition = childNodeHeight;
// 						}

// 						return {
// 							...childNode,
// 							type: `entityGroupNodeChild${suffix}`,
// 							position: screenToFlowPosition({
// 								x: xPosition,
// 								y: yPosition,
// 							}),
// 							hidden: false,
// 							parentId: groupId,
// 							extent: "parent",
// 							className: groupId,
// 							style: {
// 								width: `${childNodeWidth}px`,
// 								height: `${childNodeHeight}px`,
// 							},
// 						};
// 					} else {
// 						// Linear layout for other types
// 						yPosition = 20;
// 						xPosition = startX + childNodeWidth * index;

// 						return {
// 							...childNode,
// 							type: `entityGroupNodeChild${suffix}`,
// 							position: screenToFlowPosition({
// 								x: xPosition,
// 								y: yPosition,
// 							}),
// 							hidden: false,
// 							parentId: groupId,
// 							extent: "parent",
// 							className: groupId,
// 							style: {
// 								width: `${childNodeWidth}px`,
// 								height: `${childNodeHeight}px`,
// 							},
// 						};
// 					}
// 				},
// 			);

// 			groupNode.data.children = [...groupNodeChildren];
// 			return { groupNode, groupNodeChildren };
// 		},
// 		[getNodes, getNodesBounds, screenToFlowPosition],
// 	);

// 	// User input result rendering
// 	const renderUserInputResultsLayout = useCallback(
// 		({ groupId, sourceNode, results }: any) => {
// 			const model = capitalize(groupId.split("-")[0]);
// 			const childNodeType = `groupResultsNodeChild${model}`;

// 			// Initial configuration
// 			const initialConfig = {
// 				id: groupId,
// 				type: "groupResultsNode",
// 				initialHeight: GROUP_NODE_LANDSCAPE.height,
// 				initialWidth: GROUP_NODE_LANDSCAPE.width,
// 				label: groupId,
// 				style: {
// 					width: `${GROUP_NODE_LANDSCAPE.width}px`,
// 					height: `${GROUP_NODE_LANDSCAPE.height}px`,
// 				},
// 				data: {
// 					sourceNode,
// 					label: sourceNode.data.type,
// 					name: groupId,
// 					type: "groupResultsNode",
// 					childrenClassName: childNodeType,
// 				},
// 			};

// 			// Calculate position
// 			const allNodes = getNodes();
// 			const bounds = getNodesBounds(allNodes);
// 			const [{ position }]: any = assignPositionsToChildNodes(sourceNode, [
// 				initialConfig,
// 			]);

// 			const groupNode: any = {
// 				...initialConfig,
// 				position,
// 			};

// 			// Configure child layout
// 			const childNodeWidth = BASE_ENTITY_NODE_WIDTH;
// 			const childNodeHeight = BASE_ENTITY_NODE_HEIGHT;
// 			const parentHeight = GROUP_NODE_LANDSCAPE.height;
// 			const parentWidth = GROUP_NODE_LANDSCAPE.width;
// 			const centerY = (parentHeight - childNodeHeight) / 2;
// 			const horizontalSpacing = 20;
// 			const totalWidth =
// 				childNodeWidth * results.length +
// 				horizontalSpacing * (results.length - 1);
// 			const startX = (parentWidth - totalWidth) / 2;

// 			// Position child nodes
// 			const groupNodeChildren = results.map((childNode: any, index: any) => ({
// 				...childNode,
// 				type: childNodeType,
// 				position: {
// 					x: startX + index * (childNodeWidth + horizontalSpacing),
// 					y: centerY,
// 				},
// 				hidden: false,
// 				parentId: groupId,
// 				className: childNodeType,
// 				extent: "parent",
// 			}));

// 			groupNode.data.children = [...groupNodeChildren];
// 			return { groupNode, groupNodeChildren };
// 		},
// 		[assignPositionsToChildNodes, getNodes, getNodesBounds],
// 	);

// 	// Entity retrieval
// 	const retrieveEntitiesFromStore = useCallback(
// 		(model: keyof DatabaseSchema) => {
// 			const sourceModelIndex: any = `${model}-root-node`;
// 			const sourceModelNodesState = rootNodeState[sourceModelIndex];
// 			const { lastIndex } = sourceModelNodesState;

// 			// Get the next batch of nodes
// 			const entityNodes = graph[model].nodes.slice(
// 				lastIndex,
// 				lastIndex + childNodeBatchSize,
// 			);
// 			updateChildNodeBatchIndex(sourceModelIndex);
// 			return entityNodes;
// 		},
// 		[rootNodeState, graph],
// 	);

// 	// Child node batch index management
// 	const updateChildNodeBatchIndex = useCallback(
// 		(type: RootNodeKey, amount?: number) => {
// 			setRootNodeState((state: any) => ({
// 				...state,
// 				[type]: {
// 					lastIndex: state[type].lastIndex + (amount || childNodeBatchSize),
// 				},
// 			}));
// 		},
// 		[],
// 	);

// 	// Node detection functions
// 	const detectNodeOverlap = useCallback(
// 		(node: { id: string }): Node[] => {
// 			const source = getNode(node.id);
// 			if (!source) return [];

// 			return getIntersectingNodes(source);
// 		},
// 		[getNode, getIntersectingNodes],
// 	);

// 	// Layout management
// 	const organizeLayout = useCallback(() => {
// 		const nodeWidth = 200;
// 		const nodeHeight = 100;
// 		const horizontalSpacing = 20;
// 		const verticalSpacing = 20;
// 		const localNodes = getNodes();
// 		const localEdges = getEdges();

// 		// Find root nodes (nodes with no incoming edges)
// 		const rootNodes = localNodes.filter(
// 			(node) => !localEdges.some((edge: any) => edge.target === node.id),
// 		);

// 		// Build a map of parent -> children relationships
// 		const childrenMap = new Map<string, string[]>();
// 		localEdges.forEach((edge: any) => {
// 			if (!childrenMap.has(edge.source)) {
// 				childrenMap.set(edge.source, []);
// 			}
// 			childrenMap.get(edge.source)!.push(edge.target);
// 		});

// 		// Recursive function to position nodes
// 		const positionNode = (
// 			nodeId: string,
// 			x: number,
// 			y: number,
// 			level: number,
// 		): void => {
// 			const node = localNodes.find((n) => n.id === nodeId);
// 			if (node) {
// 				node.position = { x, y };
// 				const children = childrenMap.get(nodeId) || [];
// 				const childrenWidth =
// 					children.length * (nodeWidth + horizontalSpacing) - horizontalSpacing;
// 				let startX = x - childrenWidth / 2 + nodeWidth / 2;

// 				// Position each child
// 				children.forEach((childId) => {
// 					positionNode(childId, startX, y + verticalSpacing, level + 1);
// 					startX += nodeWidth + horizontalSpacing;
// 				});
// 			}
// 		};

// 		// Start positioning from root nodes
// 		const totalWidth =
// 			rootNodes.length * (nodeWidth + horizontalSpacing) - horizontalSpacing;
// 		let startX = -totalWidth / 2;

// 		rootNodes.forEach((rootNode) => {
// 			positionNode(rootNode.id, startX, 0, 0);
// 			startX += nodeWidth + horizontalSpacing;
// 		});

// 		// Update the node positions
// 		setNodes([...localNodes]);
// 	}, [getNodes, getEdges, setNodes]);

// 	// Entity loading functions
// 	const addNextEntitiesToMindMap = useCallback(
// 		(source: any) => {
// 			const {
// 				type: nodeType,
// 				data: { type: model },
// 			} = source;
// 			const isUserInputNode = nodeType === "userInputNode";
// 			const amount = model === "events" ? 4 : childNodeBatchSize;
// 			const sourceModelIndex: any = `${model}-root-node`;
// 			const sourceModelNodesState = rootNodeState[sourceModelIndex];
// 			const { lastIndex } = sourceModelNodesState;

// 			// Get the next batch of nodes
// 			const resultNodes = graph[model].nodes.slice(
// 				lastIndex,
// 				lastIndex + amount,
// 			);
// 			const groupId = `${model}-group-${lastIndex}`;

// 			// Create the group layout
// 			const { groupNode, groupNodeChildren }: any = isUserInputNode
// 				? renderUserInputResultsLayout({
// 						groupId,
// 						sourceNode: source,
// 						results: resultNodes,
// 					})
// 				: createGroupNodeLayoutWithoutRootNode({
// 						groupId,
// 						childNodes: resultNodes,
// 					});

// 			// Create the edge connecting to the group
// 			const edgeId = `${source.id}:${groupId}`;
// 			const edge = {
// 				type: "siblingEdge",
// 				id: edgeId,
// 				source: source.id,
// 				target: groupNode.id,
// 				sourceHandle: `handle:${edgeId}`,
// 			};

// 			// Update the source node with the new connection
// 			const incomingHandles = [edge.sourceHandle];
// 			updateNodeData(source.id, {
// 				handles: source.data?.handles?.length
// 					? [...source.data.handles, ...incomingHandles]
// 					: incomingHandles,
// 				children: source?.data?.children
// 					? [...source?.data?.children, groupNode]
// 					: [groupNode],
// 			});

// 			// Add the new nodes and edges to the graph
// 			addNodes([groupNode, ...groupNodeChildren]);
// 			setEdges((edges: any) => [...edges, edge]);
// 			updateChildNodeBatchIndex(sourceModelIndex, amount);

// 			// Center the view on the new group
// 			zoomTo(2, { duration: 500 });
// 			setCenter(groupNode.position.x, groupNode.position.y, { duration: 500 });

// 			return { groupNode, groupNodeChildren };
// 		},
// 		[
// 			rootNodeState,
// 			graph,
// 			zoomTo,
// 			setCenter,
// 			updateNodeData,
// 			updateChildNodeBatchIndex,
// 			renderUserInputResultsLayout,
// 			createGroupNodeLayoutWithoutRootNode,
// 			addNodes,
// 		],
// 	);

// 	// Root node children retrieval
// 	const getRootNodeChildren = useCallback(
// 		async (type: any) => {
// 			const source: any = `${type}-root-node`;
// 			const nodeState = rootNodeState[source];
// 			const { lastIndex } = nodeState;

// 			// Get the next batch of child nodes
// 			const childNodes = graph[type].nodes.slice(
// 				lastIndex,
// 				lastIndex + childNodeBatchSize,
// 			);
// 			const rootNode: any = getNode(source);
// 			const groupId = `${type}-group-${lastIndex}`;

// 			// Create the group layout
// 			const { groupNode, groupNodeChildren }: any =
// 				createGroupNodeLayoutWithoutRootNode({
// 					groupId,
// 					childNodes,
// 				});

// 			// Create the edges connecting to the group
// 			const incomingEdges = createRootNodeEdges([groupNode], source);
// 			const incomingHandles: any = incomingEdges.map(
// 				(edge) => edge.sourceHandle,
// 			);

// 			// Update the root node with the new connections
// 			rootNode.data = {
// 				...rootNode.data,
// 				handles: rootNode.data?.handles?.length
// 					? [...rootNode.data.handles, ...incomingHandles]
// 					: incomingHandles,
// 				children: rootNode?.data?.children
// 					? [...rootNode?.data?.children, groupNode]
// 					: [groupNode],
// 			};

// 			updateNodeData(rootNode.id, { ...rootNode.data });

// 			// Update the graph
// 			const initialRootNodes = getNodes()
// 				.filter((node: any) => node.id !== source)
// 				.concat([rootNode]);
// 			setNodes((nds: any) => [
// 				...initialRootNodes,
// 				groupNode,
// 				...groupNodeChildren,
// 			]);
// 			setEdges((edges: any) => [...edges, ...incomingEdges]);
// 			updateChildNodeBatchIndex(source);

// 			return {
// 				groupNode,
// 				groupNodeChildren,
// 				incomingEdges,
// 			};
// 		},
// 		[
// 			rootNodeState,
// 			graph,
// 			getNode,
// 			createGroupNodeLayoutWithoutRootNode,
// 			createRootNodeEdges,
// 			updateNodeData,
// 			getNodes,
// 			updateChildNodeBatchIndex,
// 		],
// 	);

// 	// Group and node management
// 	const addMindMapGroupNode = useCallback(
// 		({
// 			connectionNode,
// 			model,
// 			nodeType = "entityGroupNode",
// 			groupId,
// 			position,
// 		}: {
// 			model: string;
// 			childNodes?: any[];
// 			nodeType: string;
// 			position: XYPosition;
// 			groupId: string;
// 			connectionNode: Node;
// 		}) => {
// 			const edgeId = `${groupId}`;
// 			const newNode: any = {
// 				...entityGroupNodeBaseConfig,
// 				id: groupId,
// 				type: nodeType,
// 				data: { model },
// 				position,
// 			};

// 			const newEdge = {
// 				id: edgeId,
// 				source: connectionNode.id,
// 				target: newNode.id,
// 				type: "smoothstep",
// 			};

// 			addNodes(newNode);
// 			addEdges(newEdge);
// 		},
// 		[addNodes, addEdges],
// 	);

// 	const addMindmapChildNode = useCallback(
// 		({
// 			parentNode,
// 			type,
// 			childNode,
// 			position,
// 		}: {
// 			parentNode: Node;
// 			type: string;
// 			childNode: DatabaseSchema[keyof DatabaseSchema] & { type: string };
// 			position: XYPosition;
// 		}) => {
// 			const nodeType = `${type || childNode.type}Node`;
// 			const edgeId = `${parentNode.id}:${childNode.id}`;

// 			const newNode: any = {
// 				...childNode,
// 				type: nodeType,
// 				position,
// 				parentId: parentNode.id,
// 			};

// 			const newEdge: any = {
// 				id: edgeId,
// 				source: parentNode.id,
// 				target: newNode.id,
// 				type: "smoothstep",
// 			};

// 			return { newNode, newEdge };
// 		},
// 		[],
// 	);

// 	// Database query functions
// 	const loadNodesFromTableQuery = useCallback(
// 		async ({ type, searchResults, searchTerm }: any) => {
// 			const groupId = `${type}-group-${searchTerm}`;

// 			// Map search results to nodes
// 			const childNodes = searchResults.map((result: any) => {
// 				return graph[type].nodes.find(
// 					(node: { id: any }) => node?.id === result.id,
// 				);
// 			});

// 			// Create the group layout
// 			const { groupNode, groupNodeChildren }: any =
// 				createGroupNodeLayoutWithoutRootNode({
// 					groupId,
// 					childNodes,
// 				});

// 			// Add the nodes to the graph
// 			setNodes((nds: any) => [...nds, groupNode, ...groupNodeChildren]);

// 			return {
// 				childNodes: {
// 					groupNode,
// 					groupNodeChildren,
// 				},
// 			};
// 		},
// 		[createGroupNodeLayoutWithoutRootNode, graph],
// 	);

// 	// Connection finding
// 	const findConnections = useCallback(
// 		(node: any) => {
// 			const { id } = node;
// 			const { links } = mindMapIntialGraphState;
// 			const currentNodes = getNodes();

// 			// Find all links to/from this node
// 			const nodeLinks = links
// 				.filter((link: any) => link.target === id || link.source === id)
// 				.map((link: any) => {
// 					if (link.target === id) return link.source;
// 					if (link.source === id) return link.target;
// 					return null;
// 				})
// 				.filter(Boolean);

// 			// Find the nodes on the map that match the links
// 			const connections = currentNodes.filter((nodeOnMap: any) =>
// 				nodeLinks.includes(nodeOnMap.id),
// 			);

// 			// Create edges to these connections
// 			const handles = connections.map((connection: any) =>
// 				createRootNodeEdge(node, connection),
// 			);

// 			// Update the node with the new connections
// 			updateNodeData(node.id, { ...node.data, handles });
// 			addEdges(handles);

// 			return connections;
// 		},
// 		[
// 			addEdges,
// 			createRootNodeEdge,
// 			getNodes,
// 			mindMapIntialGraphState,
// 			updateNodeData,
// 		],
// 	);

// 	// Optimize batch node updates
// 	const updateNodes = useCallback((newNodes: Node[]) => {
// 		setNodes((currentNodes) => {
// 			const nodeMap = new Map(currentNodes.map((node) => [node.id, node]));
// 			newNodes.forEach((newNode) => nodeMap.set(newNode.id, newNode));
// 			return Array.from(nodeMap.values());
// 		});
// 	}, []);

// 	// Viewport adjustment
// 	const adjustViewport = useCallback(
// 		({ x, y, zoom = 0, duration = 800 }: FlowPosition) => {
// 			setViewport({ x, y, zoom }, { duration });
// 		},
// 		[setViewport],
// 	);

// 	// Node deletion handling
// 	const onNodesDelete = useCallback(
// 		(deleted) => {
// 			setEdges(
// 				deleted.reduce((acc, node) => {
// 					const incomers = getIncomers(node, nodes, edges);
// 					const outgoers = getOutgoers(node, nodes, edges);
// 					const connectedEdges = getConnectedEdges([node], edges);

// 					const remainingEdges = acc.filter(
// 						(edge) => !connectedEdges.includes(edge),
// 					);
// 					const createdEdges = incomers.flatMap(({ id: source }) =>
// 						outgoers.map(({ id: target }) => ({
// 							id: `${source}->${target}`,
// 							source,
// 							target,
// 						})),
// 					);

// 					return [...remainingEdges, ...createdEdges];
// 				}, edges),
// 			);
// 		},
// 		[nodes, edges],
// 	);

// 	// React Flow standard change handlers
// 	const onNodesChange: OnNodesChange = useCallback((chs) => {
// 		setNodes((nds: Node[]) => applyNodeChanges(chs, nds));
// 	}, []);

// 	const onEdgesChange: OnEdgesChange = useCallback((chs) => {
// 		setEdges((eds: Edge[]) => applyEdgeChanges(chs, eds));
// 	}, []);

// 	const onConnect: OnConnect = useCallback((params) => {
// 		setEdges((eds: any) => addEdge(params, eds));
// 	}, []);

// 	// Initialize graph from 3D graph data
// 	useEffect(() => {
// 		const formattedGraphNodesObject: any = {};

// 		for (const key in graph3d) {
// 			const graphModel = graph3d[key];
// 			const tempNodes = graphModel.nodes.map(createRootNodeChild);
// 			const tempLinks = [].concat(
// 				...Object.keys(graphModel.links).map((key) => {
// 					const links = graphModel.links[key].connectedTo;
// 					return [...links];
// 				}),
// 			);

// 			formattedGraphNodesObject[key] = {
// 				nodes: tempNodes,
// 				edges: tempLinks,
// 			};
// 		}

// 		setGraph(formattedGraphNodesObject);
// 		const initialRootNodes = graph3d.root.nodes.map(createRootNode);
// 		setNodes([]);
// 		setEdges([]);
// 	}, [createRootNode, createRootNodeChild, graph3d]);

// 	return (
// 		<MindMapContext.Provider
// 			value={{
// 				// Core state
// 				nodes,
// 				setNodes,
// 				edges,
// 				setEdges,
// 				graph,
// 				store,

// 				// Node functions
// 				addNodes,
// 				assignPositionsToChildNodes,
// 				addEdges,
// 				updateNodes,
// 				createRootNodeEdges,
// 				getRootNodeChildren,
// 				addConnectionNodesFromSearch,

// 				// ReactFlow core functions
// 				onNodesChange,
// 				onEdgesChange,
// 				onConnect,
// 				getNodes,
// 				useUpdateNodeInternals,
// 				fitView,
// 				getEdges,
// 				useInternalNode,
// 				useNodes,
// 				screenToFlowPosition,
// 				useNodesData,
// 				getOutgoers,
// 				updateNode,
// 				getNode,
// 				adjustViewport,
// 				zoomIn,
// 				zoomOut,

// 				// UI State
// 				activeNode,
// 				updateActiveNode,
// 				conciseViewActive,
// 				toggleConciseView,
// 				turnOffConciseView,
// 				turnOnConciseView,

// 				// Visualization features
// 				locationsToVisualize,
// 				addLocationsToVisualize,
// 				showLocationVisualization,
// 				toggleLocationVisualization,
// 				closeLocationVisualization,

// 				// Node management
// 				addUserInputNode,
// 				findConnections,
// 				addNextEntitiesToMindMap,
// 				detectNodeOverlap,

// 				// Mind map persistence
// 				updateMindMapInstance,
// 				mindMapInstance,
// 				saveMindMap,
// 				restore,

// 				// Layout functions
// 				organizeLayout,
// 				onNodesDelete,
// 				createSearchResultsLayout,

// 				// Entity management
// 				retrieveEntitiesFromStore,
// 				addMindmapChildNode,
// 				addMindMapGroupNode,

// 				// ReactFlow functions
// 				getNodesBounds,
// 				updateNodeData,
// 				getIntersectingNodes,
// 				isNodeIntersecting,
// 				deleteElements,
// 				reactFlowInstance,

// 				// Database loading
// 				loadNodesFromTableQuery,
// 				keepLoadedOnMap,
// 				toggleKeepLoaded,
// 			}}
// 		>
// 			<div id="mindmap-container">{children}</div>
// 		</MindMapContext.Provider>
// 	);
// };

// export const useMindMap = () => {
// 	const context = useContext(MindMapContext);

// 	if (!context) {
// 		throw new Error("useMindMap must be used within a MindMapProvider");
// 	}

// 	return context;
// };

// export type { AddConnectionNodesFromSearchParams };
