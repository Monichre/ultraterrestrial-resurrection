# Mindmap with Assistant UI Integration

This directory contains the mindmap visualization components and integration with Assistant UI.

## AI-Enhanced Graph Features

The AIEnabledGraph component wraps the standard Graph component with Assistant UI context awareness, enabling:

1. Contextual AI assistance based on the current graph state
2. Intelligent suggestions based on visible nodes and connections
3. Direct AI interaction with the graph through function calling

## Usage Example

To use the AI-enabled graph in a page:

```tsx
'use client'

import { MindMapProvider } from '@/contexts/mindmap/mindmap-context'
import { AIEnabledGraph } from '@/features/mindmap/smart-graph'
import { AssistantProvider } from '@assistant-ui/react'

export default function MindmapPage() {
  return (
    <AssistantProvider>
      <MindMapProvider>
        <AIEnabledGraph />
      </MindMapProvider>
    </AssistantProvider>
  )
}
```

## How It Works

The implementation uses two key Assistant UI patterns:

### 1. Model Context Provider

```tsx
// Dynamically exposes the current graph state to the AI
assistantRuntime.registerModelContextProvider({
  getModelContext: () => ({
    system: `
      # Mindmap Graph Context
      - Total nodes: ${nodes.length}
      - Active node: ${activeNode ? activeNode.id : 'None'}
      ...
    `,
  }),
})
```

### 2. Function Registration

```tsx
// Registers functions that the AI can call to interact with the graph
assistantRuntime.registerFunctions({
  addNote: handleAddNote,
  findConnections: handleFindConnections,
  loadRelatedEntities: handleLoadRelatedEntities,
  updateNodeLabel: handleUpdateNodeLabel,
  deleteNode: handleDeleteNode,
  reorganizeLayout: handleReorganizeLayout
})
```

## Available AI Functions

The SmartGraph component exposes these functions to the assistant:

| Function | Description | Parameters |
|----------|-------------|------------|
| `addNote` | Creates a new user input node | `input: string, position?: {x, y}` |
| `findConnections` | Finds connections for a node | `nodeId: string` |
| `loadRelatedEntities` | Loads more related entities | `nodeId: string` |
| `updateNodeLabel` | Updates a node's label | `nodeId: string, newLabel: string` |
| `deleteNode` | Removes a node from the graph | `nodeId: string` |
| `reorganizeLayout` | Rearranges the graph layout | `direction: "horizontal" | "vertical" | "radial"` |

## Example Interactions

Users can interact with the graph through natural language:

```
User: "Can you show me connections for the node about Area 51?"
Assistant: [Uses findConnections() to visualize connections]

User: "Add a note about potential military involvement"
Assistant: [Uses addNote() to create a new node with that content]

User: "This graph is getting messy, can you organize it better?"
Assistant: [Uses reorganizeLayout() to improve the graph structure]
```

## Implementation Details

The SmartGraph wrapper maintains stateless behavior, only depending on the current state of the mindmap as provided by the context. This ensures that the AI assistant always has up-to-date information about the graph state while keeping the implementation clean and maintainable.