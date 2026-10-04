// UFO Knowledge Graph Data Types

export type NodeType = 'event' | 'location' | 'entity' | 'concept';

export interface KGNode {
  id: string;
  type: NodeType;
  name: string;
  description: string;
  properties: {
    date?: string;
    origin?: string;
    location?: string;
    witnesses?: number;
    duration?: string;
    classification?: string;
    evidence?: string[];
    significance?: number;
    tags?: string[];
  };
  connections: string[];
  visual?: {
    x?: number;
    y?: number;
    color?: string;
  };
}

export interface KGEdge {
  source: string;
  target: string;
  relationship: string;
  weight: number;
}

export interface TourState {
  currentNodeId: string | null;
  path: string[];
  visited: string[];
  context: {
    topic?: string;
    depth?: number;
    userInterest?: string[];
  };
  responses: {
    guideNarrative?: string;
    analystInsight?: string;
    visualData?: string;
  };
  tourMetadata?: {
    title: string;
    description: string;
    estimatedDuration: string;
    startNodeId: string;
  };
}

// Node type colors for visualization
export const NODE_COLORS: Record<NodeType, string> = {
  event: '#00D4FF',      // Plasma Cyan
  location: '#7B68EE',   // Nebula Purple
  entity: '#FF6B6B',     // Signal Red
  concept: '#4ECDC4',    // Cosmic Teal
};

// Node type shapes
export const NODE_SHAPES: Record<NodeType, string> = {
  event: 'circle',
  location: 'diamond',
  entity: 'hexagon',
  concept: 'rectangle',
};