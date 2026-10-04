# Langbase SDK Implementation Plan

## Overview

This document outlines the plan to replace the current HTTP request-based implementation in the Prometheus AI application with the Langbase SDK to improve performance, reduce response times, and enhance error handling.

## Current Implementation Issues

The current implementation in `components/agent.tsx` has several limitations:

1. Uses direct HTTP fetch calls to `https://api.langbase.com/monichre/prometheus`
2. Requires establishing a new connection for each request
3. No streaming capabilities for progressive responses
4. Basic error handling
5. Hardcoded authentication token
6. Lacks type safety for request/response objects

## Implementation Steps

### 1. Install Langbase SDK

```bash
# Using npm
npm install @langbase/sdk

# Using Bun
bun add @langbase/sdk
```

### 2. Update Agent Component

#### 2.1. Import the SDK

```typescript
// components/agent.tsx
import { LangbaseClient } from '@langbase/sdk';
```

#### 2.2. Initialize the Client

Create a singleton client instance to reuse connections:

```typescript
// lib/langbase-client.ts
import { LangbaseClient } from '@langbase/sdk';

// Load token from environment variable
const API_TOKEN = process.env.NEXT_PUBLIC_LANGBASE_API_TOKEN;

// Create singleton client
export const langbaseClient = new LangbaseClient({
  apiToken: API_TOKEN,
  project: 'prometheus',
});
```

#### 2.3. Replace Fetch Implementation

Update the `handleSubmit` function in `components/agent.tsx`:

```typescript
import { langbaseClient } from '@/lib/langbase-client';

// ...existing code...

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!input.trim()) {
    toast.warning("Please enter a question or request", {
      closeButton: true,
      duration: 3000,
    });
    return;
  }

  setIsLoading(true);
  setResponse("");

  try {
    // Use streaming response with the SDK
    const stream = await langbaseClient.chat.completions.create({
      input: input,
      attachments: attachments.map((att) => ({
        name: att.name,
        type: att.type,
        size: att.size,
      })),
      framework: "prometheus", // or "daedalus" if needed
      stream: true, // Enable streaming
    });

    // Progressive response handling
    let fullResponse = "";
    
    // Set up stream handling
    for await (const chunk of stream) {
      // Append each chunk to the response
      const chunkText = chunk.choices[0]?.delta?.content || "";
      fullResponse += chunkText;
      
      // Update UI with the current response
      setResponse(fullResponse);
    }
    
    console.log("Agent response complete");
  } catch (error: any) {
    console.error("Error processing request:", error);
    toast.error(error.message || "An error occurred while processing your request", {
      closeButton: true,
      duration: Number.POSITIVE_INFINITY,
    });
  } finally {
    setIsLoading(false);
    setInput("");
    adjustHeight(true);
  }
};
```

### 3. Add Environment Configuration

Update `.env.local` file:

```
NEXT_PUBLIC_LANGBASE_API_TOKEN=user_2kB9AgFdLs4XBU2yFhtyca1D99EjNqmXH1VBFvrYGRu5H1k1gCEdgTudNQBEKc2W1wWs5b6XETcwHLtfFjQ39nWm
```

Make sure to add this to `.gitignore` to avoid committing tokens:

```
.env.local
```

### 4. Update UI for Streaming Responses

Enhance the response display component to handle streaming content:

```typescript
// In components/agent.tsx, update the response display section

<AnimatePresence>
  {response && (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="backdrop-blur-2xl bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-center">
          <span className="text-xs font-medium text-white/90 mb-0.5">zap</span>
        </div>
        <h2 className="text-xl font-semibold text-white/90">Response</h2>
      </div>
      <Separator className="mb-4 bg-white/10" />
      <div className="text-white/80 whitespace-pre-line text-sm leading-relaxed">
        {response}
        {isLoading && <TypingDots />}
      </div>
    </motion.div>
  )}
</AnimatePresence>
```

### 5. Add Type Definitions

Create type definitions for the SDK interactions:

```typescript
// types/langbase.ts
export interface LangbaseAttachment {
  name: string;
  type: string;
  size: number;
}

export interface LangbaseRequest {
  input: string;
  attachments?: LangbaseAttachment[];
  framework?: "prometheus" | "daedalus";
  stream?: boolean;
  additionalInstructions?: string;
}

export interface LangbaseResponseChunk {
  choices: {
    delta: {
      content?: string;
    };
    index: number;
  }[];
}
```

### 6. Add Cancellation Support

Add the ability to cancel ongoing requests:

```typescript
// In components/agent.tsx

// Add a controller ref to the component
const abortControllerRef = useRef<AbortController | null>(null);

// Modify the handleSubmit function
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Cancel any existing request
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }
  
  // Create new controller
  abortControllerRef.current = new AbortController();
  
  // ...existing code...
  
  try {
    // Pass the signal to the SDK call
    const stream = await langbaseClient.chat.completions.create({
      // ...existing params...,
      signal: abortControllerRef.current.signal,
    });
    
    // ...existing streaming code...
  } catch (error: any) {
    // Check if this was an abortion
    if (error.name === 'AbortError') {
      console.log('Request was cancelled');
      return;
    }
    
    // ...existing error handling...
  }
};

// Add a cancel button to the UI
{isLoading && (
  <button
    onClick={() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        setIsLoading(false);
      }
    }}
    className="text-white/60 hover:text-white/90 transition-colors"
  >
    Cancel
  </button>
)}
```

## Testing Plan

1. **Unit Tests**:
   - Test SDK initialization
   - Test request formation
   - Test response handling

2. **Integration Tests**:
   - Test end-to-end message flow
   - Test error scenarios
   - Test streaming capabilities

3. **Performance Testing**:
   - Measure response time improvements
   - Test under load conditions
   - Compare memory usage

## Rollout Strategy

1. **Development Phase**:
   - Implement SDK integration
   - Add feature flag to toggle between HTTP and SDK methods
   - Comprehensive testing

2. **Staged Rollout**:
   - Enable for internal users first
   - Monitor performance metrics
   - Gather feedback

3. **Full Deployment**:
   - Switch all traffic to SDK implementation
   - Remove old HTTP implementation
   - Update documentation

## Success Metrics

- **Response Time**: Measure reduction in time-to-first-token and total response time
- **User Experience**: Improved perceived responsiveness through streaming
- **Error Rate**: Reduction in connection and timeout errors
- **Code Quality**: Improved type safety and maintainability

## Timeline

1. **Initial Setup**: 1 day
   - Install SDK
   - Create client singleton
   - Configure environment variables

2. **Core Implementation**: 2 days
   - Replace HTTP implementation with SDK
   - Add streaming response handling
   - Implement cancellation support

3. **Testing & Refinement**: 2 days
   - Unit and integration testing
   - Performance testing
   - Bug fixes and optimizations

4. **Documentation & Deployment**: 1 day
   - Update documentation
   - Staged rollout
   - Monitoring and feedback collection