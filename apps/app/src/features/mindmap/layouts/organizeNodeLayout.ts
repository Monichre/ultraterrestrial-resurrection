import { Node, Edge } from '@xyflow/react';

// ReactFlowNode type to match the existing project types
export type ReactFlowNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, any>;
  parentId?: string;
  width?: number;
  height?: number;
  measured?: {
    width: number;
    height: number;
  };
};

export type ReactFlowEdge = {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  label?: string;
  style?: Record<string, any>;
};

export interface LayoutOptions {
  direction?: 'horizontal' | 'vertical' | 'radial' | 'grid';
  parentChildSpacing?: number;
  siblingSpacing?: number;
  nodeWidth?: number;
  nodeHeight?: number;
  centerChildren?: boolean;
  compactLayout?: boolean;
  groupPadding?: number;
  preserveExistingLayout?: boolean;
  focusOnNewNodes?: boolean;
}

// Enhanced dimension calculation
const getNodeDimensions = (node: ReactFlowNode): { width: number; height: number } => {
  // Priority order: measured > explicit dimensions > data style > defaults
  if (node.measured) {
    return { width: node.measured.width, height: node.measured.height };
  }
  
  if (node.width && node.height) {
    return { width: node.width, height: node.height };
  }
  
  // Check for style-based dimensions
  const style = node.data?.style;
  if (style) {
    const width = typeof style.width === 'string' ? 
      parseInt(style.width.replace('px', ''), 10) : 
      (typeof style.width === 'number' ? style.width : null);
    const height = typeof style.height === 'string' ? 
      parseInt(style.height.replace('px', ''), 10) : 
      (typeof style.height === 'number' ? style.height : null);
    
    if (width && height) {
      return { width, height };
    }
  }
  
  // Node type-based defaults
  const nodeTypeDefaults: Record<string, { width: number; height: number }> = {
    'rootNode': { width: 300, height: 120 },
    'entityNode': { width: 200, height: 100 },
    'entityGroupNode': { width: 450, height: 200 },
    'personnelGroupNode': { width: 450, height: 150 },
    'groupResultsNode': { width: 800, height: 300 },
    'userInputNode': { width: 250, height: 80 },
    'default': { width: 200, height: 100 }
  };
  
  return nodeTypeDefaults[node.type] || nodeTypeDefaults['default'];
};

// Enhanced node hierarchy analysis
const analyzeNodeHierarchy = (nodes: ReactFlowNode[], edges: ReactFlowEdge[]) => {
  const nodeMap = new Map(nodes.map(node => [node.id, node]));
  const parentToChildren = new Map<string, ReactFlowNode[]>();
  const childToParent = new Map<string, string>();
  const rootNodes: ReactFlowNode[] = [];
  
  // Build parent-child relationships from edges and parentId
  nodes.forEach(node => {
    if (node.parentId) {
      if (!parentToChildren.has(node.parentId)) {
        parentToChildren.set(node.parentId, []);
      }
      parentToChildren.get(node.parentId)!.push(node);
      childToParent.set(node.id, node.parentId);
    } else {
      // Check if this node is a root based on edges
      const isChild = edges.some(edge => edge.target === node.id);
      if (!isChild) {
        rootNodes.push(node);
      }
    }
  });
  
  // Also analyze edge-based relationships
  edges.forEach(edge => {
    const sourceNode = nodeMap.get(edge.source);
    const targetNode = nodeMap.get(edge.target);
    
    if (sourceNode && targetNode && !targetNode.parentId) {
      // This creates an implicit parent-child relationship via edges
      if (!parentToChildren.has(edge.source)) {
        parentToChildren.set(edge.source, []);
      }
      const children = parentToChildren.get(edge.source)!;
      if (!children.find(child => child.id === targetNode.id)) {
        children.push(targetNode);
      }
    }
  });
  
  return { parentToChildren, childToParent, rootNodes, nodeMap };
};

/**
 * Enhanced organizeNodeLayout with better handling of new nodes and viewport management
 */
export function organizeNodeLayout(
  nodes: ReactFlowNode[],
  edges: ReactFlowEdge[],
  options: LayoutOptions = {}
): ReactFlowNode[] {
  if (!nodes.length) return [];
  
  const {
    direction = 'horizontal',
    parentChildSpacing = 120,
    siblingSpacing = 60,
    centerChildren = true,
    compactLayout = true,
    groupPadding = 20,
    preserveExistingLayout = false,
    focusOnNewNodes = false
  } = options;
  
  const { parentToChildren, rootNodes } = analyzeNodeHierarchy(nodes, edges);
  const layoutedNodes = nodes.map(node => ({ ...node }));
  
  // If preserving layout, only position new nodes (nodes without proper positions)
  const nodesToLayout = preserveExistingLayout ? 
    layoutedNodes.filter(node => !node.position || (node.position.x === 0 && node.position.y === 0)) :
    layoutedNodes;
  
  // Position root nodes first
  const rootSpacing = 400;
  let rootX = 0;
  
  rootNodes.forEach((rootNode, index) => {
    const nodeIndex = layoutedNodes.findIndex(n => n.id === rootNode.id);
    if (nodeIndex !== -1 && (!preserveExistingLayout || nodesToLayout.includes(rootNode))) {
      layoutedNodes[nodeIndex] = {
        ...layoutedNodes[nodeIndex],
        position: {
          x: rootX,
          y: 0
        }
      };
      rootX += rootSpacing;
    }
  });
  
  // Position children for each parent
  parentToChildren.forEach((children, parentId) => {
    const parent = layoutedNodes.find(node => node.id === parentId);
    if (!parent) return;
    
    const parentDims = getNodeDimensions(parent);
    
    // Sort children by their original index to maintain consistent ordering
    const sortedChildren = children.sort((a, b) => {
      const aIndex = nodes.findIndex(n => n.id === a.id);
      const bIndex = nodes.findIndex(n => n.id === b.id);
      return aIndex - bIndex;
    });
    
    if (direction === 'horizontal') {
      // Calculate total width needed for all children
      const childDimensions = sortedChildren.map(child => getNodeDimensions(child));
      const totalWidth = childDimensions.reduce((sum, dims, index) => {
        return sum + dims.width + (index < childDimensions.length - 1 ? siblingSpacing : 0);
      }, 0);
      
      // Calculate starting position to center children under parent
      const startX = centerChildren ? 
        parent.position.x + (parentDims.width / 2) - (totalWidth / 2) :
        parent.position.x;
      
      const childY = parent.position.y + parentDims.height + parentChildSpacing;
      
      // Position each child
      let currentX = startX;
      sortedChildren.forEach((child) => {
        const childIndex = layoutedNodes.findIndex(n => n.id === child.id);
        if (childIndex !== -1 && (!preserveExistingLayout || nodesToLayout.includes(child))) {
          const dims = getNodeDimensions(child);
          
          layoutedNodes[childIndex] = {
            ...layoutedNodes[childIndex],
            position: {
              x: currentX,
              y: childY
            }
          };
          
          currentX += dims.width + siblingSpacing;
        }
      });
      
    } else if (direction === 'vertical') {
      // Vertical layout
      const childDimensions = sortedChildren.map(child => getNodeDimensions(child));
      const totalHeight = childDimensions.reduce((sum, dims, index) => {
        return sum + dims.height + (index < childDimensions.length - 1 ? siblingSpacing : 0);
      }, 0);
      
      const startY = centerChildren ? 
        parent.position.y + (parentDims.height / 2) - (totalHeight / 2) :
        parent.position.y + parentDims.height + parentChildSpacing;
      
      const childX = parent.position.x + parentDims.width + parentChildSpacing;
      
      let currentY = startY;
      sortedChildren.forEach((child) => {
        const childIndex = layoutedNodes.findIndex(n => n.id === child.id);
        if (childIndex !== -1 && (!preserveExistingLayout || nodesToLayout.includes(child))) {
          const dims = getNodeDimensions(child);
          
          layoutedNodes[childIndex] = {
            ...layoutedNodes[childIndex],
            position: {
              x: childX,
              y: currentY
            }
          };
          
          currentY += dims.height + siblingSpacing;
        }
      });
      
    } else if (direction === 'radial') {
      // Radial layout around parent
      const radius = Math.max(
        parentChildSpacing, 
        Math.min(children.length * 50, 400)
      );
      
      sortedChildren.forEach((child, index) => {
        const childIndex = layoutedNodes.findIndex(n => n.id === child.id);
        if (childIndex !== -1 && (!preserveExistingLayout || nodesToLayout.includes(child))) {
          const angle = (index / sortedChildren.length) * 2 * Math.PI;
          const x = parent.position.x + (parentDims.width / 2) + Math.cos(angle) * radius;
          const y = parent.position.y + (parentDims.height / 2) + Math.sin(angle) * radius;
          
          layoutedNodes[childIndex] = {
            ...layoutedNodes[childIndex],
            position: { x, y }
          };
        }
      });
      
    } else if (direction === 'grid') {
      // Grid layout
      const cols = Math.ceil(Math.sqrt(sortedChildren.length));
      const rows = Math.ceil(sortedChildren.length / cols);
      
      // Calculate cell dimensions based on largest child
      const maxChildDims = sortedChildren.reduce((max, child) => {
        const dims = getNodeDimensions(child);
        return {
          width: Math.max(max.width, dims.width),
          height: Math.max(max.height, dims.height)
        };
      }, { width: 0, height: 0 });
      
      const cellWidth = maxChildDims.width + siblingSpacing;
      const cellHeight = maxChildDims.height + siblingSpacing;
      
      const gridWidth = cols * cellWidth;
      const gridHeight = rows * cellHeight;
      
      const startX = centerChildren ? 
        parent.position.x + (parentDims.width / 2) - (gridWidth / 2) :
        parent.position.x;
      const startY = parent.position.y + parentDims.height + parentChildSpacing;
      
      sortedChildren.forEach((child, index) => {
        const childIndex = layoutedNodes.findIndex(n => n.id === child.id);
        if (childIndex !== -1 && (!preserveExistingLayout || nodesToLayout.includes(child))) {
          const col = index % cols;
          const row = Math.floor(index / cols);
          
          layoutedNodes[childIndex] = {
            ...layoutedNodes[childIndex],
            position: {
              x: startX + col * cellWidth,
              y: startY + row * cellHeight
            }
          };
        }
      });
    }
  });
  
  return layoutedNodes;
}

/**
 * Creates a parent node with child nodes in a specified layout
 */
export function createGroupWithLayout(
  parentData: {
    id: string;
    position: { x: number; y: number };
    type?: string;
    data?: any;
    style?: React.CSSProperties;
  },
  childrenData: Array<{
    id: string;
    type?: string;
    data?: any;
  }>,
  layoutOptions: LayoutOptions = {}
): { parentNode: ReactFlowNode; childNodes: ReactFlowNode[] } {
  // Default dimensions for the parent node
  const defaultParentStyle = {
    width: '500px',
    height: '300px',
    padding: '10px',
    backgroundColor: 'rgba(240, 240, 240, 0.1)'
  };

  // Create the parent node
  const parentNode: ReactFlowNode = {
    id: parentData.id,
    type: parentData.type || 'group',
    position: parentData.position,
    data: {
      ...parentData.data,
      label: parentData.data?.label || 'Group'
    },
    width: parentData.style?.width ? 
      parseInt(parentData.style.width.toString(), 10) : 500,
    height: parentData.style?.height ? 
      parseInt(parentData.style.height.toString(), 10) : 300
  };

  // Create child nodes with initial positions (will be adjusted by layout)
  const childNodes: ReactFlowNode[] = childrenData.map(childData => ({
    id: childData.id,
    type: childData.type || 'default',
    position: { x: 0, y: 0 }, // Initial position doesn't matter, layout will adjust
    data: childData.data || { label: 'Child' },
    parentId: parentData.id, // Connect to parent
  }));

  // Apply layout to child nodes
  const layoutedChildren = organizeNodeLayout(
    childNodes,
    [], // No edges needed for layout
    layoutOptions
  );

  return {
    parentNode,
    childNodes: layoutedChildren
  };
} 