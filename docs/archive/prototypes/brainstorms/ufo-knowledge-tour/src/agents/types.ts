// Multi-Agent System Types and State Management

import { KGNode, KGEdge, TourState } from '../types/graph';
import { ufoNodes, ufoEdges, getConnectedNodes, getNodeById } from '../data/ufoData';

// Agent Types
export type AgentType = 'guide' | 'navigator' | 'analyst' | 'visualizer' | 'coordinator';

// Agent Response
export interface AgentResponse {
  agent: AgentType;
  content: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

// System State (managed by LangGraph)
export interface SystemState {
  // Tour State
  currentNodeId: string | null;
  path: string[];
  visitedNodes: string[];

  // Context
  tourContext: {
    title: string;
    description: string;
    topic?: string;
    depth: number;
    userInterest?: string[];
  };

  // Agent Responses
  responses: {
    guideNarrative?: string;
    analystInsight?: string;
    navigatorPath?: string[];
    visualData?: string;
  };

  // Interaction State
  userQuery?: string;
  queryResponse?: string;

  // Messages for agent communication
  messages: Array<{
    agent: AgentType;
    content: string;
    timestamp: number;
  }>;

  // Tour control
  tourStatus: 'idle' | 'active' | 'paused' | 'completed';
  currentStep: number;
  totalSteps: number;
}

// Action Results
export interface ActionResult {
  success: boolean;
  data?: any;
  error?: string;
  nextAgent?: AgentType;
}

// Graph Data Access
export function getGraphData() {
  return {
    nodes: ufoNodes,
    edges: ufoEdges
  };
}

export function getNodeData(nodeId: string): KGNode | undefined {
  return getNodeById(nodeId);
}

export function getNodeConnections(nodeId: string): KGNode[] {
  return getConnectedNodes(nodeId);
}

// Navigation logic for the navigator agent
export function calculateNextNodes(currentNodeId: string, visited: string[]): string[] {
  const currentNode = getNodeById(currentNodeId);
  if (!currentNode) return [];

  // Get unvisited connections
  const unvisitedConnections = currentNode.connections.filter(id => !visited.includes(id));

  // Sort by significance and return top connections
  return unvisitedConnections
    .map(id => getNodeById(id))
    .filter((n): n is KGNode => n !== undefined)
    .sort((a, b) => (b.properties.significance || 0) - (a.properties.significance || 0))
    .slice(0, 3)
    .map(n => n.id);
}

// Initialize system state
export function createInitialState(config?: Partial<SystemState>): SystemState {
  return {
    currentNodeId: null,
    path: [],
    visitedNodes: [],
    tourContext: {
      title: 'Journey Through UFO History',
      description: 'Explore the most significant events, locations, and concepts that shaped our understanding of UFO phenomena.',
      depth: 0,
    },
    responses: {},
    tourStatus: 'idle',
    currentStep: 0,
    totalSteps: 0,
    messages: [],
    ...config
  };
}

// Update state with agent response
export function addAgentMessage(
  state: SystemState,
  agent: AgentType,
  content: string
): SystemState {
  return {
    ...state,
    messages: [
      ...state.messages,
      { agent, content, timestamp: Date.now() }
    ]
  };
}

// Get recent messages for context
export function getRecentMessages(state: SystemState, count: number = 5): string {
  const recent = state.messages.slice(-count);
  return recent.map(m => `[${m.agent}]: ${m.content}`).join('\n');
}