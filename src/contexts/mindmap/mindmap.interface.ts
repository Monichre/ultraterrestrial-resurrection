import type { AddConnectionNodesFromSearchParams } from "@/contexts/mindmap";
import type { DatabaseSchema } from "@/db/xata";
import type { MindMapNode } from "@/features/mindmap/queries/fetch-next-mindmap-records";
import type { MindMapState, useMindMapStore } from "@/features/mindmap/store";
import type { Edge, Node, XYPosition, useReactFlow } from "@xyflow/react";

// Define context interface with utility functions and UI state
export interface MindMapContextType extends MindMapState {
	// Store state
	nodes: Node[];
	edges: Edge[];

	reactFlowInstance: ReturnType<typeof useReactFlow>;

	// Store actions
	onNodesChange: ReturnType<
		(typeof useMindMapStore<MindMapState>)["onNodesChange"]
	>;
	onEdgesChange: ReturnType<
		(typeof useMindMapStore<MindMapState>)["onEdgesChange"]
	>;
	onConnect: ReturnType<(typeof useMindMapStore<MindMapState>)["onConnect"]>;
	onNodesDelete: ReturnType<
		(typeof useMindMapStore<MindMapState>)["onNodesDelete"]
	>;
	setNodes: ReturnType<(typeof useMindMapStore<MindMapState>)["setNodes"]>;
	setEdges: ReturnType<(typeof useMindMapStore<MindMapState>)["setEdges"]>;
	addNode: ReturnType<(typeof useMindMapStore<MindMapState>)["addNode"]>;
	updateNodeData: ReturnType<
		(typeof useMindMapStore<MindMapState>)["updateNodeData"]
	>;
	deleteNode: ReturnType<(typeof useMindMapStore<MindMapState>)["deleteNode"]>;
	addEdge: ReturnType<(typeof useMindMapStore<MindMapState>)["addEdge"]>;
	updateEdgeData: ReturnType<
		(typeof useMindMapStore<MindMapState>)["updateEdgeData"]
	>;

	// Context-specific state
	graph: Record<string, { nodes: Node[]; edges: Edge[] }>;
	activeNode: Node | null;
	conciseViewActive: boolean;
	showLocationVisualization: boolean;
	locationsToVisualize: any[];
	keepLoadedOnMap: boolean;
	mindMapInstance: any;

	// Context state setters
	setGraph: (graph: Record<string, { nodes: Node[]; edges: Edge[] }>) => void;
	updateActiveNode: (node: Node | null) => void;
	toggleConciseView: () => void;
	turnOffConciseView: () => void;
	turnOnConciseView: () => void;
	toggleLocationVisualization: () => void;
	closeLocationVisualization: () => void;
	addLocationsToVisualize: (locations: any[]) => void;
	toggleKeepLoaded: () => void;
	setMindMapInstance: (instance: any) => void;

	// Specialized utilities
	createRootNodeEdges: (nodes: Node[], source: string | Node) => Edge[];
	assignPositionsToChildNodes: (parentNode: Node, childNodes: Node[]) => Node[];
	getRootNodeChildren: (type: string) => Promise<{
		groupNode: Node;
		groupNodeChildren: Node[];
		incomingEdges: Edge[];
	}>;
	addConnectionNodesFromSearch: (
		params: AddConnectionNodesFromSearchParams,
	) => {
		siblingNodes: Node[];
		siblingEdges: Edge[];
	} | null;

	// Helper functions
	addNodes: (nodes: Node | Node[]) => void;
	addEdges: (edges: Edge | Edge[]) => void;

	// ReactFlow utilities
	fitView: () => void;
	screenToFlowPosition: (position: XYPosition) => XYPosition;
	getNode: (id: string) => Node | undefined;
	getNodes: () => Node[];
	getEdges: () => Edge[];
	adjustViewport: (params: FlowPosition) => void;
	zoomIn: () => void;
	zoomOut: () => void;

	// Node management
	addUserInputNode: (params: {
		input: string;
		user: any;
		position?: XYPosition;
	}) => Node;
	findConnections: (node: Node) => Node[];
	addNextEntitiesToMindMap: (source: Node) => Promise<{
		groupNode: Node;
		groupNodeChildren: Node[];
	} | null>;
	detectNodeOverlap: (node: { id: string }) => Node[];

	// Mind map persistence
	saveMindMap: () => Promise<void>;
	restore: () => void;

	// Layout functions

	createSearchResultsLayout: (params: {
		sourceNode: Node;
		searchResults: any[];
	}) => { searchResultNodes: Node[]; searchResultEdges: Edge[] };

	// Entity management
	retrieveEntitiesFromStore: (
		model: keyof DatabaseSchema,
	) => Promise<MindMapNode[]>;
	addMindmapChildNode: (params: {
		parentNode: Node;
		type: string;
		childNode: any;
		position: XYPosition;
	}) => { newNode: Node; newEdge: Edge };
	addMindMapGroupNode: (params: {
		connectionNode: Node;
		model: string;
		nodeType?: string;
		groupId: string;
		position: XYPosition;
	}) => void;

	// Database loading
	loadNodesFromTableQuery: (params: {
		type: string;
		searchResults: any[];
		searchTerm: string;
	}) => Promise<{
		childNodes: { groupNode: Node; groupNodeChildren: Node[] };
	}>;
}
