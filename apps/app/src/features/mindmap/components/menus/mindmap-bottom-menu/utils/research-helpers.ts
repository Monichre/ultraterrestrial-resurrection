import { type Message as AISdkMessage } from '@ai-sdk/react';

// Type definitions for research operations
export interface ResearchNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
  parentId?: string;
}

export interface ResearchConnection {
  id: string;
  source: string;
  target: string;
  type: string;
  data?: Record<string, unknown>;
}

export interface SearchResult {
  records?: any[];
  answer?: string;
  sessionId?: string;
  totalCount?: number;
}

export interface AnalysisResult {
  type: 'spatial' | 'temporal' | 'thematic' | 'correlation';
  nodes: string[];
  connections: ResearchConnection[];
  insights: string[];
  confidence: number;
  timestamp: Date;
}

// Helper functions for research operations
export function calculateNodeDistance(node1: ResearchNode, node2: ResearchNode): number {
  return Math.sqrt(
    Math.pow(node1.position.x - node2.position.x, 2) +
    Math.pow(node1.position.y - node2.position.y, 2)
  );
}

export function findProximityGroups(nodes: ResearchNode[], threshold: number = 150): ResearchNode[][] {
  const groups: ResearchNode[][] = [];
  const visited = new Set<string>();

  for (const node of nodes) {
    if (visited.has(node.id)) continue;

    const group = [node];
    visited.add(node.id);

    // Find all nodes within threshold distance
    for (const otherNode of nodes) {
      if (visited.has(otherNode.id)) continue;

      const distance = calculateNodeDistance(node, otherNode);
      if (distance <= threshold) {
        group.push(otherNode);
        visited.add(otherNode.id);
      }
    }

    if (group.length > 1) {
      groups.push(group);
    }
  }

  return groups;
}

export function generateConnectionId(sourceId: string, targetId: string, type: string = 'default'): string {
  return `${type}-${sourceId}-${targetId}`;
}

export function createSpatialConnection(
  sourceId: string, 
  targetId: string, 
  distance: number, 
  analysisType: string = 'proximity'
): ResearchConnection {
  return {
    id: generateConnectionId(sourceId, targetId, 'spatial'),
    source: sourceId,
    target: targetId,
    type: 'spatial-connection',
    data: {
      distance,
      analysisType,
      strength: Math.max(0, 1 - (distance / 300)), // Normalized strength
      timestamp: new Date().toISOString()
    }
  };
}

export function analyzeNodeConnections(
  nodes: ResearchNode[], 
  analysisType: 'proximity' | 'temporal' | 'thematic' = 'proximity'
): AnalysisResult {
  const connections: ResearchConnection[] = [];
  const insights: string[] = [];

  switch (analysisType) {
    case 'proximity':
      const proximityGroups = findProximityGroups(nodes);
      
      for (const group of proximityGroups) {
        for (let i = 0; i < group.length; i++) {
          for (let j = i + 1; j < group.length; j++) {
            const distance = calculateNodeDistance(group[i], group[j]);
            const connection = createSpatialConnection(group[i].id, group[j].id, distance);
            connections.push(connection);
          }
        }
        
        if (group.length > 1) {
          insights.push(`Found spatial cluster of ${group.length} related nodes`);
        }
      }
      break;

    case 'temporal':
      // Temporal analysis based on node data dates
      const temporalNodes = nodes.filter(node => node.data.date);
      temporalNodes.sort((a, b) => {
        const dateA = new Date(a.data.date as string);
        const dateB = new Date(b.data.date as string);
        return dateA.getTime() - dateB.getTime();
      });

      for (let i = 0; i < temporalNodes.length - 1; i++) {
        const connection: ResearchConnection = {
          id: generateConnectionId(temporalNodes[i].id, temporalNodes[i + 1].id, 'temporal'),
          source: temporalNodes[i].id,
          target: temporalNodes[i + 1].id,
          type: 'temporal-connection',
          data: {
            analysisType: 'temporal',
            sequence: i,
            timestamp: new Date().toISOString()
          }
        };
        connections.push(connection);
      }
      
      insights.push(`Found temporal sequence of ${temporalNodes.length} chronologically related nodes`);
      break;

    case 'thematic':
      // Thematic analysis based on node types and content
      const thematicGroups = new Map<string, ResearchNode[]>();
      
      for (const node of nodes) {
        const theme = node.type || 'unknown';
        if (!thematicGroups.has(theme)) {
          thematicGroups.set(theme, []);
        }
        thematicGroups.get(theme)!.push(node);
      }

      for (const [theme, themeNodes] of thematicGroups) {
        if (themeNodes.length > 1) {
          for (let i = 0; i < themeNodes.length; i++) {
            for (let j = i + 1; j < themeNodes.length; j++) {
              const connection: ResearchConnection = {
                id: generateConnectionId(themeNodes[i].id, themeNodes[j].id, 'thematic'),
                source: themeNodes[i].id,
                target: themeNodes[j].id,
                type: 'thematic-connection',
                data: {
                  analysisType: 'thematic',
                  theme,
                  timestamp: new Date().toISOString()
                }
              };
              connections.push(connection);
            }
          }
          
          insights.push(`Found thematic cluster: ${theme} (${themeNodes.length} nodes)`);
        }
      }
      break;
  }

  return {
    type: analysisType,
    nodes: nodes.map(n => n.id),
    connections,
    insights,
    confidence: Math.min(1, connections.length / nodes.length), // Simple confidence metric
    timestamp: new Date()
  };
}

export function calculateScreenCenter(): { x: number; y: number } {
  if (typeof window === 'undefined') {
    return { x: 400, y: 300 }; // Default fallback
  }
  
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  };
}

export function generateCircularLayout(
  count: number, 
  center: { x: number; y: number }, 
  radius: number = 100
): { x: number; y: number }[] {
  const positions = [];
  
  for (let i = 0; i < count; i++) {
    const angle = (i * (2 * Math.PI)) / count;
    positions.push({
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius
    });
  }
  
  return positions;
}

export function formatSearchQuery(type: string, searchTerm: string): string {
  // Clean and format search query for better results
  const cleanTerm = searchTerm.trim().toLowerCase();
  
  // Add type-specific formatting
  switch (type) {
    case 'events':
      return `event:${cleanTerm}`;
    case 'personnel':
      return `person:${cleanTerm}`;
    case 'locations':
      return `location:${cleanTerm}`;
    case 'testimonies':
      return `testimony:${cleanTerm}`;
    default:
      return cleanTerm;
  }
}

// Message handling utilities
export function convertAiSdkMessage(message: AISdkMessage): any {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    timestamp: new Date().toISOString(),
    type: 'ai-sdk-message'
  };
}

export function loadMessagesFromLocalStorage(): AISdkMessage[] {
  if (typeof window === 'undefined') return [];

  try {
    const savedMessages = localStorage.getItem('researchMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  } catch (error) {
    console.error('Error loading research messages from localStorage:', error);
    return [];
  }
}

export function saveMessagesToLocalStorage(messages: AISdkMessage[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('researchMessages', JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving research messages to localStorage:', error);
  }
}

// Error handling utilities
export function createResearchError(
  message: string, 
  code: string, 
  operation: string, 
  details?: unknown
): Error & { code: string; operation: string; details?: unknown } {
  const error = new Error(message) as any;
  error.code = code;
  error.operation = operation;
  error.details = details;
  return error;
}

export function isResearchError(error: unknown): error is Error & { code: string; operation: string } {
  return error instanceof Error && 'code' in error && 'operation' in error;
}

// Performance utilities
export function debounce<T extends (...args: any[]) => void>(
  func: T, 
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export function throttle<T extends (...args: any[]) => void>(
  func: T, 
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}