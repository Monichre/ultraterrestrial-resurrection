import {
	kD3DAGAlgorithms,
	type D3DAGLayoutAlgorithms,
} from "@/features/mindmap/layouts/algorithms/d3-dag";
import { layoutD3Hierarchy } from "@/features/mindmap/layouts/algorithms/d3-hierarchy";
import { layoutDagreTree } from "@/features/mindmap/layouts/algorithms/dagre-tree";
import {
	kElkAlgorithms,
	type ELKLayoutAlgorithms,
} from "@/features/mindmap/layouts/algorithms/elk";
import { layoutOrigin } from "@/features/mindmap/layouts/algorithms/origin";
import { type Node, type Edge } from "@xyflow/react";

import { removeEmpty } from "@/utils";
import type { Reactflow } from "@/features/mindmap/layouts/types";

export type LayoutDirection = "vertical" | "horizontal";
export type LayoutVisibility = "visible" | "hidden";
export interface LayoutSpacing {
	x: number;
	y: number;
}

export type ReactflowLayoutConfig = {
	algorithm: LayoutAlgorithms;
	direction: LayoutDirection;
	spacing: LayoutSpacing;
	/**
	 * Whether to hide the layout
	 *
	 * We may need to hide layout if node sizes are not available during the first layout.
	 */
	visibility: LayoutVisibility;
	/**
	 * Whether to reverse the order of source handles.
	 */
	reverseSourceHandles: boolean;
};

export type LayoutAlgorithmProps = any &
	Omit<ReactflowLayoutConfig, "algorithm">;

// export type LayoutAlgorithm = (
//   props: LayoutAlgorithmProps
// ) => Promise<any | undefined>

export type Direction = "TB" | "LR" | "RL" | "BT";

export type LayoutAlgorithmOptions = {
	direction: Direction;
	spacing: [number, number];
};

export type LayoutAlgorithm = (
	props: LayoutAlgorithmProps,
) => Promise<Reactflow | undefined>;

export const layoutAlgorithms: Record<string, LayoutAlgorithm> = {
	origin: layoutOrigin,
	"dagre-tree": layoutDagreTree,
	"d3-hierarchy": layoutD3Hierarchy,
	...kElkAlgorithms,
	...kD3DAGAlgorithms,
};

export const defaultLayoutConfig: ReactflowLayoutConfig = {
	algorithm: "elk-mr-tree",
	direction: "vertical",
	visibility: "visible",
	spacing: { x: 120, y: 120 },
	reverseSourceHandles: false,
};

export type LayoutAlgorithms =
	| "origin"
	| "dagre-tree"
	| "d3-hierarchy"
	| ELKLayoutAlgorithms
	| D3DAGLayoutAlgorithms;

export * from "../collide";
export * from "./force-directed";
