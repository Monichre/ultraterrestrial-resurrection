# Story 2 "Follow the thread" — connections canvas

**Started:** October 8th, 2026. **Owner:** Devin session. **Status:** awaiting user review — Impeccable roundtable passed, two P1 follow-ups open.

## Goal

Storybook-only prototype of an entity/evidence connections canvas under
[`apps/app/src/features/research-canvas/case-files/connections-canvas/`](apps/app/src/features/research-canvas/case-files/connections-canvas/),
then an Impeccable critique + design roundtable iterated until consensus passed.
Not wired to the live `/research-canvas` route (that is `features/mindmap/`).

## Files owned

- [`apps/app/src/features/research-canvas/case-files/connections-canvas/`](apps/app/src/features/research-canvas/case-files/connections-canvas/) — new directory: `types.ts`, `nimitz.fixture.ts`, `evidence-edge.tsx`, `entity-canvas-node.tsx`, `notation-pin-node.tsx`, `ConnectionsCanvas.tsx`, `ConnectionsCanvas.stories.tsx`
- [`apps/app/src/features/research-canvas/case-files/canvas/canvas-drawer/canvas-drawer.tsx`](apps/app/src/features/research-canvas/case-files/canvas/canvas-drawer/canvas-drawer.tsx) — dialog semantics, flat handle, `showHandle` prop, `children` made optional
- [`apps/app/src/features/design-sandbox/`](apps/app/src/features/design-sandbox/) + [`apps/app/public/design-sandbox/`](apps/app/public/design-sandbox/) — Design Sandbox stories (Night Studio A/B, 3 Brand Doctrine HTMLs) from user's Downloads, done by a background agent
- `.impeccable/roundtable/` — capture scripts + 11 journey screenshots
- `.impeccable/critique/` — persisted critique snapshot (first run, 31/40)

## What was built

- **Canvas**: ReactFlow, 14-node/15-edge Nimitz fixture, `EvidentiaryStateBadge` + `NarrativeEdge` dash grammar + `EVIDENTIARY_STATE_COLORS` on every edge. Stories: `Nimitz`, `ContestedHeavy`, `EgoNet`, `FullyExpanded`.
- **Progressive disclosure**: `seedId` opens at seed + degree-1 neighbors; `+N` chips reveal/collapse per node; `fitView` only when revealed content lands offscreen. Default tier gating shows Observed/Corroborated/Contested; weaker tiers collapse behind dimmed legend rows with counts.
- **Ghost edges**: tier-hidden relationships stay in topology as faint dashed non-interactive strokes (verified on AATIP→Nimitz).
- **Edge inspection**: clicking an edge's label pill opens `CanvasDrawer` with relation stamped as a sentence, tier, evidence basis with source types, counter-reading (with explicit empty state), and next-trace prompt.
- **Session pins**: dbl-click pane drops an editable taped-note node; × removes; session-only, no persistence.
- **Drawer**: `role=dialog`, `aria-modal`, Escape + X + scrim close, flat scrim, the old pulsing gradient handle is gone (flat neutral handle, `showHandle={false}` in this usage).

## Impeccable roundtable

Three isolated reviewers (design-director · UX/journey · voice-contract) over 11 scripted screenshots. All three returned PASS-WITH-FIXES; every shared blocker was fixed and re-captured:

- Observed vs Corroborated were visually identical → weight + luminance ramp on edges
- Edge labels were unreachable divs → real `<button>` pills, opaque, `aria-label`, `focus-visible` ring
- No directionality → `MarkerType.ArrowClosed` on non-ghost edges (edge-object config, resolved string passed to `BaseEdge`)
- Fixture misgradings → r9 Corroborated→Inferred, r12 note clarified as source claim, counter-readings added across r8/r10/r13/r16
- Amber +N chip collided with Contested amber → zinc dashed chip
- `canvas-drawer.stories.tsx` typecheck error (`children` required) → `children` is now optional in `CanvasDrawerProps`

**Score:** 31/40 first-run baseline. `impeccable detect --json` → `[]` on both runs. Consensus: **passes for user review**.

## Verification evidence

- Scoped `tsc` on touched files: clean. App-wide `tsc` still shows ~60 pre-existing errors in unrelated files (globes, timeline, Clerk, `animated-folder.stories.tsx`) — none in `connections-canvas/` or `canvas-drawer/`.
- Detector: `impeccable detect --json` → `[]`.
- Browser journey verified live on `localhost:6006` (headless Chromium via `puppeteer-core`): opening cluster, +N reveal (SPY-1 → Kevin Day), ego focus, tier toggle (Contested edge leaves DOM), drawer open/close, pin add with text, mobile 390px collapsed `[ TIERS ]` legend.
- Pin quirk: Puppeteer CDP `clickCount:2` never synthesizes `dblclick` in headless — synthetic `dispatchEvent` and the earlier headed-browser session both confirm the handler works.
- Design Sandbox stories compile but their **visual render is UNVERIFIED** — worth an eyeball.

## Open items / user decisions

1. **Keyboard path (P1 deferred)**: chips/pills/close are real buttons, but no arrow-key node cycling or Enter-to-inspect. Suggested: `$impeccable harden`.
2. **Edge-label crowding at Nimitz/Fravor junction (P1 deferred)**: collision offset or labels-on-selection. `$impeccable polish`.
3. **Pin persistence**: session-only today; own table needed if they should survive reload — not built.
4. **Tour→canvas handoff**: parallel silos today; "follow this thread yourself" exit on waypoints would join them — design decision pending.
5. **Next stories**: Story 1 (evidence dossier) or Story 3 (folder triage) still unstarted.

## Environment notes

- Storybook on `localhost:6006` (`apps/app`) — do not start a second instance; `EADDRINUSE`. A separate `disclosure-ui` Storybook lives on 6007.
- Storybook crashed twice this session under memory pressure; restart with `bun run storybook` in `apps/app`. Machine was at ~zero free RAM.
- Chrome DevTools MCP can't write screenshots outside its workspace roots — use `puppeteer-core` + cached Playwright Chromium (see `.impeccable/roundtable/capture.mjs`).
- `.impeccable/` artifacts are tracked-worthy (only hook caches are gitignored via `.git/info/exclude`).
