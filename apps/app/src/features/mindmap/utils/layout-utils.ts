import type { Node, XYPosition } from "@xyflow/react";
import {
	BASE_ENTITY_NODE_HEIGHT,
	BASE_ENTITY_NODE_WIDTH,
	CHILD_DIMENSIONS,
	GROUP_NODE_DIMENSIONS,
	PADDING,
	ROOT_NODE_HEIGHT,
	ROOT_NODE_WIDTH,
} from "../config/index.config";

/**
 * Calculates the diagonal length of a rectangle
 */
export function calculateDiagonal(width: number, height: number): number {
	return Math.sqrt(width ** 2 + height ** 2);
}

/**
 * Calculates the radius of the circumscribed circle around a rectangle
 */
export function calculateCircumcircleRadius(
	width: number,
	height: number,
): number {
	const diagonal = calculateDiagonal(width, height);
	return diagonal / 2;
}

/**
 * Assigns positions to child nodes relative to a parent node
 */
export function assignPositionsToChildNodes(
	parentNode: Node,
	childNodes: Node[],
): Node[] {
	const bounds = parentNode.position;

	let currentX = bounds.x + ROOT_DIMENSIONS.width + PADDING;
	let currentY = bounds.y + ROOT_DIMENSIONS.height + PADDING;

	return childNodes.map((childNode) => {
		currentX += CHILD_DIMENSIONS.width + PADDING;

		if (currentX + CHILD_DIMENSIONS.width > bounds.x + 500) {
			// Adjust this value if needed for different layouts
			currentX = bounds.x;
			currentY += CHILD_DIMENSIONS.height + PADDING;
		}

		return {
			...childNode,
			position: { x: currentX, y: currentY },
		};
	});
}

/**
 * Positions nodes radially around a central node
 */
export function positionNodesRadially({
	sourceNode,
	nodes,
	radius = 250,
}: {
	sourceNode: Node;
	nodes: Node[];
	radius?: number;
}): Node[] {
	return nodes.map((node, i) => {
		const degrees = i * (360 / nodes.length);
		const radians = degrees * (Math.PI / 180);
		const x = radius * Math.cos(radians) + sourceNode.position.x;
		const y = radius * Math.sin(radians) + sourceNode.position.y;

		return {
			...node,
			position: { x, y },
		};
	});
}

/**
 * Creates a hierarchical tree layout for nodes
 */
export function organizeHierarchicalLayout(
	nodes: Node[],
	edges: any[],
	options = {
		nodeWidth: 200,
		nodeHeight: 100,
		horizontalSpacing: 20,
		verticalSpacing: 20,
	},
): Node[] {
	const { nodeWidth, nodeHeight, horizontalSpacing, verticalSpacing } = options;

	// Find root nodes (nodes with no incoming edges)
	const rootNodes = nodes.filter(
		(node) => !edges.some((edge) => edge.target === node.id),
	);

	// Create a map of children for each node
	const childrenMap = new Map<string, string[]>();
	edges.forEach((edge) => {
		if (!childrenMap.has(edge.source)) {
			childrenMap.set(edge.source, []);
		}
		childrenMap.get(edge.source)?.push(edge.target);
	});

	// Position nodes recursively
	const positionedNodes = [...nodes];

	const positionNode = (
		nodeId: string,
		x: number,
		y: number,
		level: number,
	): void => {
		const node = positionedNodes.find((n) => n.id === nodeId);
		if (node) {
			node.position = { x, y };
			const children = childrenMap.get(nodeId) || [];
			const childrenWidth =
				children.length * (nodeWidth + horizontalSpacing) - horizontalSpacing;
			let startX = x - childrenWidth / 2 + nodeWidth / 2;

			children.forEach((childId) => {
				positionNode(childId, startX, y + verticalSpacing, level + 1);
				startX += nodeWidth + horizontalSpacing;
			});
		}
	};

	// Position the root nodes first
	const totalWidth =
		rootNodes.length * (nodeWidth + horizontalSpacing) - horizontalSpacing;
	let startX = -totalWidth / 2;

	rootNodes.forEach((rootNode) => {
		positionNode(rootNode.id, startX, 0, 0);
		startX += nodeWidth + horizontalSpacing;
	});

	return positionedNodes;
}

/**
 * Creates a group layout for child nodes within a parent container
 */
export function createGroupLayout({
	groupId,
	childNodes,
	position,
	dimensions = GROUP_NODE_DIMENSIONS,
	childWidth = BASE_ENTITY_NODE_WIDTH,
	childHeight = BASE_ENTITY_NODE_HEIGHT,
}: {
	groupId: string;
	childNodes: Node[];
	position: XYPosition;
	dimensions?: { width: number; height: number };
	childWidth?: number;
	childHeight?: number;
}): {
	groupNode: Node;
	groupNodeChildren: Node[];
} {
	// Create group node
	const groupNode = {
		id: groupId,
		type: "entityGroupNode",
		data: {
			label: groupId,
			name: groupId,
			type: "base-config-group",
		},
		initialHeight: dimensions.height,
		initialWidth: dimensions.width,
		position,
		style: {
			width: `${dimensions.width}px`,
			height: `${dimensions.height}px`,
		},
	};

	// Position children within the group
	const parentHeight = dimensions.height;
	const parentWidth = dimensions.width;
	const horizontalSpacing = 20;

	// Calculate total width needed for all children
	const totalWidth =
		childWidth * childNodes.length +
		horizontalSpacing * (childNodes.length - 1);
	const startX = (parentWidth - totalWidth) / 2;
	const centerY = (parentHeight - childHeight) / 2;

	const groupNodeChildren = childNodes.map((childNode, index) => ({
		...childNode,
		type: `entityGroupNodeChild`,
		position: {
			x: startX + index * (childWidth + horizontalSpacing),
			y: centerY,
		},
		hidden: false,
		parentId: groupId,
		extent: "parent",
		className: groupId,
		style: {
			width: `${childWidth}px`,
			height: `${childHeight}px`,
		},
	}));

	// Add children to group node's data
	groupNode.data.children = [...groupNodeChildren];

	return { groupNode, groupNodeChildren };
}

// Constants that should be exported from mindmap-context
const ROOT_DIMENSIONS = {
	width: ROOT_NODE_WIDTH,
	height: ROOT_NODE_HEIGHT,
};
