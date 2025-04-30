# Shared AI Context for Mindmap

This directory contains the shared AI context implementation for the mindmap components, creating a unified context interface between the graph and menu components.

## Overview

The `SharedAIProvider` centralizes all AI-related functionality in a single context provider. This approach:

1. **Eliminates duplication** of context and function registrations
2. **Ensures consistency** across components using the same AI assistant
3. **Simplifies maintenance** by centralizing all AI-related code
4. **Improves performance** by avoiding duplicate registrations with the Assistant UI runtime

## Architecture

The shared context architecture follows these principles:

1. **Single Source of Truth**: All AI-related state and functions live in one context
2. **Unified Registration**: A single registration with the Assistant UI runtime
3. **Shared Context Provider**: Components consume the same context
4. **Standardized Interface**: Consistent function signatures across components

## Implementation

### The Provider

```tsx
// SharedAIProvider sets up all AI functionality
<SharedAIProvider>
  {/* Components that need AI capabilities */}
</SharedAIProvider>
```

### The Context Hook

```tsx
// Inside any component that needs AI capabilities
const {
  // State
  activeCommand,
  selectedModel,
  
  // Actions
  setActiveCommand,
  setSelectedModel,
  
  // Functions for graph interactions
  handleAddNote,
  handleFindConnections,
  // ...more functions
} = useSharedAI()
```

## Component Integration

The shared context integrates with components in two ways:

### 1. Smart Components

Smart components that wrap existing components:

```tsx
// SmartGraphWithSharedContext.tsx
export function SmartGraphWithSharedContext({ children }) {
  // Access shared context
  const { ... } = useSharedAI()
  
  // Render children (Graph component)
  return <>{children}</>
}
```

### 2. Direct Integration

Components can also use the context directly:

```tsx
// YourComponent.tsx
export function YourComponent() {
  // Access shared context
  const { 
    handleAddNote, 
    handleLoadRelatedEntities 
  } = useSharedAI()
  
  return (
    <button onClick={() => handleAddNote("New insight")}>
      Add Note
    </button>
  )
}
```

## Usage

To use the shared context in your application:

```tsx
'use client'

import { SharedAIProvider } from '@/features/mindmap/ai-context/shared-ai-context'
import { SmartMindmapWithSharedContext } from '@/features/mindmap/smart-mindmap-with-shared-context'
import { AssistantProvider } from '@assistant-ui/react'

export default function MindmapPage() {
  return (
    <AssistantProvider>
      {/* SharedAIProvider is already included in SmartMindmapWithSharedContext */}
      <SmartMindmapWithSharedContext />
    </AssistantProvider>
  )
}
```

## Benefits Over Independent Context Providers

1. **Reduced Bundle Size**: Only one context registration with Assistant UI
2. **Consistent State**: All components share the same state
3. **Better Performance**: Fewer renders and registrations
4. **Simplified Mental Model**: One place for all AI capabilities
5. **Easier Testing**: Mock a single context instead of multiple ones