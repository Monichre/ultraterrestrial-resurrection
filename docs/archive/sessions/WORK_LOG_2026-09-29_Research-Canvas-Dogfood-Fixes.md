# Work Log — Research Canvas Dogfood Fixes

- **Date/Time:** 2026-09-28 – 2026-09-29, written 2026-09-29 12:12 CDT
- **Primary Agent:** Claude Code (Opus 5.5), session `87702915-a9e9-435e-bb7e-0ff4c9d4fed9`
- **Branch:** `dev`
- **Implementation Commit:** `90e6d478 fix(research-canvas): stop record cards covering the answer; fix Prometheus stream`
- **PR:** none. Nothing pushed.
- **Origin:** peer handoff items A–F from the `rag-ingestion-continued` session; item A was dogfooding `/research-canvas`.

## What now works (verified in the running app, dev server `:3002`, agent-browser)

| Area | Before | After | Proof |
|---|---|---|---|
| Canvas query | Server action 500, "NO CARRIER" | Answer renders | 2nd POST returned 200 after the embedding strip |
| Answer text | Raw JSON (`answer` / `analysis_summary` keys) | Prose | Visual check at 1440×900 |
| Record cards | Stacked on the answer node | Laid out below it; agent nodes above | 10 nodes, 9 edges, `overlappingPairs: 0` |
| Tour chips | Covered the input at 1280×577 | Sit above the input | chips y 447–487, input y 499–565 |
| Prometheus chat | "no text content", then raw `**` | Streams and renders markdown | 7 `<strong>`, 3 `<li>`, no raw `**` |
| Console | `getSmartEdge` error + SVG attribute warnings | Clean | fresh session + one query: 0 console errors |

## Changes (all in commit `90e6d478`)

- [`apps/app/src/services/ai/tools/research-search.ts`](apps/app/src/services/ai/tools/research-search.ts): strips the 1536-dim `embedding` from each database row before it rides the SSE stream and the canvas server action. The old 500's root cause was never directly confirmed; the 200 followed this change.
- [`apps/app/src/app/api/disclosure/mindmap/route.ts`](apps/app/src/app/api/disclosure/mindmap/route.ts): "Final answer format" instruction (plain prose, never JSON).
- [`apps/app/src/app/api/prometheus/chat/route.ts`](apps/app/src/app/api/prometheus/chat/route.ts): `stopWhen: stepCountIs(5)`; AI SDK 6 defaults to one step and ended on the tool call.
- [`apps/app/src/app/(site)/prometheus/agent.tsx`](apps/app/src/app/(site)/prometheus/agent.tsx): stream parser reads SSE `data:` parts (`delta`), buffers split lines, surfaces `error` parts; response rendered with `react-markdown` + `remark-gfm`. The shared `components/ui/markdown` imports a missing `./code-block` and does not build.
- [`apps/app/src/features/mindmap/actions/xata-to-xyflow.ts`](apps/app/src/features/mindmap/actions/xata-to-xyflow.ts): record nodes no longer set `parentId`; layout runs over source + existing + records in preserve mode, returns records only.
- [`apps/app/src/features/mindmap/layouts/organizeNodeLayout.ts`](apps/app/src/features/mindmap/layouts/organizeNodeLayout.ts): preserve mode compared nodes by reference (`includes`) and never positioned anything; now by id. Added `enhancedEntityNode` size 340×180.
- [`apps/app/src/features/mindmap/graph.tsx`](apps/app/src/features/mindmap/graph.tsx): `waitForStableMeasure` (size steady 3 frames, max 60) before placing nodes; agent nodes placed above the answer; chips passed into the empty state.
- [`apps/app/src/features/mindmap/research-canvas/EmptyCanvas.tsx`](apps/app/src/features/mindmap/research-canvas/EmptyCanvas.tsx), [`apps/app/src/features/mindmap/research-canvas/research-canvas-console.tsx`](apps/app/src/features/mindmap/research-canvas/research-canvas-console.tsx): new `chips` prop rendered in-flow above the input.
- [`apps/app/src/features/mindmap/edges/SiblingEdge.tsx`](apps/app/src/features/mindmap/edges/SiblingEdge.tsx): `getSmartEdge` returns (does not throw) an `Error`; treated as no path. Removed 4 per-render `console.log`s.
- [`apps/app/src/lib/ai/model-fallback.ts`](apps/app/src/lib/ai/model-fallback.ts), [`apps/app/src/features/mindmap/actions/enrich-hypothesis.ts`](apps/app/src/features/mindmap/actions/enrich-hypothesis.ts), [`apps/app/src/features/mindmap/actions/synthesize-investigation.ts`](apps/app/src/features/mindmap/actions/synthesize-investigation.ts): object timeouts 30s per tier (Merge GLM-5.3 tiers measured ~20s).
- 393 kebab-case SVG attributes renamed to camelCase across 15 components (icons, entity-icons, arrow-ui, footer, backgrounds, testimony-node, anchor, SuggestedSearchItem, SiblingEdge, mindmap-animated-click-menu, connection-card, ut-logo, StreamingText, engineer, RadarLayout). The iframe `srcDoc` HTML in `futuristic-lab-landing-and-dashboard-layout.tsx` was left as HTML.

## Outside the repo (not committed anywhere)

- Higgsfield preset skills unified in `~/.agents/skills/`: `hf-style-presets/registry.json` (8 slugs), `scripts/verify.py` read-only preflight (CLI, workspace, catalog id/name, host app, cost vs balance), 8 per-preset `SKILL.md` files rewritten to call it. Workspace "Private" selected.
- No generation run: a 1-minute explainer quotes ~183.6 credits against a 110 balance.

## Foreign changes deliberately left out of the commit

Seven files carry other sessions' uncommitted hunks. They were excluded line by line through a private git index; the shared index (another session's 1,849 staged renames) was not touched, and nothing was stashed.

- Mindmap route: Assistants → Responses API migration.
- Prometheus chat route: `vectorStores.search` rewrite of `searchUAP`.
- `graph.tsx`, `EmptyCanvas.tsx`, `research-canvas-console.tsx`: file-drop `onFileSelected` wiring.
- `model-fallback.ts`: Merge GLM-5.3 tiers (peer `rag-ingestion-continued`). The committed 30s timeout comment references them.
- `research-search.ts`: Exa `searchAndContents(query, …)` argument fix.

## Not verified / open

- The commit was not typechecked as an isolated snapshot; the running app included other sessions' uncommitted code. Repo-wide `tsc` count was 1,749 before and after the edits (pre-existing errors).
- The `organizeNodeLayout` id fix changes behaviour for its other preserve-mode callers (layout panel, saved views, user-input node, file drop). None checked in the browser.
- One canvas server action took 69s (dev log line 1059), consistent with both Merge tiers timing out; likely the "Deepening the reading" hypothesis call. Not investigated.
- Proposed but not adopted: an `AGENTS.md` rule letting agents commit their own verified hunks.
