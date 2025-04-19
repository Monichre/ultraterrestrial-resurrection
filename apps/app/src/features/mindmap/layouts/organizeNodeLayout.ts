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
}

/**
 * Organizes nodes with parent-child relationships in a visually pleasing layout
 */
export function organizeNodeLayout(
  nodes: ReactFlowNode[],
  edges: ReactFlowEdge[],
  options: LayoutOptions = {}
): ReactFlowNode[] {
  // Default options
  const {
    direction = 'horizontal',
    parentChildSpacing = 100,
    siblingSpacing = 50,
    nodeWidth = 200, 
    nodeHeight = 100,
    centerChildren = true,
    compactLayout = true,
    groupPadding = 20
  } = options;
  
  // Create a map of parent to children
  const parentToChildren = new Map<string, ReactFlowNode[]>();
  
  // Group nodes by their parent
  nodes.forEach(node => {
    if (node.parentId) {
      if (!parentToChildren.has(node.parentId)) {
        parentToChildren.set(node.parentId, []);
      }
      parentToChildren.get(node.parentId)!.push(node);
    }
  });
  
  // Clone the nodes array to avoid mutating original
  const layoutedNodes = nodes.map(node => ({...node}));
  
  // For each parent, position its children
  parentToChildren.forEach((children, parentId) => {
    const parent = layoutedNodes.find(node => node.id === parentId);
    if (!parent) return;
    
    // Get node dimensions - either from the node or use defaults
    const getNodeWidth = (node: ReactFlowNode) => node.width || 
      (node.data?.style?.width ? parseInt(node.data.style.width.toString(), 10) : nodeWidth);
    
    const getNodeHeight = (node: ReactFlowNode) => node.height || 
      (node.data?.style?.height ? parseInt(node.data.style.height.toString(), 10) : nodeHeight);
    
    // Different layout strategies based on direction
    if (direction === 'horizontal') {
      // Calculate total width needed for all children
      const totalWidth = children.reduce((sum, child, index) => {
        const width = getNodeWidth(child);
        return sum + width + (index < children.length - 1 ? siblingSpacing : 0);
      }, 0);
      
      // Calculate starting position to center the children under the parent
      const startX = centerChildren ? -totalWidth / 2 + getNodeWidth(children[0]) / 2 : 0;
      
      // Position each child
      let currentX = startX;
      children.forEach((child) => {
        const childIndex = layoutedNodes.findIndex(n => n.id === child.id);
        if (childIndex !== -1) {
          const width = getNodeWidth(child);
          
          layoutedNodes[childIndex] = {
            ...layoutedNodes[childIndex],
            position: {
              x: currentX,
              y: parentChildSpacing
            }
          };
          
          currentX += width + siblingSpacing;
        }
      });
    } else if (direction === 'vertical') {
      // Calculate total height for vertical layout
      const totalHeight = children.reduce((sum, child, index) => {
        const height = getNodeHeight(child);
        return sum + height + (index < children.length - 1 ? siblingSpacing : 0);
      }, 0);
      
      // Center children vertically if requested
      const startY = centerChildren ? -totalHeight / 2 + getNodeHeight(children[0]) / 2 : 0;
      
      // Position each child
      let currentY = startY;
      children.forEach((child) => {
        const childIndex = layoutedNodes.findIndex(n => n.id === child.id);
        if (childIndex !== -1) {
          const height = getNodeHeight(child);
          
          layoutedNodes[childIndex] = {
            ...layoutedNodes[childIndex],
            position: {
              x: centerChildren ? 0 : nodeWidth + siblingSpacing,
              y: currentY
            }
          };
          
          currentY += height + siblingSpacing;
        }
      });
    } else if (direction === 'radial') {
      // Radial layout - position nodes in a circle around parent
      const radius = Math.max(
        parentChildSpacing, 
        Math.min(children.length * 40, 300) // Limit maximum radius
      );
      
      children.forEach((child, index) => {
        const angle = (index / children.length) * 2 * Math.PI;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        const childIndex = layoutedNodes.findIndex(n => n.id === child.id);
        if (childIndex !== -1) {
          layoutedNodes[childIndex] = {
            ...layoutedNodes[childIndex],
            position: { x, y }
          };
        }
      });
    } else if (direction === 'grid') {
      // Grid layout - arrange children in a grid pattern
      const cols = Math.ceil(Math.sqrt(children.length));
      const cellWidth = nodeWidth + siblingSpacing;
      const cellHeight = nodeHeight + siblingSpacing;
      
      // Calculate grid dimensions
      const gridWidth = cols * cellWidth;
      
      // Calculate starting position to center the grid
      const startX = centerChildren ? -gridWidth / 2 + nodeWidth / 2 : 0;
      const startY = parentChildSpacing;
      
      children.forEach((child, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        
        const childIndex = layoutedNodes.findIndex(n => n.id === child.id);
        if (childIndex !== -1) {
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