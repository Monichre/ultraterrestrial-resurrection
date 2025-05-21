"use client";

import {
	type Connection,
	type Edge,
	type EdgeChange,
	type Node,
	type NodeChange,
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	getConnectedEdges,
} from "@xyflow/react";
import { create } from "zustand";

// Define our store state and actions
export interface MindMapState {
	// Core state
	nodes: Node[];
	edges: Edge[];
	addEdges: (edges: Edge | Edge[]) => void;
	addNodes: (nodes: Node | Node[]) => void;

	// Core ReactFlow actions
	onNodesChange: (changes: NodeChange[]) => void;
	onEdgesChange: (changes: EdgeChange[]) => void;
	onConnect: (connection: Connection) => void;
	onNodesDelete: (nodes: Node[]) => void;

	// Basic state setters
	setNodes: (nodes: Node[]) => void;
	setEdges: (edges: Edge[]) => void;

	// Node and edge management
	addNode: (node: Node) => void;
	updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
	deleteNode: (nodeId: string) => void;
	addEdge: (edge: Edge) => void;
	updateEdgeData: (edgeId: string, data: Record<string, unknown>) => void;
}

// Create and export the store
export const useMindMapStore = create<MindMapState>((set, get) => ({
	// Initial state
	nodes: [],
	edges: [],

	// Core ReactFlow actions
	onNodesChange: (changes) => {
		set({
			nodes: applyNodeChanges(changes, get().nodes),
		});
	},

	onEdgesChange: (changes) => {
		set({
			edges: applyEdgeChanges(changes, get().edges),
		});
	},

	onConnect: (connection) => {
		set({
			edges: addEdge(connection, get().edges),
		});
	},

	addNodes: (nodes: Node | Node[]) => {
		if (Array.isArray(nodes)) {
			// Check if nodes is iterable before spreading
			if (nodes && typeof nodes[Symbol.iterator] === "function") {
				set({ nodes: [...get().nodes, ...nodes] });
			} else {
				console.error("Attempted to spread non-iterable nodes:", nodes);
				// Fallback to current nodes to prevent errors
				set({ nodes: get().nodes });
			}
		} else {
			set({ nodes: [...get().nodes, nodes] });
		}
	},

	addEdges: (edges: Edge | Edge[]) => {
		if (Array.isArray(edges)) {
			set({ edges: [...get().edges, ...edges] });
		} else {
			set({ edges: [...get().edges, edges] });
		}
	},

	onNodesDelete: (deleted) => {
		const { nodes, edges } = get();

		// Find all edges connected to deleted nodes
		const edgesToRemove = new Set();
		for (const node of deleted) {
			const connectedEdges = getConnectedEdges([node], edges);
			for (const edge of connectedEdges) {
				edgesToRemove.add(edge.id);
			}
		}

		// Remove these edges
		const remainingEdges = edges.filter((edge) => !edgesToRemove.has(edge.id));

		set({ edges: remainingEdges });
	},

	// Basic state setters
	setNodes: (nodes) => set({ nodes }),
	setEdges: (edges) => set({ edges }),

	// Node and edge management
	addNode: (node: Node) => {
		set({ nodes: [...get().nodes, node] });
	},

	updateNodeData: (nodeId, data) => {
		set({
			nodes: get().nodes.map((node) =>
				node.id === nodeId
					? { ...node, data: { ...node.data, ...data } }
					: node,
			),
		});
	},

	deleteNode: (nodeId) => {
		set({ nodes: get().nodes.filter((node) => node.id !== nodeId) });
	},

	addEdge: (edge) => {
		set({ edges: [...get().edges, edge] });
	},

	updateEdgeData: (edgeId, data) => {
		set({
			edges: get().edges.map((edge) =>
				edge.id === edgeId ? { ...edge, ...data } : edge,
			),
		});
	},
}));
