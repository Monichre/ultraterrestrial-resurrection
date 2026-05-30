# CODEMAPS: Agent Capabilities & I/O

## 1. Agent Surface Boundaries
There are zero API surfaces, external integrations, or agent orchestration logic inside `apps/ufo-ui`. All real agent capabilities, routing, and tool bindings exist exclusively in `apps/app`.

## 2. Current Agent Routing & Logic
- **Tooling & Orchestration**: Agent interactions and external integrations are driven by `onSubmit` handlers, specialized hooks (e.g., `useMindMapAgent`), and backend routes (`/api/disclosure/mindmap`, `/api/prometheus/chat`) found within `apps/app`.
- **UI Wiring Gaps**: Currently, many of the agent calls in the imported v0 UI components (like suggestion chips inside `EmptyCanvas` or the `FloatingToolbar`) are decorative or only partially wired.

## 3. Merge Strategy for Agent I/O
- **Wiring the Surface**: The migrated `ufo-ui` chat interfaces (like `EnhancedAnimatedChat` and `MessageInput`) need to be fully hooked into the live agent state and SSE streams from `apps/app`.
- **Graph & Agent Sync**: The agent logic uses Zustand proxies and context to interact with the React Flow graph representation. The active agent state (like loading indicators, streaming text, and extracted records) must seamlessly dictate the UI state of the polished components ported from `apps/ufo-ui`, mutating the graph physically rather than just visually mocking it.