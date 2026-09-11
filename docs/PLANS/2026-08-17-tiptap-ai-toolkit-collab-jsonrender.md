---
status: draft
role: eng
spine: plan
updated: 2026-08-17
todo: T-053
phase: spec
---

# Integration Spec: Tiptap AI Toolkit + Collaboration + json-render

**Related:** [`2026-08-09-research-canvas-genui.md`](2026-08-09-research-canvas-genui.md) · [`2026-08-10-rc-p0-tool-cards.md`](2026-08-10-rc-p0-tool-cards.md) · T-053 / DMGD-219

**This doc:** evaluation + phased implementation plan for three integration tracks:
1. **Tiptap AI Toolkit** — AI-assisted editing in BlockEditor notes
2. **Tiptap Collaboration** — realtime multi-user editing via Hocuspocus
3. **json-render** — structured AI output rendering in chat + canvas surfaces

---

## Verdict

**All three are go, sequenced.** The repo is already a Tiptap shop (v3.4.4, ~30 extensions, BlockEditor live in the mindmap feature) and already uses the Vercel AI SDK. The dominant cost is the collaboration backend (new WebSocket service + persistence). json-render is the lowest-lift, highest-immediate-value track because the chat and canvas surfaces currently render AI tool output as ephemeral pills or plain text.

**Total lift: ~12–18 days** across all three tracks.

---

## Track A — Tiptap AI Toolkit

### Requirements vs. current state

| Requirement | Have? | Gap |
|---|---|---|
| Tiptap `>=3.12.0` | No (`3.4.4`) | Upgrade all `@tiptap/*` packages |
| `@tiptap/ai-toolkit` (server, OSS) | No | `pnpm add @tiptap/ai-toolkit` |
| `@tiptap-pro/client-ai-toolkit` (paid) | No | Tiptap subscription + private registry |
| `@tiptap-pro/client-ai-toolkit-ai-sdk` | No | Same; adapter for Vercel AI SDK already in repo |
| Tiptap Cloud account + ES256 keypair | No | Account/contract work; env vars `TIPTAP_PRIVATE_KEY`, `TIPTAP_ENVIRONMENT_ID` |
| `ServerAiToolkit` + `AiToolkit` extensions | No | Add to [`extension-kit.ts`](apps/app/src/features/mindmap/components/note/extensions/extension-kit.ts) |
| `getEditorContext(editor)` server route | No | New route at `apps/app/src/app/api/tiptap/ai-toolkit/route.ts` |
| JWT token generation (`createJwtToken`) | No | ES256 signing in server route |
| AI provider integration | **Yes** — `ai@^6.0.42` `streamText` | Reuse; wire into `client-ai-toolkit-ai-sdk` |
| Custom nodes with `addJsonSchemaAwareness` | No | Add to SlashCommand, ImageBlock, Columns, etc. |
| Zod | **Yes** (Vercel AI SDK dep) | Verify direct dep |

### What AI Toolkit gives us

- **`ServerAiToolkit`** extension modifies editor schema for AI Toolkit compatibility
- **`getEditorContext(editor)`** generates a JSON-serializable object describing the document structure for AI model consumption — cacheable in Postgres
- **`AiToolkit`** client extension provides `executeTool({ toolName, input })` for in-browser tool execution
- **Tool definitions** for `tiptapRead`, `tiptapEdit`, `tiptapReadSelection`, `getThreads`, `editThreads`
- **`proofread`** built-in workflow
- **Tiptap Shorthand** (alpha) — token-efficient document encoding (up to 80% token reduction)
- **`AiInsertReveal`** — fades in AI-streamed text in collaborative documents
- **Custom node AI awareness** via `addJsonSchemaAwareness()` using Zod schemas

### Key files to touch

- [`apps/app/src/features/mindmap/components/note/hooks/useBlockEditor.ts`](apps/app/src/features/mindmap/components/note/hooks/useBlockEditor.ts) — add `ServerAiToolkit` + `AiToolkit` to extensions
- [`apps/app/src/features/mindmap/components/note/extensions/extension-kit.ts`](apps/app/src/features/mindmap/components/note/extensions/extension-kit.ts) — register AI Toolkit extensions
- [`apps/app/src/features/mindmap/components/note/extensions/index.ts`](apps/app/src/features/mindmap/components/note/extensions/index.ts) — add `addJsonSchemaAwareness` to custom nodes
- [`apps/app/src/services/ai/openai/sse.ts`](apps/app/src/services/ai/openai/sse.ts) — reuse SSE bridge pattern for AI Toolkit streaming
- New: `apps/app/src/app/api/tiptap/ai-toolkit/route.ts` — JWT generation + editor context + tool proxy

### Pricing

- Server package (`@tiptap/ai-toolkit`): **OSS, MIT**
- Client package (`@tiptap-pro/client-ai-toolkit`): **paid, requires Tiptap subscription + AI Toolkit add-on**
- Free tier: 100 licenses, 100k tool executions/month (launch promotion)
- Contact sales for pricing beyond free tier

### Risks

1. **Version jump 3.4.4 → 3.12.0+** — 8 minor versions of churn; `StarterKit` and `@tiptap/extensions` may have breaking changes
2. **`@tiptap-pro/extension-collaboration-cursor` → `@tiptap/extension-collaboration-caret`** — renamed package
3. **Tiptap Cloud dependency** — Server AI Toolkit requires Tiptap Cloud or on-prem deployment; unclear what on-prem entails
4. **Tiptap Shorthand is alpha** — may change or break
5. **Private registry setup** — `.npmrc` configuration for `@tiptap-pro/*` packages

---

## Track B — Tiptap Collaboration

### Requirements vs. current state

| Requirement | Have? | Gap |
|---|---|---|
| `yjs` | Yes (transitive) | Verify direct dep |
| `@tiptap/extension-collaboration` | Yes (`^3.3.0`) | Bump to `3.12.0+` |
| `@tiptap/extension-collaboration-cursor` | Yes (`^2.26.1`) | **Major mismatch** — replace with `@tiptap/extension-collaboration-caret` `3.12.0+` |
| `@hocuspocus/provider` | Imported | Confirm in `package.json` |
| Hocuspocus WebSocket server | **No** | New service: standalone Node process |
| Yjs persistence | **No** | New Postgres table + `@hocuspocus/extension-database` |
| Room model | **No** | Decide: one room per note? per canvas session? |
| Auth token into provider | **No** | Clerk session → JWT → Hocuspocus `onAuthenticate` |
| Awareness user object | Partial (Clerk user) | Map Clerk user → `{ name, color }` |
| `CollaborationCaret` CSS | No | Add caret label CSS |
| Next.js SSR guard | Partial (`immediatelyRender: false` set) | Ensure provider init in `useEffect` only |

### Current wiring (dead code)

[`useBlockEditor.ts`](apps/app/src/features/mindmap/components/note/hooks/useBlockEditor.ts) already imports `TiptapCollabProvider` from `@hocuspocus/provider` and conditionally adds `Collaboration` + `CollaborationCursor` extensions. But there is no Hocuspocus server, no Yjs persistence table, and no room model. The collaboration wiring is inert.

### Self-hosted Hocuspocus vs. Tiptap Collaboration Cloud

| Dimension | Self-hosted Hocuspocus | Tiptap Collaboration Cloud |
|---|---|---|
| License | MIT, free | Paid ($49–$999+/mo) |
| Backend to build | Yes — WS server + DB extension | No — managed |
| Persistence | Own Neon Postgres | Tiptap's cloud |
| Auth | Clerk → custom JWT → `onAuthenticate` | Clerk → JWT signed with Tiptap ES256 key |
| Operational burden | High | Low |
| Data residency | Own infra | Tiptap Cloud (FRA1) |
| Lock-in | Low | Medium |

**Recommendation:** Self-hosted Hocuspocus. The repo already has Neon Postgres and a Turborepo workspace. A `packages/collab` or `apps/collab-server` package fits cleanly. Revisit Cloud if operational burden grows.

### Proposed persistence schema

```sql
CREATE TABLE collab_documents (
  room_id      text PRIMARY KEY,
  ydoc_state   bytea NOT NULL,
  version      integer NOT NULL DEFAULT 1,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
```

### Key files to touch

- New: `apps/collab-server/` or `packages/collab/` — Hocuspocus `Server` on dedicated port
- New: `@hocuspocus/extension-database` wired to Neon Postgres
- [`packages/db/src/postgres/`](packages/db/src/postgres/) — add `collab_documents` table + migration
- [`apps/app/src/middleware.ts`](apps/app/src/middleware.ts) — Clerk auth bridge for Hocuspocus
- [`apps/app/src/features/mindmap/components/note/hooks/useBlockEditor.ts`](apps/app/src/features/mindmap/components/note/hooks/useBlockEditor.ts) — wire `HocuspocusProvider` to real server URL
- [`apps/app/src/features/mindmap/components/note/BlockEditor/BlockEditor.tsx`](apps/app/src/features/mindmap/components/note/BlockEditor/BlockEditor.tsx) — add `CollaborationCaret` CSS

### Risks

1. **WebSocket lifecycle in Next.js app router** — provider must init in `useEffect`, cleanup on unmount
2. **`@hocuspocus/server` v4 requires Node.js 22+** — verify deployment target Node version
3. **Yjs document migration** — if notes currently store content as plain HTML/JSON, need migration to Yjs format
4. **Room model decision** — one room per note? per canvas session? per user workspace? Determines `collab_documents` schema and provider `name` argument
5. **Deployment target** — WebSocket needs a long-lived process, not a Next.js API route

---

## Track C — json-render for structured AI output

### Why json-render

Today, all AI output in the app is rendered as plain text or ephemeral status pills:

| Surface | Current rendering | File |
|---|---|---|
| Prometheus Chat | Plain text streaming, tool results ignored | [`agent.tsx`](apps/app/src/app/(site)/prometheus/agent.tsx) lines 314–344 |
| Research Canvas Console | Processing-only pills for 2 tool types | [`EnhancedAnimatedChat.tsx`](apps/app/src/features/mindmap/research-canvas/EnhancedAnimatedChat.tsx) lines 283–296 |
| Mindmap Agent | Plain text + `AgentToolEvent[]` array | [`use-mindmap-agent.ts`](apps/app/src/features/mindmap/hooks/use-mindmap-agent.ts) |

json-render replaces this with **AI-generated structured UI** — the model outputs a JSON spec that renders as native React components from a developer-defined catalog. No arbitrary code execution, Zod-validated, streaming via JSONL patches.

### What json-render provides

- **`@json-render/core`** (v0.19.0, Apache-2.0) — schemas, catalogs, SpecStream utilities
- **`@json-render/react`** (v0.19.0) — React renderer, `Renderer` component, `JSONUIProvider`, `useUIStream`, `useJsonRenderMessage`
- **`@json-render/shadcn`** — 36 pre-built shadcn/ui components (Card, Stack, Grid, Button, Input, etc.)
- **`@json-render/react-pdf`** — PDF generation from specs (invoice/report/document templates)
- **`@json-render/mcp`** — MCP server integration for serving interactive UIs in Claude/ChatGPT/Cursor
- **SpecStream** — JSONL-based streaming with RFC 6902 JSON Patch operations (add/remove/replace/move/copy/test)

### Rendering model

json-render uses a flat element tree:

```json
{
  "root": "card-1",
  "elements": {
    "card-1": {
      "type": "EntityCard",
      "props": { "entityId": "evt-001", "entityType": "events" },
      "children": ["summary-1"]
    },
    "summary-1": {
      "type": "Text",
      "props": { "content": "Roswell incident, July 1947" },
      "children": []
    }
  }
}
```

Components are registered via `defineCatalog` (server-side, Zod-validated) + `defineRegistry` (client-side, React implementations).

### Two integration modes

1. **Inline mode** (chat interfaces) — AI responds conversationally, then outputs JSONL patches inline. Use `useJsonRenderMessage(message.parts)` on the client + `pipeJsonRender` on the server.

2. **Standalone mode** (canvas/dashboards) — AI outputs only JSONL patches. Use `useUIStream({ api: "/api/generate" })`.

### Proposed domain component catalog

Map the existing entity card components into a json-render catalog:

| Catalog component | Maps to | Zod props |
|---|---|---|
| `EntityCard` | [`render-entity-card.tsx`](apps/app/src/features/mindmap/components/cards/render-entity-card.tsx) | `{ entityId: string, entityType: SupportedEntityType }` |
| `PersonnelCard` | `SubjectMatterExpertCard` | `{ id, name, role, credibility }` |
| `EventCard` | `EventCard` | `{ id, name, date, location, summary }` |
| `DocumentCard` | `GraphCard` (documents variant) | `{ id, title, summary, sourceType, sourceTier }` |
| `TestimonyCard` | `TestimonyCard` | `{ id, title, witness, date, event }` |
| `OrganizationCard` | `GraphCard` (orgs variant) | `{ id, name, specialization }` |
| `TopicCard` | `TopicCard` | `{ id, name, summary }` |
| `ToolResultCard` | New (RC-P0 ToolCard) | `{ tool, status, parameters, result, error }` |
| `EvidenceBadge` | New | `{ state: EvidentiaryState }` |
| `CitationList` | New | `{ sources: Array<{ id, title, url }> }` |
| `ConnectionGraph` | New (mini React Flow) | `{ nodes, edges }` |
| `Text` | shadcn Text | `{ content: string }` |
| `Card` | shadcn Card | `{ title, description }` |
| `Stack` | shadcn Stack | `{ gap, children }` |

### Key files to touch

- New: `apps/app/src/features/json-render/catalog.ts` — domain catalog with Zod schemas
- New: `apps/app/src/features/json-render/registry.tsx` — React component implementations
- New: `apps/app/src/features/json-render/providers.tsx` — `JSONUIProvider` wrapper
- [`apps/app/src/app/(site)/prometheus/agent.tsx`](apps/app/src/app/(site)/prometheus/agent.tsx) — replace plain text rendering with `useJsonRenderMessage` + `Renderer`
- [`apps/app/src/features/mindmap/research-canvas/EnhancedAnimatedChat.tsx`](apps/app/src/features/mindmap/research-canvas/EnhancedAnimatedChat.tsx) — replace pills with `Renderer` for tool events
- [`apps/app/src/app/api/prometheus/chat/route.ts`](apps/app/src/app/api/prometheus/chat/route.ts) — add `pipeJsonRender` to streamText output
- [`apps/app/src/app/api/disclosure/mindmap/route.ts`](apps/app/src/app/api/disclosure/mindmap/route.ts) — add json-render spec to SSE bridge output

### MCP integration (future)

The `@json-render/mcp` package lets us expose a `render-ui` tool to external AI agents (Claude, ChatGPT, Cursor). The agent generates a spec constrained to our catalog, and the host renders it. This is the bridge between T-053 (Research Canvas Gen-UI) and external agent surfaces.

Pattern from the [MCP example](https://github.com/vercel-labs/json-render/tree/main/examples/mcp):

```typescript
import { createMcpApp } from "@json-render/mcp"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { catalog } from "./src/catalog.js"

const server = await createMcpApp({
  name: "Ultraterrestrial Research UI",
  version: "1.0.0",
  catalog,
  html: loadHtml(), // Vite-bundled single-file React app
})
await server.connect(new StdioServerTransport())
```

### PDF report generation

`@json-render/react-pdf` enables AI-generated PDF reports from the same catalog system. Use cases:
- Dossier generation (RC-P3: [`2026-08-09-research-canvas-genui.md`](2026-08-09-research-canvas-genui.md))
- Evidence summaries with citations
- Entity profiles with photos, metadata, relationships

Server-side render functions: `renderToBuffer`, `renderToStream`, `renderToFile`.

### Pricing

- All json-render packages: **Apache-2.0, free**
- No commercial licensing
- No per-seat or per-document fees

### Risks

1. **Pre-1.0** (v0.19.0, ~4 months old) — API may change
2. **React 19 required** — repo is on React 19.2.0, so this is satisfied
3. **Zod 4 required** — verify repo Zod version (Vercel AI SDK may pin Zod 3)
4. **Bundle size** — `@json-render/core` is 893KB unpacked; `@json-render/react` is 482KB; shadcn adds 36 components
5. **Catalog/registry dual-file pattern** — server-side catalog (Zod) and client-side registry (React) must stay in sync
6. **MCP Apps protocol maturity** — relatively new extension to MCP

---

## Phased plan

### Phase 0 — Dependency hygiene (~0.5 day)

1. Add missing `@tiptap-pro/*` packages to `apps/app/package.json` (`extension-ai`, `extension-emoji`, `extension-table-of-contents`, `extension-file-handler`)
2. Configure `.npmrc` for `@tiptap-pro` private registry
3. Verify `zod` direct dep version (Zod 3 vs 4 — json-render needs 4+)
4. `pnpm add @json-render/core @json-render/react @json-render/shadcn`

### Phase 1 — Tiptap 3.4 → 3.12+ upgrade (~1–2 days)

1. Bump all `@tiptap/*` from `3.4.4` → `3.12.0+` in `apps/app/package.json`
2. Replace `@tiptap/extension-collaboration-cursor` with `@tiptap/extension-collaboration-caret`
3. Run BlockEditor smoke test — fix breaking changes from 8-minor jump
4. Verify all custom extensions in [`extension-kit.ts`](apps/app/src/features/mindmap/components/note/extensions/extension-kit.ts) still load

### Phase 2 — json-render catalog + registry (~2–3 days)

1. Create `apps/app/src/features/json-render/catalog.ts` with domain component definitions (EntityCard, ToolResultCard, EvidenceBadge, CitationList, etc.)
2. Create `apps/app/src/features/json-render/registry.tsx` mapping catalog types to existing entity card components
3. Create `apps/app/src/features/json-render/providers.tsx` with `JSONUIProvider` wrapper
4. Add `@json-render/shadcn` components to registry for layout primitives (Card, Stack, Text, Grid)

### Phase 3 — Wire json-render into Prometheus Chat (~1–2 days)

1. Add `pipeJsonRender` to [`prometheus/chat/route.ts`](apps/app/src/app/api/prometheus/chat/route.ts) `streamText` output
2. Replace plain text rendering in [`agent.tsx`](apps/app/src/app/(site)/prometheus/agent.tsx) lines 314–344 with `useJsonRenderMessage` + `Renderer`
3. Add system prompt instructions for json-render inline mode
4. Test: ask Prometheus "tell me about Roswell" → should render EntityCard + Text instead of plain text

### Phase 4 — Wire json-render into Research Canvas Console (~1–2 days)

1. Add `pipeJsonRender` to [`disclosure/mindmap/route.ts`](apps/app/src/app/api/disclosure/mindmap/route.ts) SSE bridge output
2. Replace pills in [`EnhancedAnimatedChat.tsx`](apps/app/src/features/mindmap/research-canvas/EnhancedAnimatedChat.tsx) lines 283–296 with `Renderer` for tool events
3. Map `AgentToolEvent` → json-render `ToolResultCard` component
4. This supersedes the RC-P0 ToolCard plan — json-render ToolResultCard IS the ToolCard

### Phase 5 — Collaboration backend (~3–5 days)

1. Create `apps/collab-server/` package — Hocuspocus `Server` on dedicated port
2. Add `@hocuspocus/extension-database` wired to Neon Postgres
3. Create `collab_documents` table migration in [`packages/db/`](packages/db/)
4. Implement `onAuthenticate` hook: verify Clerk session token → return user
5. Implement `onStoreDocument` / `onLoadDocument`: serialize/deserialize `Y.Doc` ↔ `bytea`
6. Wire `HocuspocusProvider` in [`useBlockEditor.ts`](apps/app/src/features/mindmap/components/note/hooks/useBlockEditor.ts) to real server URL
7. Add `CollaborationCaret` CSS
8. Deploy collab-server as standalone Node process

### Phase 6 — AI Toolkit server + client (~2–3 days)

1. `pnpm add @tiptap/ai-toolkit @tiptap-pro/client-ai-toolkit @tiptap-pro/client-ai-toolkit-ai-sdk`
2. Add `ServerAiToolkit` + `AiToolkit` to [`extension-kit.ts`](apps/app/src/features/mindmap/components/note/extensions/extension-kit.ts)
3. Create `apps/app/src/app/api/tiptap/ai-toolkit/route.ts` — JWT generation + editor context + tool proxy
4. Cache `editorContext` in Postgres keyed by schema version
5. Wire `executeTool` on client to call new route
6. Reuse `createSSEBridge` pattern from [`sse.ts`](apps/app/src/services/ai/openai/sse.ts) for streaming

### Phase 7 — Custom node AI awareness (~0.5–1 day)

1. Add `addJsonSchemaAwareness` to custom nodes: SlashCommand, ImageBlock, Columns, Column, Selection, TrailingNode
2. Add Zod schemas for each node's attributes
3. Test that `getEditorContext` includes custom node metadata

### Phase 8 — PDF report generation (~1–2 days, optional)

1. `pnpm add @json-render/react-pdf`
2. Create PDF catalog with standard component definitions + custom domain components
3. Add server route `apps/app/src/app/api/reports/generate/route.ts` using `renderToBuffer`
4. Wire into Dossier/SynthesisPanel (RC-P3)

### Phase 9 — MCP server for external agents (~1–2 days, optional)

1. `pnpm add @json-render/mcp`
2. Create MCP server exposing `render-ui` tool with domain catalog
3. Bundle React app as single-file HTML via `vite-plugin-singlefile`
4. Deploy as stdio or HTTP MCP server

---

## Lift summary

| Phase | Effort | Risk | Blocked by |
|---|---|---|---|
| 0 — Dependency hygiene | ~0.5 day | Low | Tiptap Pro registry access |
| 1 — Tiptap 3.4→3.12 upgrade | ~1–2 days | Medium (8-minor jump) | Phase 0 |
| 2 — json-render catalog + registry | ~2–3 days | Low | Phase 0 |
| 3 — json-render in Prometheus Chat | ~1–2 days | Low | Phase 2 |
| 4 — json-render in Research Canvas | ~1–2 days | Low | Phase 2 |
| 5 — Collaboration backend | ~3–5 days | High (new WS service) | Phase 1 |
| 6 — AI Toolkit server + client | ~2–3 days | Medium (Tiptap Cloud) | Phase 1, Tiptap Cloud account |
| 7 — Custom node AI awareness | ~0.5–1 day | Low | Phase 6 |
| 8 — PDF report generation | ~1–2 days | Low | Phase 2 |
| 9 — MCP server | ~1–2 days | Medium (MCP maturity) | Phase 2 |
| **Total (Phases 0–7)** | **~12–18 days** | | |
| **With 8–9** | **~14–22 days** | | |

---

## Hard blockers (require human decisions)

1. **Tiptap Cloud account + AI Toolkit add-on** — client AI Toolkit is paid. Without subscription, Phases 6–7 cannot start.
2. **Tiptap Pro registry credentials** — needed for `.npmrc` to resolve `@tiptap-pro/*`. Repo already imports pro extensions not in `package.json`.
3. **Room model decision** — one room per note? per canvas session? per user workspace? Determines `collab_documents` schema.
4. **Collaboration server deployment target** — standalone Node process on separate port? Fly.io? Railway? Same VPS? WebSocket needs long-lived process.
5. **Tiptap 3.4 → 3.12 upgrade appetite** — 8 minor versions may introduce breaking changes. Needs smoke-test pass.
6. ~~**Zod version** — json-render requires Zod 4+.~~ **Resolved:** `apps/app/package.json` has `zod@^4.3.5`.
7. **`@hocuspocus/provider` not in package.json** — imported in [`useBlockEditor.ts`](apps/app/src/features/mindmap/components/note/hooks/useBlockEditor.ts) but not declared. Must add before collaboration wiring works.
8. **`@tiptap-pro/*` packages not in package.json** — `extension-ai`, `extension-emoji`, `extension-table-of-contents`, `extension-file-handler` are imported but not declared. Must add + configure private registry.
9. **`@xata.io/client` still in package.json** — retired per AGENTS.md but still listed. Should be removed.
10. **`@assistant-ui/react` + `@assistant-ui/react-ai-sdk` installed** — a second chat UI framework exists alongside the custom Prometheus chat. Decide: consolidate or keep separate?
11. **`tldraw` installed** — a third canvas surface beyond React Flow and Spacetime Canvas. May overlap with json-render for structured output.
12. **`@liveblocks/react` + `partysocket` installed but unused** — alternative realtime infra to Hocuspocus. Decide: use Liveblocks instead of self-hosting Hocuspocus?

---

## What's reusable (lowering lift)

- **Vercel AI SDK** (`ai@^6`) — directly compatible with `@tiptap-pro/client-ai-toolkit-ai-sdk` and `pipeJsonRender`
- **`createSSEBridge`** — pattern reusable for AI Toolkit streaming route
- **`useBlockEditor` hook** — already has provider/collaboration/AI wiring shape; needs version bumps, not rewrite
- **`ExtensionKit`** — clean extension registry; adding `ServerAiToolkit` / `AiToolkit` is additive
- **Clerk** — user identity ready for awareness + Hocuspocus auth
- **Neon Postgres** — ready for `@hocuspocus/extension-database` persistence
- **Existing entity cards** (`SubjectMatterExpertCard`, `EventCard`, `TestimonyCard`, `TopicCard`, `GraphCard`) — map directly to json-render registry components
- **`AgentToolEvent` type** — already structured; maps to json-render `ToolResultCard`

---

## Relationship to existing tickets

| Ticket | Status | Relationship |
|---|---|---|
| T-053 (DMGD-219) | Open | json-render Phases 2–4 **supersede** RC-P0 ToolCard plan — json-render `ToolResultCard` IS the ToolCard |
| T-060 | In Progress | Drop-to-Canvas could output json-render specs for artifact cards |
| T-047 | Backlog | Spacetime Canvas could consume json-render for event detail panels |

---

## Recommended sequencing

**If collaboration is not immediately needed:**

Phases 0 → 1 → 2 → 3 → 4 → 6 → 7 → (5 later) → (8, 9 optional)

This delivers json-render structured rendering in chat + canvas first (highest user-visible value), then AI Toolkit for notes, then collaboration backend last.

**If collaboration is needed first:**

Phases 0 → 1 → 5 → 6 → 7 → 2 → 3 → 4 → (8, 9 optional)

This delivers the collaboration backend before AI Toolkit, since AI Toolkit's collaborative features (tracked changes, comments, `AiInsertReveal`) depend on collaboration being live.

---

## Sources

- [Tiptap AI Toolkit overview](https://tiptap.dev/docs/ai/ai-toolkit/overview)
- [Tiptap AI Toolkit install](https://tiptap.dev/docs/ai/ai-toolkit/install)
- [Tiptap AI Toolkit custom nodes](https://tiptap.dev/docs/ai/ai-toolkit/advanced-guides/custom-nodes)
- [Tiptap Collaboration install](https://tiptap.dev/docs/collaboration/getting-started/install)
- [json-render.dev](https://json-render.dev/)
- [json-render react-pdf demo](https://react-pdf-demo.json-render.dev/)
- [json-render GitHub](https://github.com/vercel-labs/json-render)
- [json-render MCP example](https://github.com/vercel-labs/json-render/tree/main/examples/mcp)
