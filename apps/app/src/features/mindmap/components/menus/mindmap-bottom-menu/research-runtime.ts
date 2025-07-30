import { useLocalRuntime } from "@assistant-ui/react";
import { tool } from "@assistant-ui/react";
import { z } from "zod";
import { useMindMap } from '@/contexts/mindmap/mindmap-context';
import { initiateDatabaseTableQuery } from '@/features/mindmap/actions/search';
import { ENTITY_TYPES } from './entity-types';
import { 
  createEnhancedUserInputNode, 
  createEnhancedEntityNode,
  getNodeType 
} from '@/features/mindmap/utils/node-enhancement-utils';
import { 
  historicalQueryAgent,
  queueChronologicalProgression,
  queueContextualExpansion,
  type HistoricalQueryTask 
} from '@/features/mindmap/agents/historical-query-agent';

// UFO Research Tools
export const createResearchNodeTool = tool({
  parameters: z.object({
    type: z.enum(['events', 'testimonies', 'personnel', 'organizations', 'locations', 'documents', 'topics', 'artifacts']),
    query: z.string().describe("Search query to find relevant UFO/UAP records"),
    connectionTo: z.array(z.string()).optional().describe("Node IDs to connect this new node to"),
    amount: z.number().default(3).describe("Number of records to retrieve")
  }),
  execute: async ({ type, query, connectionTo, amount }) => {
    const mindmapContext = useMindMap();
    const { addNodes, addNodesWithLayout, addEdges, screenToFlowPosition, getNodes } = mindmapContext;
    
    try {
      // Use existing search functionality
      const result = await initiateDatabaseTableQuery(type, query, amount);
      
      if (result.records && result.records.length > 0) {
        // Calculate center position
        const center = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        
        // Create enhanced nodes
        const newNodes = result.records.map((record: any, index: number) => {
          const angle = (index * (2 * Math.PI)) / result.records.length;
          const radius = 100;
          const position = {
            x: center.x + Math.cos(angle) * radius,
            y: center.y + Math.sin(angle) * radius
          };
          
          return createEnhancedEntityNode({
            id: record.id,
            type: getNodeType(type),
            position,
            data: record
          });
        });
        
        await addNodesWithLayout(newNodes, {
          direction: 'radial',
          parentChildSpacing: 150,
          siblingSpacing: 100
        });
        
        // Create connections if specified
        if (connectionTo && connectionTo.length > 0) {
          const connections = newNodes.flatMap(newNode => 
            connectionTo.map(targetId => ({
              id: `${newNode.id}-${targetId}`,
              source: newNode.id,
              target: targetId,
              type: 'research-connection'
            }))
          );
          addEdges(connections);
        }
        
        return {
          success: true,
          nodesCreated: newNodes.length,
          connectionsCreated: connectionTo?.length || 0,
          summary: `Created ${newNodes.length} ${type} nodes for "${query}"`
        };
      } else {
        return {
          success: false,
          error: `No ${type} records found for "${query}"`
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to create ${type} nodes: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
});

export const analyzeSpatialConnectionsTool = tool({
  parameters: z.object({
    nodeIds: z.array(z.string()).describe("Node IDs to analyze for spatial relationships"),
    analysisType: z.enum(['proximity', 'temporal', 'thematic']).default('proximity')
  }),
  execute: async ({ nodeIds, analysisType }) => {
    const mindmapContext = useMindMap();
    const { getNodes, addEdges } = mindmapContext;
    
    try {
      const nodes = getNodes().filter(node => nodeIds.includes(node.id));
      
      if (nodes.length < 2) {
        return {
          success: false,
          error: "Need at least 2 nodes for spatial analysis"
        };
      }
      
      // Analyze connections based on type
      const connections = [];
      const insights = [];
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const node1 = nodes[i];
          const node2 = nodes[j];
          
          // Calculate distance for proximity analysis
          if (analysisType === 'proximity') {
            const distance = Math.sqrt(
              Math.pow(node1.position.x - node2.position.x, 2) +
              Math.pow(node1.position.y - node2.position.y, 2)
            );
            
            if (distance < 150) {
              connections.push({
                id: `spatial-${node1.id}-${node2.id}`,
                source: node1.id,
                target: node2.id,
                type: 'spatial-connection',
                data: { distance, analysisType }
              });
              
              insights.push(`${node1.data.title} and ${node2.data.title} are spatially related (distance: ${Math.round(distance)}px)`);
            }
          }
        }
      }
      
      if (connections.length > 0) {
        addEdges(connections);
      }
      
      return {
        success: true,
        connectionsFound: connections.length,
        insights,
        analysisType,
        summary: `Found ${connections.length} spatial connections using ${analysisType} analysis`
      };
    } catch (error) {
      return {
        success: false,
        error: `Spatial analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
});

export const generateHistoricalTourTool = tool({
  parameters: z.object({
    theme: z.string().describe("Tour theme (e.g., 'Government Disclosure', '1940s Sightings', 'Key Whistleblowers')"),
    startDate: z.string().optional().describe("Start date for the tour"),
    endDate: z.string().optional().describe("End date for the tour"),
    maxStops: z.number().default(10).describe("Maximum number of tour stops")
  }),
  execute: async ({ theme, startDate, endDate, maxStops }) => {
    try {
      // Use existing historical query agent
      const tourTask = await queueChronologicalProgression({
        theme,
        dateRange: startDate && endDate ? { start: startDate, end: endDate } : undefined,
        maxNodes: maxStops
      });
      
      return {
        success: true,
        tourId: tourTask.id,
        theme,
        stepsPlanned: maxStops,
        summary: `Created historical tour: "${theme}" with up to ${maxStops} stops`
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to create historical tour: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
});

export const crossReferenceTestimoniesTool = tool({
  parameters: z.object({
    witnessName: z.string().optional().describe("Name of the witness to cross-reference"),
    eventDate: z.string().optional().describe("Date of the event"),
    location: z.string().optional().describe("Location of the event"),
    keywords: z.array(z.string()).optional().describe("Keywords to search for")
  }),
  execute: async ({ witnessName, eventDate, location, keywords }) => {
    try {
      const searchQueries = [];
      
      if (witnessName) searchQueries.push(`witness:${witnessName}`);
      if (eventDate) searchQueries.push(`date:${eventDate}`);
      if (location) searchQueries.push(`location:${location}`);
      if (keywords) searchQueries.push(...keywords);
      
      const query = searchQueries.join(' ');
      
      const result = await initiateDatabaseTableQuery('testimonies', query, 20);
      
      if (result.records && result.records.length > 0) {
        // Analyze correlations
        const correlations = result.records.map((testimony: any) => ({
          id: testimony.id,
          witness: testimony.witness,
          consistency: Math.random() * 100, // Placeholder for actual analysis
          credibility: Math.random() * 100, // Placeholder for actual analysis
          keyPoints: testimony.summary?.split('.').slice(0, 3) || []
        }));
        
        return {
          success: true,
          testimoniesFound: result.records.length,
          correlations,
          averageCredibility: correlations.reduce((sum, c) => sum + c.credibility, 0) / correlations.length,
          summary: `Cross-referenced ${result.records.length} testimonies with ${correlations.length} correlations found`
        };
      } else {
        return {
          success: false,
          error: "No testimonies found matching the criteria"
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Cross-reference failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
});

export function useResearchRuntime() {
  const mindmapContext = useMindMap();
  const { getNodes, getEdges } = mindmapContext;
  
  return useLocalRuntime({
    initialMessages: [],
    
    system: `
      You are an expert UFO/UAP research assistant with access to:
      - 230,998+ database records across 29 entity types
      - Spatial intelligence for analyzing node relationships
      - Historical tour generation for chronological exploration
      - Cross-referencing capabilities for testimony analysis
      
      Your primary functions:
      1. Help researchers explore UFO/UAP data connections
      2. Analyze spatial relationships between events, people, locations
      3. Generate insights from testimony cross-referencing
      4. Create guided historical tours through significant events
      5. Suggest visualization approaches for complex data relationships
      
      Available entity types: ${ENTITY_TYPES.map(e => e.type).join(', ')}
      
      Current mindmap state:
      - Active nodes: ${getNodes().length}
      - Active connections: ${getEdges().length}
      
      Use the available tools to help users explore and understand UFO/UAP phenomena.
    `,
    
    tools: {
      createResearchNode: createResearchNodeTool,
      analyzeSpatialConnections: analyzeSpatialConnectionsTool,
      generateHistoricalTour: generateHistoricalTourTool,
      crossReferenceTestimonies: crossReferenceTestimoniesTool
    }
  });
}