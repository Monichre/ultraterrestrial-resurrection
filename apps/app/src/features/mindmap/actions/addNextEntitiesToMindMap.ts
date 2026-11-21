import { ReactFlowNode, ReactFlowEdge, xataToXYFlow } from './xata-to-xyflow';
import { organizeNodeLayout } from '../layouts/organizeNodeLayout';

/**
 * Helper function to add entities to the mind map with automatic layout
 * This demonstrates how the layout system can be used in various actions
 * 
 * @param sourceNode Source node to connect entities to
 * @param table Database table to query
 * @param question Question to ask the AI
 * @param reactFlowInstance React Flow instance for getting current nodes/edges
 * @param callbacks Object with callback functions for node/edge operations
 * @returns Added nodes and edges
 */
export async function addEntitiesWithLayout({
  sourceNode,
  table,
  question,
  reactFlowInstance,
  callbacks
}: {
  sourceNode: ReactFlowNode;
  table: string;
  question: string;
  reactFlowInstance: any;
  callbacks: {
    setNodes: (nodes: any) => void;
    addNodes: (nodes: any) => void;
    addEdges: (edges: any) => void;
    updateNodeData: (id: string, data: any) => void;
  }
}) {
  try {
    // Determine best layout type based on entity type
    let layoutType: 'horizontal' | 'vertical' | 'radial' | 'grid' = 'horizontal';
    
    // Choose layout based on entity type
    switch (table) {
      case 'events':
        layoutType = 'horizontal';
        break;
      case 'personnel':
      case 'organizations':
        layoutType = 'radial';
        break;
      case 'testimonies':
        layoutType = 'vertical';
        break;
      case 'documents':
      case 'artifacts':
        layoutType = 'grid';
        break;
      default:
        layoutType = 'horizontal';
    }
    
    // Get existing nodes
    const existingNodes = reactFlowInstance.getNodes();
    
    // Use xataToXYFlow with appropriate layout type
    const flowData = await xataToXYFlow({
      question,
      table,
      rules: `Find interesting ${table} records that have clear relationships`,
      context: `The user is exploring the ${table} database`,
      existingNodes,
      sourceNode,
      layoutType
    });
    
    // Add nodes and edges to the graph
    if (flowData.nodes && flowData.nodes.length > 0) {
      callbacks.addNodes(flowData.nodes);
    }
    
    if (flowData.edges && flowData.edges.length > 0) {
      callbacks.addEdges(flowData.edges);
    }
    
    // Update source node with results info
    if (flowData.xataResponse) {
      callbacks.updateNodeData(sourceNode.id, {
        entities: flowData.xataResponse.records,
        answer: flowData.xataResponse.answer,
        sessionId: flowData.xataResponse.sessionId
      });
    }
    
    // Apply additional layout to ensure everything looks good
    setTimeout(() => {
      if (reactFlowInstance) {
        const currentNodes = reactFlowInstance.getNodes();
        const currentEdges = reactFlowInstance.getEdges();
        
        // Fine-tune the entire layout
        const layoutedNodes = organizeNodeLayout(
          currentNodes,
          currentEdges,
          {
            direction: layoutType,
            centerChildren: true,
            parentChildSpacing: table === 'events' ? 150 : 100,
            siblingSpacing: table === 'personnel' ? 80 : 50
          }
        );
        
        callbacks.setNodes(layoutedNodes);
        
        // Ensure everything is visible
        reactFlowInstance.fitView({ padding: 0.2 });
      }
    }, 200);
    
    return flowData;
  } catch (error) {
    console.error('Error adding entities with layout:', error);
    return null;
  }
} 