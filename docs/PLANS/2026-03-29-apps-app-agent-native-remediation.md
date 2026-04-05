# Apps App Agent-Native Remediation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restore broken `apps/app` agent runtime paths first, then harden the app toward agent-native parity for graph actions, tours, notes, and shared session state.

**Architecture:** Phase 1 keeps the strongest working flows intact and only rewires stale clients to mounted routes. Phase 2 standardizes route contracts, breaks workflow-heavy tools into smaller primitives, exposes graph and tour mutations through shared server-backed paths, and moves browser-only research state toward a shared workspace.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Vercel AI SDK, OpenAI, Bun, ESLint, ad hoc Vitest, Xata-backed search via `@db`

---

> **Workspace note:** The current `dev` workspace already contains unrelated uncommitted changes. Keep edits tightly scoped to the files listed below. Do not commit unless the user explicitly asks for a commit and the staged diff has been reviewed for unrelated changes.
>
> **Validation note:** `apps/app/package.json` has `lint` and `build`, but no `test` script. Use targeted lint, a full app build, and manual smoke checks for Phase 1. If you add focused tests later, run them with `bunx vitest run <test-file>`.

## Phase 1 — Quick Wins

### Task 1: Rewire the active `/prometheus` page to the mounted route

**Files:**
- Modify: `apps/app/src/app/(site)/prometheus/agent.tsx`

**Step 1: Reproduce the current failure**

Run the app locally and submit a prompt from `/prometheus`.

Expected: the page tries to call `/api/agent` and fails because that route is not mounted.

**Step 2: Write the minimal fix**

Change the fetch target in `handleSubmit` from:

```ts
fetch('/api/agent', ...)
```

to:

```ts
fetch('/api/prometheus/chat', ...)
```

Do not change the existing `0:` stream parsing logic in this task.

**Step 3: Run targeted lint**

Run:

```bash
bun run --cwd "/Users/liamellis/Desktop/01_ACTIVE/ultraterrestrial-resurrection/apps/app" lint --file "src/app/(site)/prometheus/agent.tsx"
```

Expected: no new lint errors in the edited file.

**Step 4: Run a manual smoke check**

Run the app and verify:
- `/prometheus` accepts a prompt
- the response starts streaming
- no network request hits `/api/agent`

**Step 5: Record completion**

Note the edited file and keep the diff isolated. Do not commit yet.

### Task 2: Rewire the shared Prometheus component and file handler

**Files:**
- Modify: `apps/app/src/services/ai/agents/prometheus.tsx`
- Modify: `apps/app/src/services/ai/prometheus/lib/prometheus-file-handler.ts`

**Step 1: Reproduce the current failure paths**

Inspect the active fetch targets in both files and confirm they still point at `/api/chat`.

Expected: both paths target a non-mounted route.

**Step 2: Write the minimal fixes**

Change the fetch target in both files from:

```ts
fetch('/api/chat', ...)
```

to:

```ts
fetch('/api/prometheus/chat', ...)
```

Do not refactor request/response parsing in this task.

**Step 3: Run targeted lint**

Run:

```bash
bun run --cwd "/Users/liamellis/Desktop/01_ACTIVE/ultraterrestrial-resurrection/apps/app" lint --file "src/services/ai/agents/prometheus.tsx" --file "src/services/ai/prometheus/lib/prometheus-file-handler.ts"
```

Expected: no new lint errors in the edited files.

**Step 4: Run a focused manual smoke check**

Verify:
- the shared Prometheus component can submit a request
- file-processing requests now hit `/api/prometheus/chat`
- no request hits `/api/chat` from these two files

**Step 5: Record completion**

Keep the diff scoped to the two listed files. Do not commit yet.

### Task 3: Triage `useBackendChat` instead of rewiring it blindly

**Files:**
- Inspect: `apps/app/src/hooks/useBackendChat.ts`
- Search consumers under: `apps/app/src/**/*`

**Step 1: Confirm whether the hook is live**

Search for current imports/usages of `useBackendChat`.

Expected: if no active runtime consumers exist, treat it as dormant.

**Step 2: Make the smallest safe decision**

If the hook is unused:
- leave it untouched in Phase 1
- note in the implementation log that it still expects `/api/chat` and a different stream contract

If the hook is actively used:
- stop and add a dedicated follow-up task before modifying it, because it expects socket/SSE semantics that do not match `toDataStreamResponse()`

**Step 3: Validate the decision**

If unchanged, ensure no Phase 1 route rewiring accidentally depends on this hook.

### Task 4: Validate the full Phase 1 route rewire

**Files:**
- Re-check: `apps/app/src/app/(site)/prometheus/agent.tsx`
- Re-check: `apps/app/src/services/ai/agents/prometheus.tsx`
- Re-check: `apps/app/src/services/ai/prometheus/lib/prometheus-file-handler.ts`

**Step 1: Run a full app build**

Run:

```bash
bun run --cwd "/Users/liamellis/Desktop/01_ACTIVE/ultraterrestrial-resurrection/apps/app" build
```

Expected: build succeeds without introducing new type or route errors from the rewired files.

**Step 2: Run one final manual smoke pass**

Verify:
- `/prometheus` streams successfully
- file processing no longer calls stale endpoints
- research-canvas and disclosure flows still use their existing routes and remain unaffected

**Step 3: Record Phase 1 results**

Capture:
- edited files
- commands run
- any unresolved issues deferred to Phase 2

## Phase 2 — Foundational Cleanup

### Task 5: Normalize active chat route ownership

**Files:**
- Modify: `apps/app/src/app/api/prometheus/chat/route.ts`
- Modify: `apps/app/src/app/api/disclosure/chat/route.ts`
- Modify: `apps/app/src/app/api/disclosure/mindmap/route.ts`
- Optional add: `apps/app/src/app/api/chat/route.ts`

**Step 1: Decide the canonical route contract**

Pick one primary runtime contract for app-facing AI chat.

**Step 2: Add the thinnest migration layer**

If legacy compatibility is needed, add a thin alias/facade route rather than duplicating logic.

**Step 3: Validate**

Run targeted lint on the edited routes and a full app build.

### Task 6: Split workflow-heavy Prometheus tools into smaller primitives

**Files:**
- Modify: `apps/app/src/app/api/prometheus/chat/route.ts`

**Step 1: Replace `processDocument` with narrower tools**

Break the single dispatcher into primitives such as:
- `summarizeDocument`
- `extractDocumentTopics`
- `analyzeDocumentSentiment`
- `findDocumentConnections`
- `discoverDocumentInsights`
- `generateDocumentTags`

**Step 2: Keep the UI behavior stable**

Map existing UI actions onto the new tool names without changing the visible affordances.

**Step 3: Validate**

Run targeted lint, then smoke-test each document action from the UI.

### Task 7: Add graph-write parity for the agent

**Files:**
- Modify: `apps/app/src/features/mindmap/graph.tsx`
- Modify: `apps/app/src/contexts/mindmap/mindmap-context.tsx`
- Add: `apps/app/src/features/mindmap/actions/graph-mutations.ts`
- Modify: `apps/app/src/app/api/disclosure/mindmap/route.ts`

**Step 1: Extract server-backed graph mutation primitives**

Add narrow actions for:
- add node(s)
- add connection(s)
- update node data
- remove node(s)

**Step 2: Expose those primitives to the agent**

Register them through the active mindmap route instead of keeping them UI-only.

**Step 3: Validate**

Smoke-test:
- adding connected records from the panel
- adding agent-generated nodes
- preserving the existing graph layout behavior

### Task 8: Wire tours into the live agent path

**Files:**
- Modify: `apps/app/src/features/mindmap/graph.tsx`
- Modify: `apps/app/src/features/mindmap/store/mindmap-ui-store.ts`
- Modify: `apps/app/src/app/api/disclosure/mindmap/route.ts`
- Modify: `apps/app/src/features/mindmap/tours/tools/tour-tools-implementation.ts`

**Step 1: Connect the graph “Start Tour” action to the real tour flow**

Stop treating it as UI-local state only.

**Step 2: Register the existing tour tools in the live route**

Expose tour navigation through the active mindmap agent path.

**Step 3: Validate**

Smoke-test:
- start tour from graph UI
- advance tour from the agent
- confirm both surfaces share visible state

### Task 9: Move session, note, and research state toward a shared workspace

**Files:**
- Add: `apps/app/src/app/api/sessions/route.ts`
- Modify: `apps/app/src/contexts/mindmap/session-notes-context.tsx`
- Modify: `apps/app/src/features/mindmap/components/menus/mindmap-bottom-menu/mindmap-bottom-menu.tsx`
- Modify: `apps/app/src/features/mindmap/store/mindmap-ui-store.ts`

**Step 1: Define the minimal shared session shape**

Include:
- chat history metadata
- active tour state
- pinned or persisted notes
- graph/session identifiers

**Step 2: Persist only what Phase 2 needs**

Do not migrate every browser-local preference at once.

**Step 3: Validate**

Smoke-test reloading or resuming a research session and confirm the agent sees the same session context.

### Task 10: Replace local-only incident datasets with shared query/detail primitives

**Files:**
- Modify: `apps/app/src/features/mindmap/research-canvas/views/ufo-sightings/page.tsx`
- Modify: `apps/app/src/features/mindmap/research-canvas/views/content-card-detail-view/page.tsx`
- Modify: `apps/app/src/features/mindmap/research-canvas/views/search-and-discovery-interface/page.tsx`

**Step 1: Move dataset access behind shared app routes or server actions**

Replace local/static-only lookups with shared query/detail fetches.

**Step 2: Keep current UX affordances**

Do not regress the discovery-heavy UI while changing the data source.

**Step 3: Validate**

Confirm the agent and the UI can retrieve the same incident/detail records.

### Task 11: Standardize context injection and prompt ownership

**Files:**
- Modify: `apps/app/src/features/mindmap/hooks/use-mindmap-agent.ts`
- Modify: `apps/app/src/app/api/prometheus/chat/route.ts`
- Modify: `apps/app/src/app/api/disclosure/chat/route.ts`
- Modify: `apps/app/src/app/api/disclosure/mindmap/route.ts`
- Modify as needed: `apps/app/src/services/ai/prompts/*`

**Step 1: Define one typed app context envelope**

Include only the state that materially improves the agent:
- selected resources
- session history
- graph state snapshot
- recent activity
- user-level research mode flags

**Step 2: Reuse the same envelope across active routes**

Avoid route-specific ad hoc prompt stitching where possible.

**Step 3: Validate**

Smoke-test the same query across Prometheus and disclosure flows and confirm they receive consistent app context.

## Recommended Execution Order

1. Complete Task 1.
2. Complete Task 2.
3. Complete Task 3.
4. Complete Task 4.
5. Pause and review the Phase 1 diff.
6. Complete Task 5.
7. Complete Task 6.
8. Complete Tasks 7 and 8 together if the route contract is stable.
9. Complete Task 9.
10. Complete Tasks 10 and 11.

## Success Criteria

- `/prometheus` no longer calls stale routes
- active Prometheus file processing no longer calls `/api/chat`
- no Phase 1 change regresses the working disclosure or mindmap paths
- Phase 2 exposes graph and tour actions through the same runtime surface the user already uses
- shared session context begins to move out of browser-only storage
