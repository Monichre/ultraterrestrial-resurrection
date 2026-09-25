// Multi-Agent System Orchestration using LangGraph concepts

import { v4 as uuidv4 } from 'uuid';
import { AgentType, SystemState, AgentResponse } from './types';
import {
  getNodeData,
  getNodeConnections,
  calculateNextNodes,
  createInitialState,
  addAgentMessage
} from './types';
import {
  agentPrompts,
  formatNodeContext,
  generateGuideNarrative,
  generateAnalystInsight,
  generateVisualData
} from './prompts';
import { KGNode, NODE_COLORS } from '../types/graph';

// Simulated agent responses (in a real implementation, these would call actual LLMs)
// For demo purposes, we simulate LLM responses

class Agent {
  type: AgentType;
  prompt: string;

  constructor(type: AgentType) {
    this.type = type;
    this.prompt = agentPrompts[type];
  }

  async respond(context: {
    currentNode: KGNode | null;
    state: SystemState;
    userQuery?: string;
  }): Promise<string> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

    if (!context.currentNode) {
      return "Awaiting node selection. Please explore the knowledge graph.";
    }

    switch (this.type) {
      case 'guide':
        return this.generateGuideResponse(context.currentNode, context.state);
      case 'navigator':
        return this.generateNavigatorResponse(context.currentNode, context.state);
      case 'analyst':
        return this.generateAnalystResponse(context.currentNode, context.state, context.userQuery);
      case 'visualizer':
        return this.generateVisualizerResponse(context.currentNode, context.state);
      case 'coordinator':
        return this.generateCoordinatorResponse(context.currentNode, context.state);
      default:
        return "Agent processing...";
    }
  }

  private generateGuideResponse(node: KGNode, state: SystemState): string {
    const narratives: Record<string, string> = {
      event: `**${node.name}** stands as a pivotal moment in UFO history.

${node.description}

This incident involved ${node.properties.witnesses || 'multiple'} witnesses and became a focal point for ${node.properties.tags?.slice(0, 2).join(' and ') || 'UFO researchers'}.

Key evidence includes ${node.properties.evidence?.slice(0, 2).join(' and ') || 'various documentation methods'}.

The significance rating of ${node.properties.significance || '?'}/10 reflects its lasting impact on the field.

*Tap "Next" to continue exploring connected topics.*`,

      location: `**${node.name}** represents a crucial location in UFO research.

${node.description}

With a significance rating of ${node.properties.significance || '?'}/10, this site has been central to ${node.properties.tags?.join(', ') || 'various investigations'} for decades.

Many key discoveries and testimonies have emerged from this location.

*Explore the connections to learn more.*`,

      entity: `**${node.name}** has become synonymous with ${node.description.slice(0, 100).toLowerCase()}

${node.properties.classification ? `Classification: ${node.properties.classification}` : ''}

This figure or organization has played a pivotal role in shaping our understanding of the UFO phenomenon through ${node.properties.tags?.slice(0, 3).join(', ') || 'various contributions'}.

*Continue to explore their connections.*`,

      concept: `**${node.name}** - a fundamental concept that shapes how we interpret UFO phenomena.

${node.description}

This idea has influenced the field with an importance rating of ${node.properties.significance || '?'}/10, affecting how researchers approach the subject.

The concept connects to broader themes of ${node.properties.tags?.slice(0, 2).join(' and ') || 'various research areas'}.

*Discover how this concept relates to other topics.*`
    };

    return narratives[node.type] || narratives.concept;
  }

  private generateNavigatorResponse(node: KGNode, state: SystemState): string {
    const connections = getNodeConnections(node.id);
    const unvisitedConnections = connections.filter(n => !state.visitedNodes.includes(n.id));

    if (unvisitedConnections.length === 0) {
      return `You have explored all connections from **${node.name}**.

**Available Paths:**
- Return to previous nodes to explore different routes
- Ask about specific topics to dive deeper

Current progress: ${state.visitedNodes.length}/${state.path.length || '?'} nodes visited.`;
    }

    const recommendations = unvisitedConnections.slice(0, 3).map((n, i) => {
      const sig = n.properties.significance || 5;
      return `${i + 1}. **${n.name}** (${n.type}) - Significance: ${sig}/10`;
    }).join('\n');

    return `**Navigation Options from ${node.name}:**

${recommendations}

**Thematic Connection:** This node relates to ${node.properties.tags?.slice(0, 2).join(' and ') || 'various topics'}.

*Select any connection to continue the tour.*`;
  }

  private generateAnalystResponse(node: KGNode, state: SystemState, userQuery?: string): string {
    const insights: string[] = [];

    if (node.properties.date) {
      insights.push(`**Date**: ${node.properties.date}`);
    }
    if (node.properties.location) {
      insights.push(`**Location**: ${node.properties.location}`);
    }
    if (node.properties.witnesses) {
      insights.push(`**Witness Count**: ${node.properties.witnesses}`);
    }
    if (node.properties.duration) {
      insights.push(`**Duration**: ${node.properties.duration}`);
    }
    if (node.properties.classification) {
      insights.push(`**Classification**: ${node.properties.classification}`);
    }
    if (node.properties.significance) {
      insights.push(`**Significance**: ${node.properties.significance}/10`);
    }
    if (node.properties.evidence && node.properties.evidence.length > 0) {
      insights.push(`**Key Evidence**: ${node.properties.evidence.join(', ')}`);
    }

    const baseInfo = insights.join('\n');

    if (userQuery) {
      return `**Analysis for: ${node.name}**

${baseInfo}

---

**Regarding your question about "${userQuery}":**

This topic connects to ${node.properties.tags?.length || 0} related themes. The evidence base includes ${node.properties.evidence?.length || 0} documented items.

Further research could explore the connections shown in the knowledge graph.`;
    }

    return `**Data Summary: ${node.name}**

${baseInfo}

**Related Topics**: ${node.properties.tags?.join(', ') || 'Various'}

**Connections**: ${node.connections.length} related nodes in the graph`;
  }

  private generateVisualizerResponse(node: KGNode, state: SystemState): string {
    const nodeColor = NODE_COLORS[node.type as keyof typeof NODE_COLORS] || '#00D4FF';

    return JSON.stringify({
      nodeId: node.id,
      nodeName: node.name,
      nodeType: node.type,
      color: nodeColor,
      highlights: [
        {
          label: 'Significance',
          value: node.properties.significance || 5,
          max: 10,
          color: nodeColor
        },
        ...(node.properties.witnesses ? [{
          label: 'Witnesses',
          value: node.properties.witnesses,
          max: 1000,
          color: '#7B68EE'
        }] : [])
      ],
      tags: node.properties.tags || [],
      connectionCount: node.connections.length,
      visualStyle: node.type === 'event' ? 'timeline' : node.type === 'location' ? 'map' : 'network'
    }, null, 2);
  }

  private generateCoordinatorResponse(node: KGNode, state: SystemState): string {
    const agents = ['Guide', 'Navigator', 'Analyst', 'Visualizer'];
    const status = agents.map(a => `✓ ${a} ready`).join('\n');

    return `**System Status**

${status}

**Current Node**: ${node.name} (${node.type})
**Tour Progress**: ${state.visitedNodes.length} visited

**Agent Coordination Active**
- Guide: Providing narrative context
- Navigator: Mapping connections
- Analyst: Preparing data insights
- Visualizer: Rendering display elements

*All systems operational. Ready for interaction.*`;
  }
}

// Multi-Agent System Class
export class MultiAgentSystem {
  private agents: Map<AgentType, Agent>;
  private state: SystemState;

  constructor() {
    this.agents = new Map([
      ['guide', new Agent('guide')],
      ['navigator', new Agent('navigator')],
      ['analyst', new Agent('analyst')],
      ['visualizer', new Agent('visualizer')],
      ['coordinator', new Agent('coordinator')]
    ]);
    this.state = createInitialState();
  }

  getState(): SystemState {
    return this.state;
  }

  // Start a new tour
  async startTour(startNodeId: string): Promise<AgentResponse[]> {
    const startNode = getNodeData(startNodeId);
    if (!startNode) {
      throw new Error('Invalid start node');
    }

    this.state = createInitialState({
      currentNodeId: startNodeId,
      path: [startNodeId],
      visitedNodes: [startNodeId],
      tourStatus: 'active',
      currentStep: 1,
      totalSteps: 1
    });

    return this.activateNode(startNode);
  }

  // Activate a node and get all agent responses
  async activateNode(node: KGNode): Promise<AgentResponse[]> {
    this.state.currentNodeId = node.id;

    // Add to path if new
    if (!this.state.path.includes(node.id)) {
      this.state.path = [...this.state.path, node.id];
    }

    // Mark as visited
    if (!this.state.visitedNodes.includes(node.id)) {
      this.state.visitedNodes = [...this.state.visitedNodes, node.id];
      this.state.currentStep++;
    }

    // Get responses from all agents (parallel)
    const responses = await Promise.all(
      Array.from(this.agents.entries()).map(async ([type, agent]) => ({
        agent: type,
        content: await agent.respond({
          currentNode: node,
          state: this.state
        }),
        timestamp: Date.now()
      }))
    );

    // Update state with responses
    responses.forEach(r => {
      switch (r.agent) {
        case 'guide':
          this.state.responses.guideNarrative = r.content;
          break;
        case 'analyst':
          this.state.responses.analystInsight = r.content;
          break;
        case 'visualizer':
          this.state.responses.visualData = r.content;
          break;
        case 'navigator':
          this.state.responses.navigatorPath = calculateNextNodes(node.id, this.state.visitedNodes);
          break;
      }
      this.state = addAgentMessage(this.state, r.agent, r.content);
    });

    return responses;
  }

  // Handle user question
  async handleQuestion(question: string): Promise<AgentResponse> {
    this.state.userQuery = question;
    this.state = addAgentMessage(this.state, 'coordinator', `User question: ${question}`);

    const analyst = this.agents.get('analyst')!;
    const response = await analyst.respond({
      currentNode: this.state.currentNodeId ? getNodeData(this.state.currentNodeId) || null : null,
      state: this.state,
      userQuery: question
    });

    this.state.queryResponse = response;
    return {
      agent: 'analyst',
      content: response,
      timestamp: Date.now()
    };
  }

  // Navigate to next node
  async navigateToNode(nodeId: string): Promise<AgentResponse[]> {
    const node = getNodeData(nodeId);
    if (!node) {
      throw new Error('Invalid node');
    }
    return this.activateNode(node);
  }

  // Get current recommendations
  getRecommendations(): string[] {
    if (!this.state.currentNodeId) return [];
    return calculateNextNodes(this.state.currentNodeId, this.state.visitedNodes);
  }

  // Reset tour
  resetTour(): void {
    this.state = createInitialState();
  }

  // Pause/Resume tour
  pauseTour(): void {
    this.state.tourStatus = 'paused';
  }

  resumeTour(): void {
    this.state.tourStatus = 'active';
  }

  // Get visual data for current node
  getCurrentVisualData(): string {
    return this.state.responses.visualData || '{}';
  }
}

// Singleton instance
let systemInstance: MultiAgentSystem | null = null;

export function getMultiAgentSystem(): MultiAgentSystem {
  if (!systemInstance) {
    systemInstance = new MultiAgentSystem();
  }
  return systemInstance;
}

// Export individual agent classes for testing
export { Agent };