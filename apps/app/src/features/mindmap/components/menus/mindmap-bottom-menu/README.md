# Smart Bottom Menu with Assistant UI Integration

This directory contains the implementation of the MindMap bottom menu with AI assistance capabilities through the Assistant UI framework.

## Overview

The bottom menu serves as the primary interface for users to interact with the mindmap. It provides commands for:

- Searching entity databases
- Chatting with the AI assistant
- Analyzing connections
- Exploring related entities
- Deep research capabilities

## Smart Bottom Menu Implementation

The `SmartBottomMenu` component enhances the standard `MindMapBottomMenu` with AI capabilities:

1. **Context Awareness**: Provides real-time state information to the AI assistant
2. **Function Calling**: Allows the AI to directly manipulate the menu state and perform actions
3. **Intelligent Command Execution**: Enables natural language processing of user requests

## Usage

To use the AI-enhanced bottom menu in your application:

```tsx
'use client'

import { MindMapProvider } from '@/contexts/mindmap/mindmap-context'
import { SmartBottomMenu } from '@/features/mindmap/components/menus/mindmap-bottom-menu'
import { AssistantProvider } from '@assistant-ui/react'

export default function MindmapPage() {
  return (
    <AssistantProvider>
      <MindMapProvider>
        {/* Your graph component */}
        <SmartBottomMenu />
      </MindMapProvider>
    </AssistantProvider>
  )
}
```

## Available AI Functions

The Smart Bottom Menu provides these functions to the AI assistant:

| Function | Description | Parameters |
|----------|-------------|------------|
| `executeCommand` | Activates a command mode | `commandId: string` |
| `selectEntityType` | Selects an entity type | `entityType: string` |
| `createSearchNode` | Creates a search node | `searchTerm: string, entityType?: string` |
| `addInsightToNode` | Adds AI insight to a node | `nodeId: string, insight: string` |

## Example Interactions

```
User: "Search for UFO sightings in 1964"
Assistant: [Uses selectEntityType("events") and createSearchNode("UFO sightings 1964")]

User: "I want to chat with you about the Roswell incident"
Assistant: [Uses executeCommand("chat") to activate chat mode]

User: "What's the connection between these people?"
Assistant: [Uses executeCommand("analyze") to activate analysis mode]
```

## Implementation Details

The implementation follows the Assistant UI pattern:

1. **Context Provider**: Registers dynamic context with the assistant runtime
2. **Function Registration**: Provides functions for the AI to interact with the UI
3. **State Monitoring**: Tracks command and model selection changes to update context

This approach maintains the existing functionality while adding AI capabilities in a clean, maintainable way.