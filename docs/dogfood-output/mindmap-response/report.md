# Dogfood Report — Research Canvas Node Connection UI

**Date:** 2026-07-09
**Target:** http://localhost:3000/research-canvas
**Scope:** Node connection UI ("there's no connecting UI for nodes") — handle visibility, drag-to-connect, edge creation
**Tester:** Claude Code (Fable 5), chrome-devtools MCP
**Branch:** dev

## Executive Summary

The reported issue was real and had **three stacked root causes**. All three were fixed during this session and verified live in the browser: every record node now shows visible connection terminals, drag-to-connect creates an edge through the existing store wiring, and the provenance rule (dashed = unasserted/AI, solid = researcher assertion) is enforced on the new interaction.

| Severity | Count | Fixed this session |
|----------|-------|--------------------|
| Critical | 1 (no way to connect nodes at all) | ✅ |
| High | 1 (handles unreachable under card body) | ✅ |
| Medium | 2 (user edge rendered dashed; console DOM-prop errors) | 1 ✅ / 1 logged |
| Low | 1 (preload warning) | logged |

## Root-Cause Findings

### Issue 1 — No source handles on any live record node (Critical, Functional) ✅ fixed
- **Where:** `entity-node.tsx`, `testimony-node.tsx`, `document-node.tsx`, `enhanced-node-poc.tsx`
- **Cause:** Source handles were rendered only when `data.handles` was populated — and no live add-path (`use-add-record-node.ts`, used by the guided tour, suggestions dock, and search) ever sets it. `DocumentNode` had **no** handles at all (commented out); `EnhancedEntityNodePOC` imported `Handle` but never rendered one. With no source handle, React Flow cannot start a connection drag: the feature was structurally absent, not just hidden.
- **Fix:** Unconditional `target` (top) + `source` (bottom) handles on all four node components. The dynamic id'd handles in EntityNode/TestimonyNode are preserved for group-node flows.

### Issue 2 — Handles invisible and unreachable (High, Functional/Visual) ✅ fixed
- **Where:** `nodes.css`
- **Cause (a):** The file's active-looking `.react-flow__handle { opacity: 0 }` turned out to be inside a **file-wide comment** (the entire 178-line file was one `/* … */` blob) — so handles had only React Flow's default 6px styling, swallowed by the dark theme.
- **Cause (b):** Verified via `elementFromPoint`: the node card body painted **on top of** the handle, so even a visible handle never received the pointer. `topIsHandle: false` before fix, `true` after.
- **Fix:** New live handle design placed *above* the legacy comment blob: 9px paper-ringed terminals on the `--ut-*` tokens, `z-index: 10`, an invisible 29px hit area (`::after { inset: -10px }`), hover/connect states that scale and brighten, plus `connectionRadius={36}` on the flow for forgiving drops.

### Issue 3 — User-drawn edges rendered dashed (Medium, UX/provenance) ✅ fixed
- **Where:** `graph.tsx` `defaultEdgeOptions`
- **Cause:** `animated: true` applied React Flow's marching-dash to every default-typed edge — including researcher-drawn ones. Per the DESIGN.md provenance rule, dashed is reserved for AI inference; a hand-drawn connection is a researcher assertion and must be solid.
- **Fix:** `animated: false` default. Tour/AI edges keep their own styling inside `SiblingEdge` / `ai-animated-edge`. The **in-flight** connection wire is styled dashed (`.react-flow__connection-path`, 6-4) — visually "not yet asserted" until dropped.

### Issue 4 — React invalid-DOM-property console errors (Medium, Console) — logged, not fixed
- **Errors observed live:** `fill-opacity`, `stroke-dasharray`, `stroke-linecap` (should be camelCase in JSX).
- **Extent:** 16 files use kebab-case SVG attributes in JSX (e.g. `features/ai/components/SuggestedSearchItem.tsx`, `features/mindmap/components/cards/connection-card/connection-card.tsx`, `features/mindmap/edges/SiblingEdge.tsx`, the sightings HUD family). Cosmetic console noise; batch-fix candidate for a cleanup ticket.

### Issue 5 — Unused preload warning (Low, Console) — logged
- `loading.css` preloaded but unused within window load. Pre-existing, benign.

## Verification (fresh page session, tour-populated nodes, no LLM cost)

1. Guided tour placed Kenneth Arnold + Roswell record nodes → **6 handles in DOM, all visible** (9px, token-styled), 2 per node.
2. `elementFromPoint` at handle center returns the handle (hit test passes for a real pointer).
3. Simulated `mousedown → mousemove × 10 → mouseup` from Roswell's source terminal to Arnold's target terminal:
   - In-flight wire rendered **dashed** `6px, 4px` ✔ (unasserted)
   - New edge `xy-edge__rec_…700→rec_…710` created via store `onConnect` ✔
   - Committed edge renders **solid** (`stroke-dasharray: none`), parchment stroke ✔
4. Console: zero errors attributable to the change (only pre-existing Issue 4/5 noise).
5. Typecheck: **1901 errors — exactly the established pre-existing baseline, zero new.**

## Evidence

- `screenshots/01-initial-load.jpeg` — build error from mid-session CSS comment collision (fixed)
- `screenshots/03-canvas-loaded.jpeg` — clean canvas after fix
- `screenshots/04-user-drawn-edge.png` — first user-drawn connection, Arnold → D.C. Flap
- `screenshots/05-final-connected.png` — fresh-session verification, solid asserted edge

## Round 2 — Agent-submit flow (2026-07-09, from user screenshots)

Reproduced the reported flow: empty canvas → "Start guided tour: Ancient Archaeology" → AI RESPONSE node.

### Issue 6 — "AI is thinking…" forever (Critical, Functional) ✅ fixed
- **Cause:** the mindmap agent SSE stream *did* deliver `{"error":"run_failed","message":"…quota…"}`, and `use-mindmap-agent.ts` *did* throw on it — but the throw landed in the inner `catch` intended for malformed JSON chunks and was swallowed (`console.debug('Skipped chunk')`). `runAgentQuery` then resolved empty, and `runAgentQueryAndAddNodes` early-returned without touching the node, leaving `isLoading()` true forever.
- **Fix:** `JSON.parse` isolated in its own try/catch (`continue` on parse failure); agent-reported errors now propagate to the graph's catch, which sets `{error, answer}` on the node. The node's error state was upgraded from a generic "Error loading content" to the NO CARRIER stamp with the actual provider reason.
- **Verified live:** node now flips to `NO CARRIER / You exceeded your current quota…` seconds after the stream error.

### Issue 7 — Console cluster overlapped the centered node (High, Visual) ✅ fixed
- **Cause:** new agent nodes were placed at exact viewport center; the bottom console cluster grows upward while streaming (chips + expanding chat), colliding with the node on short viewports.
- **Fix:** `getCenteredPosition()` anchors at 35% viewport height, keeping the node clear of the console's territory.

### Non-issues from the screenshots
- The floating "⊙" circles are the new connection handles working as designed — one belonging to a partially off-screen node reads as a detached circle at the viewport edge.
- The thin vertical line beside the AI RESPONSE node is the userInputNode's own anchor-sparkle design element, not a stray edge.

## Testing Notes

- Tested: handle rendering on `entityNode`/`eventsNode` types, drag-to-connect (both directions), programmatic tour edges, connection-line styling, console, typecheck baseline.
- Not tested: `testimoniesNode`/`documentNode` handle rendering in-browser (same code path, fixed identically, but no testimony/document record was placed on canvas this session); touch input; connecting while zoomed far out.
- Environment quirk: React Flow handles listen for `mousedown`/`touchstart` — synthetic `PointerEvent`s do not trigger connection drags. Real user input is unaffected.
