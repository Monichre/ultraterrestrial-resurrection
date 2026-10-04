// Agent Prompt Templates and Behavior Definitions

import { AgentType, SystemState } from './types';
import { KGNode, NODE_COLORS } from '../types/graph';

// Agent system prompt templates
export const agentPrompts: Record<AgentType, string> = {
  guide: `You are the Tour Guide Agent for a UFO Knowledge Graph Explorer. Your role is to:

1. **Narrate the tour** with engaging storytelling about UFO history
2. **Set context** for each node the user visits
3. **Create connections** between topics to make the tour feel cohesive
4. **Generate curiosity** by hinting at related discoveries

Your tone is: Scholarly yet approachable, like a knowledgeable friend sharing fascinating stories.
Use references to real historical context when appropriate.

When describing a UFO topic, include:
- Historical significance and why it matters
- Key details that would surprise listeners
- Connections to other topics in the graph
- A teaser for what might come next

Keep responses under 150 words. Be evocative but concise.`,

  navigator: `You are the Navigator Agent for a UFO Knowledge Graph. Your role is to:

1. **Plan tour paths** through the knowledge graph
2. **Recommend next destinations** based on user interests
3. **Explain why** certain nodes are connected
4. **Manage tour flow** and pacing

You have access to the current node, visited nodes, and available connections.
When recommending next steps, consider:
- Significance of unvisited nodes
- Thematic connections
- User engagement and pacing

Format your recommendations as: "Next: [Node Name] - [Brief Reason]"`,

  analyst: `You are the Analyst Agent for UFO data analysis. Your role is to:

1. **Provide deep insights** on the current topic
2. **Answer user questions** with factual information
3. **Cross-reference** data from related nodes
4. **Present statistics** and evidence clearly

You have access to the knowledge graph data including event details, witness counts, evidence types, and significance ratings.

When providing insights:
- Lead with the most important facts
- Use specific data points (dates, numbers, locations)
- Acknowledge uncertainties when present
- Connect to broader patterns in UFOlogy

Keep responses focused and informative. Under 200 words.`,

  visualizer: `You are the Visualizer Agent for the UFO Knowledge Graph. Your role is to:

1. **Describe how data** should be visualized
2. **Suggest visual elements** that would enhance understanding
3. **Generate data summaries** for charts or displays
4. **Create visual narratives** from complex information

For each node, suggest:
- Key data points to highlight
- Comparison data (when available)
- Visual metaphors or imagery
- Chart types or displays that would work

Format your output as JSON for easy rendering:
{
  "highlights": [...],
  "comparisons": [...],
  "suggestedVisuals": [...]
}

Keep descriptions concise and actionable.`,

  coordinator: `You are the Interaction Coordinator Agent. Your role is to:

1. **Route user requests** to appropriate agents
2. **Manage conversation flow** between agents
3. **Ensure responses** are coherent and well-timed
4. **Handle errors** gracefully

When a user asks a question:
- If asking about current topic → route to Analyst
- If asking about navigation → route to Navigator
- If asking for more story → route to Guide
- If asking about visualizations → route to Visualizer

Always acknowledge user input and set expectations for response timing.
Coordinate multi-agent responses to avoid conflicts or redundancy.
Format your responses as: "Routing to [Agent] for [specific aspect]..."`
};

// Context templates for different node types
export const nodeContextTemplates = {
  event: (node: KGNode) => `
## Current Topic: ${node.name}

**When**: ${node.properties.date || 'Date unknown'}
**Where**: ${node.properties.location || 'Location unknown'}

This is a significant UFO ${node.type} involving ${node.properties.witnesses || 'unknown'} witnesses.

Key Evidence:
${node.properties.evidence?.map(e => `- ${e}`).join('\n') || 'Evidence details pending'}

Significance Rating: ${node.properties.significance || '?'}/10
${node.properties.tags ? `Tags: ${node.properties.tags.join(', ')}` : ''}
`,

  location: (node: KGNode) => `
## Current Topic: ${node.name}

**Type**: ${node.type.charAt(0).toUpperCase() + node.type.slice(1)} Location
**Significance**: ${node.properties.significance || '?'}/10

${node.description}

${node.properties.tags ? `Key topics: ${node.properties.tags.join(', ')}` : ''}
`,

  entity: (node: KGNode) => `
## Current Topic: ${node.name}

**Type**: ${node.type.charAt(0).toUpperCase() + node.type.slice(1)}

${node.description}

${node.properties.date ? `Active: ${node.properties.date}` : ''}
${node.properties.classification ? `Classification: ${node.properties.classification}` : ''}
`,

  concept: (node: KGNode) => `
## Current Topic: ${node.name}

**Type**: ${node.type.charAt(0).toUpperCase() + node.type.slice(1)}

${node.description}

${node.properties.significance ? `Importance: ${node.properties.significance}/10` : ''}
${node.properties.date ? `Era: ${node.properties.date}` : ''}
`
};

// Format node for agent context
export function formatNodeContext(node: KGNode): string {
  const template = nodeContextTemplates[node.type as keyof typeof nodeContextTemplates];
  if (template) {
    return template(node);
  }
  return `
## ${node.name}

${node.description}

Significance: ${node.properties.significance || '?'}/10
`;
}

// Build prompt for specific agent with current state
export function buildAgentPrompt(
  agentType: AgentType,
  currentNode: KGNode | null,
  state: SystemState
): string {
  const basePrompt = agentPrompts[agentType];

  if (!currentNode) {
    return basePrompt + '\n\nNo current node selected. Awaiting user to select a starting point.';
  }

  const nodeContext = formatNodeContext(currentNode);

  let stateContext = `
**Current Position in Tour:**
- Step: ${state.currentStep}/${state.totalSteps}
- Visited: ${state.visitedNodes.length} nodes
- Path: ${state.path.join(' → ') || 'Not started'}
`;

  if (state.userQuery) {
    stateContext += `\n**User Question**: ${state.userQuery}`;
  }

  switch (agentType) {
    case 'guide':
      return `${basePrompt}

${nodeContext}

${stateContext}

${state.responses.analystInsight ? `**Analyst Note**: ${state.responses.analystInsight}` : ''}

Provide your narrative response.`;

    case 'navigator':
      return `${basePrompt}

${nodeContext}

${stateContext}

**Available Connections**: ${currentNode.connections.join(', ')}
**Visited Nodes**: ${state.visitedNodes.join(', ')}

Provide navigation recommendations.`;

    case 'analyst':
      return `${basePrompt}

${nodeContext}

${stateContext}

${state.userQuery ? `**User Query to Answer**: ${state.userQuery}` : 'Provide detailed analysis of this topic.'}

Provide your analytical response.`;

    case 'visualizer':
      return `${basePrompt}

${nodeContext}

**Node Type**: ${currentNode.type}
**Properties**: ${JSON.stringify(currentNode.properties, null, 2)}

Provide visualization recommendations as JSON.`;

    case 'coordinator':
      return `${basePrompt}

${stateContext}

**Current Node**: ${currentNode.name}
**User Interaction**: ${state.userQuery || 'None'}

Coordinate the agent responses and provide routing information.`;

    default:
      return basePrompt;
  }
}

// Generate guide narrative for a node
export function generateGuideNarrative(node: KGNode, state: SystemState): string {
  const nodeColor = NODE_COLORS[node.type as keyof typeof NODE_COLORS] || '#00D4FF';

  const narratives: Record<string, string> = {
    event: `**${node.name}** stands as a pivotal moment in UFO history. ${node.description.slice(0, 200)}...

This incident drew attention from ${node.properties.witnesses || 'witnesses'} and became a focal point for ${node.properties.tags?.slice(0, 2).join(' and ') || 'researchers'}.

What makes this case particularly compelling is the evidence that remains, including ${node.properties.evidence?.slice(0, 2).join(' and ') || 'various documentation'}.

As we explore further, you'll see how this event connects to the broader tapestry of UFO phenomena.`,

    location: `**${node.name}** represents a crucial ${node.type} in our understanding of UFO investigations.

${node.description.slice(0, 200)}...

This site has been central to ${node.properties.tags?.slice(0, 2).join(' and ') || 'UFO research'} for decades. Its significance is rated at ${node.properties.significance || '?'}/10.

Let's examine what makes this location so remarkable in the annals of UFOlogy.`,

    entity: `**${node.name}** - a name that has become synonymous with ${node.description.slice(0, 150).toLowerCase()}

${node.properties.classification ? `Classified as: ${node.properties.classification}` : ''}

This figure or organization has played a pivotal role in shaping our understanding of the UFO phenomenon. Their contributions range from ${node.properties.tags?.slice(0, 3).join(' to ') || 'various research areas'}.

Understanding their story is essential to grasping the full complexity of this field.`,

    concept: `**${node.name}** - a fundamental concept that shapes how we interpret UFO phenomena.

${node.description.slice(0, 200)}...

This idea has influenced ${node.properties.significance || '?'}/10 rating in importance, affecting how researchers approach the subject.

The concept connects to broader themes of ${node.properties.tags?.slice(0, 2).join(' and ') || 'various research areas'} that continue to evolve.`
  };

  return narratives[node.type] || narratives.concept;
}

// Generate analyst insights
export function generateAnalystInsight(node: KGNode): string {
  const insights: string[] = [];

  if (node.properties.witnesses) {
    insights.push(`${node.properties.witnesses} ${node.properties.witnesses === 1 ? 'witness' : 'witnesses'} reported this incident`);
  }

  if (node.properties.date) {
    insights.push(`Occurred on ${node.properties.date}`);
  }

  if (node.properties.location) {
    insights.push(`Location: ${node.properties.location}`);
  }

  if (node.properties.significance) {
    insights.push(`Historical significance: ${node.properties.significance}/10`);
  }

  if (node.properties.evidence && node.properties.evidence.length > 0) {
    insights.push(`Key evidence: ${node.properties.evidence.slice(0, 3).join(', ')}`);
  }

  if (node.properties.duration) {
    insights.push(`Duration: ${node.properties.duration}`);
  }

  if (node.properties.classification) {
    insights.push(`Classification: ${node.properties.classification}`);
  }

  return insights.join('\n\n');
}

// Generate visual data summary
export function generateVisualData(node: KGNode): string {
  const visualData = {
    nodeId: node.id,
    nodeName: node.name,
    nodeType: node.type,
    color: NODE_COLORS[node.type as keyof typeof NODE_COLORS] || '#00D4FF',
    highlights: [
      {
        label: 'Significance',
        value: node.properties.significance || 'Unknown',
        max: 10
      },
      ...(node.properties.witnesses ? [{
        label: 'Witnesses',
        value: node.properties.witnesses,
        max: 1000
      }] : [])
    ],
    tags: node.properties.tags || [],
    connections: node.connections.length
  };

  return JSON.stringify(visualData, null, 2);
}