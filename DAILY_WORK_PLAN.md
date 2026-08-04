# Daily Work Plan — Ultraterrestrial Resurrection

**Last updated:** 2026-08-01
**Branch:** `dev`
**Focus:** Lane A ingestion hardening (T-048) · Lane B Spacetime Canvas M0 (T-047)
**Reference:** `docs/plans/TODO.md` is the source of truth for ticket detail.

## Current state — 2026-08-01

| Ticket | Lane | Status | Next step |
|--------|------|--------|-----------|
| **T-047** — Temporal Observatory / Spacetime Canvas M0 | B — Platform & Experience | IN PROGRESS — M0.1–M0.8 scaffolded on `/spacetime` | Dogfood `/spacetime` against real DB + a Mapbox token; confirm frame timing. Optional: retire the static geojson path in legacy `sightings-globe.tsx`. |
| **T-048** — Ingestion hardening | A — Corpus & Ingestion | IN PROGRESS — audit complete, plan landed | **H0 — stop the bleeding:** purge `graphify-out/` cache from `sources/`, drop the 47 phantom index entries, fix 6 dead YouTube paths, relativize all 564 `path` fields, delete the dead `index.ts`/`package.json` surface, reconcile the 390-vs-139 unindexed-file discrepancy. |

**Cross-lane dependency:** Lane B's M1 evidence instrument cannot be built before Lane A ships H4 (provenance backfill). M0 does not depend on Lane A and proceeds in parallel.

**Blockers:** none recorded for either ticket beyond the environment needs noted above (Mapbox token for T-047 dogfooding).

### Session 2026-08-01 — File reseed

- This file had accumulated ~296 lines of repeated auto-generated `_Last agent session:` / `_Files touched:` boilerplate prepended above the real content, with no session detail in any of it. Removed.
- Real session history from 2026-06-20 through 2026-07-23 was **present** and has been preserved verbatim under "Prior sessions" below — it was not regenerated or summarized.
- Added the current-state section above, grounded in `docs/plans/TODO.md`.
- **Resolved:** the source was a `Stop` hook in `.claude/settings.json` that prepended a timestamp block to this file at the end of *every* assistant turn (not once per session), and whose timestamp was always blank because the template wrote `$ts_` — bash read that as an unset variable named `ts_` instead of `${ts}`. The hook has been removed; a per-turn automated stamp on a Tier-3 curated doc is wrong by design. A further 11 blocks accumulated between the first cleanup and the fix and were stripped.

## How agents use this file

1. Append a new `### Session <date> — <topic>` entry for your work; keep the current-state table above accurate.
2. Claim a ticket by noting your agent name and date.
3. On done → update ticket status in `docs/plans/TODO.md` too. Blocked → name the blocker.

---

## Prior sessions (archive, pre-2026-08-01)

**Last updated:** 2026-07-23 13:43 CDT
**Branch:** `dev`
**Focus:** Timeline component diagnostics and Postgres contract repair

### Session 2026-07-23 13:43 CDT — Timeline component repair

**Done:**

- Cleared all 5 TypeScript diagnostics and all 41 ESLint diagnostics from
  `apps/app/src/components/timelines/**`
- Updated React 19 callback refs, Storybook Next.js imports, typed draggable timeline
  contracts, and accessible Next.js image rendering
- Replaced the scroll-through prototype's retired Xata type/static gallery with typed
  `@db/postgres` event records, active-year filtering, UTC dates, and guarded photo URLs
- Added `TimelineComponents_PSUEDOCODE.md` and `TimelineComponents.md`
- Verified targeted lint/type gates, IDE diagnostics, whitespace, and the production build

**Next:** The remaining `src/components/**` diagnostics are outside this bounded timeline pass.

### Session 2026-07-19 21:45 CDT — Docs root, prune, spine navigation

**Done:**

- Restructured `docs/` (~24MB → ~3.5MB): deleted stale INDEX/DOCUMENTATION_ORGANIZATION_PLAN; archived historical root MD, plan dumps, dated vision audits, prototypes
- Created living tree: `architecture/`, `ops/`, `research/methodology/`; narrowed `plans/` to FEATURES+TODO; flat `vision/` canon
- Restored `docs/ops/` (onboarding, triage, issue-tracker, domain, CONTRIB with `@db/postgres`)
- Wrote `docs/README.md` six-question spine; tagged living canon with frontmatter
- Updated CLAUDE.md + AGENTS.md paths; canvas `docs-root-and-prune`

**Next:** merge branch; optional T-046 docs automation

---

### Daily Work Plan (2026-06-20 board)

**Date:** 2026-06-20
**Sprint:** Phase 2/3/4 — autonomous board-clear (multi-agent dev session)
**Branch:** dev
**Reference:** `docs/plans/TODO.md`, `AGENTS.md`

> RECONCILED 2026-06-20: T-011, T-012, T-016(ph1), T-017, T-018, T-019, T-021,
> T-022, T-024 verified DONE in code (commit 3edff59) — board was stale. Remaining
> open set below is being cleared by a supervised multi-agent session.

> NOTE: Data-Platform Rebuild (SP1-SP4) is **fully complete** as of 2026-06-15/16.
> Neon Postgres 17.10 + pgvector 0.8.0 is live. `@db/xata` is retired. The active
> sprint is now UX Hardening and State Management.

---

## Sub-project status

| # | Sub-project | Status |
|---|-------------|--------|
| **SP1** | Schema + relational load | ✅ DONE — 29 tables loaded + verified on Neon (2026-06-15) |
| **SP2** | Library + ingestion pipeline (re-ingest ~960 files, embeddings, edge extraction) | ✅ DONE — 189 docs / 4,946 chunks / 1,405 entity embeddings live (2026-06-15) |
| **SP3** | App `@db` data-layer cutover (~25 call sites) | ✅ DONE — all call sites migrated to `@db/postgres`, `@db/xata` retired |
| **SP4** | ufo-ui cherry-pick (`NetworkTimelineExplorer`) | ✅ DONE |

---

## Board CLEARED — supervised waves complete (2026-06-20)

| Ticket | Description | Wave | Result |
|--------|-------------|------|--------|
| **T-030+T-031** | Migrate 6 `disclosure/chat` consumers → `disclosure/mindmap`, delete legacy chat route + dead historical-query chain | 1 | ✅ DONE (633216d) |
| **T-008** | Paginate graph — bound initial load to 200-500 nodes, O(1) edge resolution | 1 | ✅ DONE (43b276a) |
| **T-023+T-029** | Docs — clean stale refs from FEATURES.md; author UFO research methodology framework | 1 | ✅ DONE (2c23a02) |
| **T-025** | Wire rate limiting into canonical AI routes (prometheus/chat, disclosure/mindmap) | 2 | ✅ DONE (a203aa1) |
| **T-020** | Finish Zustand canvas-slice migration — move remaining useState out of mindmap-context | 2 | ✅ DONE (verified pre-existing) |
| **T-027** | ResearchSession unified state slice (converge fragmented providers) | 3 | ✅ DONE (slice landed, non-destructive; migration documented) |
| **T-028** | Mindmap Agent Consolidation (L) | 3 | 📋 AUDIT DONE / IMPL DEFERRED — found broken 3rd agent path (`sse/xata/ask` on retired `@db/xata`) |

**Goal reached:** every open ticket driven to a resolved state — DONE, or
honest BLOCKED/DEFERRED with the blocker named and a grounded plan committed.
Verification gate held throughout: `bunx tsc --noEmit` = 48 errors, all in the
7 pre-existing baseline files; zero new errors introduced.

### Carry-forward (not part of this board — future waves)

- ~~**T-028 Phase A** (delete the retired `sse/xata/ask` path)~~ ✅ DONE 2026-07-05 (see below)

---

## Wave 2026-07-05 — State-of-Union audit + T-028 Phase A + syntax-debt fixes

| Item | Result |
|------|--------|
| Syntax-corrupt files (47 parse errors) | ✅ FIXED — `NewLogo.tsx` (raw SVG→JSX), `hud-sightings-terminal.tsx` (unescaped braces), `tailwind.config.ts` (theme never closed — plugins was nested inside it), 3 `components/blocks/*` files (markdown fences pasted into .tsx), stray `hooks\use-mobile.ts` file (backslash in filename), duplicate `use-mobile.ts/.tsx` merged |
| **T-028 Phase A** | ✅ DONE — deleted `/api/sse/xata/ask` + `/send` + `/api/sse/test`; deleted dead consumers (`useSSE`, `useAskXata`, `XataAskComponent`, `useXataAsk`, `ask-example*`, `features/mindmap/debug/`); `AskAIStreaming` rewired to `useMindMapAgent` (canonical route); `xata-to-xyflow.ts` fetchRecords→`readById`, AI fallbacks→`searchTable`; `process-resource.ts`→`searchTable`; Clerk webhook rewritten on `@db/postgres` (URL kept); all `@db`/`@db/xata`/`@db/src` value imports purged from live code |
| **CORRECTED BASELINE** | ⚠️ The "48 tsc errors" gate was a stale-incremental artifact (`tsconfig.tsbuildinfo`). A clean `bunx tsc --noEmit` shows **~2,100+ errors** project-wide (build passes only because `next.config.ts` sets `ignoreBuildErrors: true`). Biggest buckets: features/mindmap (~500), components/ui (~190), features/ai (~180), stories (~130). Wave reduced total by ~70 with zero new-error files. Fixing this debt is now tracked honestly — do not quote "48 baseline errors" again. |

**Needs runtime smoke (out of scope for tsc-only gate):** canvas Ask-AI streaming via `/api/disclosure/mindmap`, Clerk webhook user sync against Neon.

### Wave 2026-07-05 (later session) — T-028 Phase B + runtime smoke + Prometheus v6 fix

| Item | Result |
|------|--------|
| **T-028 Phase B** | ✅ DONE — shared search core already existed in `@db/postgres` (`searchDatabase` = FTS + pgvector + RRF); extracted the last duplication: shared `embedQuery` → `services/ai/openai/embed-query.ts` (both live routes import it); deleted one-line `tools/search-database.ts` wrapper + orphan `tools/index.ts` barrel; 4 importers repointed to `@db/postgres` |
| **Runtime smoke — mindmap** | ✅ mechanics verified — `/api/disclosure/mindmap` SSE streams end-to-end (thread create, run start); run fails ONLY on **OpenAI quota exhausted** (billing blocker, not code) |
| **Prometheus chat v6 bugs** | 🐛→✅ FIXED — route was 100% broken at runtime from AI SDK v4→v6 drift: `toDataStreamResponse()` (removed in v6) → `toUIMessageStreamResponse()` in 5 files; `tool({ parameters })` → `tool({ inputSchema })` for all 10 tools. Route now streams the correct v6 UI-message protocol (start/start-step/finish); final error is the same OpenAI quota blocker |
| **Neon search smoke** | ✅ `searchDatabase({table:'events', searchTerms:['Roswell']})` returns correct ranked results against live Neon data |
| **Clerk webhook smoke** | ⏸ blocked locally — `CLERK_WEBHOOK_SECRET` not in env; route runs and refuses correctly |
| **Typecheck** | 1,931 → **1,913** clean-check errors, zero newly-broken files |

**External blockers for full close-out:** OpenAI billing top-up (both agents), `CLERK_WEBHOOK_SECRET` env (webhook smoke). **Next code work:** T-028 Phase C (unify tool definitions across the two live routes).

### Wave 2026-07-06 — Research Canvas experience: Guided Tours + data-deep suggestions + animations (browser-verified)

**Product-owner directive:** feature/UX focus, not type debt. Delivered and verified live in Chrome:

| Piece | What shipped |
|-------|--------------|
| **Suggestion engine** (`packages/db/src/postgres/related.ts`, `getRelatedRecords`) | 3 data-native signals, NO LLM required: (1) join-table adjacency (event/topic SMEs, org members, topic testimonies), (2) pgvector nearest-neighbors of the canvas-centroid using STORED embeddings (works while OpenAI quota is dead), (3) temporal event clustering. Reason-diverse ranking, title dedupe (281 junk `dateText:` event names handled), per-seed attribution. ~1.8s for 12 suggestions. |
| **Server actions** | `actions/related-records.ts` (suggestions + deterministic hypothesis synthesis), `actions/tour-actions.ts` (waypoints resolved against live Neon via FTS at tour start — no hardcoded ids). |
| **Research Suggestions dock** (`components/research-suggestions-dock.tsx`) | Replaces ConnectedRecordsPanel (which was 100% dependent on the quota-blocked agent + string parsing). Framer-motion cards grouped by signal (emerald=documented, violet=semantic, amber=temporal), hypothesis header, click-to-add places node + reasoned edge. Tour-aware: locks onto active waypoint ("Tour Intelligence"). |
| **Guided Tours** (`tours/guided-tour-store.ts`, `use-guided-tour.ts`, `tour-overlay.tsx`, `famous-events-tour.ts`) | 8-waypoint "The Modern UFO Era" tour (Arnold→Roswell→DC 1952→Hills→Rendlesham→Phoenix→Nimitz→Roosevelt/2017). All 8 resolve to real events. Narrative overlay w/ progress dots + step nav, chronological spine layout, camera flight per step, waypoint pulse highlight. Wired to Start Tour chips (empty + populated canvas). |
| **Animations** (`research-canvas/canvas-animations.css`) | All nodes scale/blur/fade in (`scale` property — composes with RF transform), edges fade in, tour-active node pulses. |
| **Declutter** (user feedback) | ResearchCanvasConsole gained `variant='compact'` — topic CardStack no longer floats over a populated canvas; whole bottom cluster hidden while a tour runs. |
| **Bugs fixed en route** | `SubjectMatterExpertCard` crashed the app on personnel rows with null `photo` (`photo[0]` → `photo?.[0]`); suggestion-fetch infinite loop from unstable `useActiveTourSeed` object identity (now primitive selectors + memo). |

**Browser-verified (Chrome DevTools MCP):** tour start → waypoint resolution → node placement → dock hypothesis ("Walter Haut, Jesse Marcel, Jeremy Corbell and 1 other are all documented on The Roswell Incident…") → suggestion click-add (George Knapp) → step advance w/ camera flight. Zero new tsc errors (all new files clean; remaining hits in touched files are pre-existing baseline).

### Wave 2026-07-08 — Fallback chain hardening + Microfilm Dark canvas (T-037)

| Item | Result |
|------|--------|
| **Model fallback chain hardened** (commit 37d9a6c) | ✅ `src/lib/ai/model-fallback.ts` made resilient to real-world provider failures: env-alias gating (tiers skipped unless their key is actually set), z.ai `.chat()` call fix, Gemini `thinkingBudget: 0`, per-tier retries, and a `gemini-3-flash-preview` backup tier added. New smoke script `apps/app/scripts/smoke-model-fallback.ts`. `generateText`/`generateObject` fallback chain verified live end-to-end: with only the Google tier currently funded, the first live **Synthesize Investigation** dossier was served by Gemini 3 Flash in the UI. |
| **Microfilm Dark canvas** (commit 0ce78d6) | ✅ Repo-root `PRODUCT.md` + `DESIGN.md` authored as canonical product/design context ("Microfilm Dark" design language). Research canvas retinted to archival-dystopian dark tokens. Synthesis panel reworked into an **A–I Case Synthesis** dossier with redaction-skeleton loading state and a **NO CARRIER** failure stamp. Provenance rule applied (dashed edge = AI inference). Record-ID leak fixed in `synthesize-investigation.ts` prompt. |
| **Typecheck** | ✅ Baseline 1901 maintained — zero new errors. |

**External blockers (user-side):** OpenAI / Anthropic / z.ai billing not funded; Groq key invalid; `GEMINI_API_KEY` revoked as leaked (needs rotation). Only the Google tier is live, which is why the fallback chain currently lands on Gemini 3 Flash.

**Next steps:** T-037 remainder — extend the fallback chain with a `streamText` + tool-call variant so both live agent routes (`/api/disclosure/mindmap`, `/api/prometheus/chat`) survive a single-provider outage; UT-voice review of `build-agent-context.ts` and the Prometheus tool prompts. Then Phase 2 design work (theories user-owned model + canonical claims table).

### Wave 2026-07-12 — Open-ticket swarm + Linear cutover

| Ticket | Result |
|--------|--------|
| **T-028** | ✅ Phase C implemented: shared Postgres/Exa research tools across both live routes. Linear: DMGD-183. |
| **T-036** | 📋 Decision ready: full build NO-GO; 10-source provenance pilot proposed. Linear: DMGD-184. |
| **T-037** | ✅ Prometheus and all six document actions use retry-aware pre-stream provider fallback; UT voice pass complete. OpenAI Assistant verification remains externally blocked. |
| **T-038** | ✅ Product/canon sync, prototype ruling, and scoped UI language sweep complete. Remote Figma review remains blocked. |
| **T-039** | ✅ Operational docs simplified and checked against live routes/Postgres exports. Linear: DMGD-185. |
| **T-040** | ✅ Linear is now the actionable tracker; historical `T-*` work migrated without duplicating existing audit issues. Linear: DMGD-186. |
| **T-041** | ⏸ Blocked: app ran at `localhost:3000`, but no browser backend was available for mandatory current-run screenshots. Linear: DMGD-187. |
| **T-042** | 📋 Decision ready: local coordinator + scoped specialists; cloud persistence rejected for now. Linear: DMGD-188. |

**Verification so far:** touched AI files have zero filtered TypeScript errors; fallback retry smoke produced `retry → retry → ok`; targeted UI lint produced zero errors; documentation/canon diffs pass `git diff --check`. Full loop verification and PR remain pending.

## How agents use this file

1. Check "Next" table for unblocked tasks.
2. Claim by adding an "In Progress" note with your agent name and date.
3. On done → update ticket status and date. Blocked → note reason.
4. Full task detail lives in `docs/plans/TODO.md`.

### Session 2026-07-18 19:53 CDT — Cursor research subagents

- Generated 18 project-scoped Cursor research subagents in `.cursor/agents/` from the canonical v2 definitions.
- Embedded the shared epistemic contract, complete role prompts, authority and logical tool boundaries, I/O contracts, handoffs, failure modes, and evaluation criteria.
- Added `.cursor/generate-research-agents.mjs` for deterministic regeneration and `.cursor/agents/README.md` for roster documentation.
- Kept `DOTY_PATTERN` excluded and preserved the distinction between development-time specialists and the two live product AI paths.
- Verified 18 unique valid frontmatter names, all required sections, DOTY exclusion, clean whitespace, and zero linter diagnostics in the generator.

### Session 2026-07-18 20:40 CDT — Research subagent review + harden

- Fixed Cursor Task routing: flat quoted `description` (was YAML `>-`, catalog showed bare `>-`).
- Added `model: inherit` + `readonly: true`; slimmed prompts ~40% (avg ~6.8KB).
- Renamed source dir `ultraterrestrial-agent-definitions-v2 3` → `ultraterrestrial-agent-definitions-v2`; corrected Xata→Postgres in suite README.
- Docs: `.cursor/Agents.md`, `.cursor/Agents_PSUEDOCODE.md`, routing/dialectics/vision-role map in `.cursor/agents/README.md`.

### Session 2026-07-23 13:15 CDT — Holographic file stack Storybook hardening

- Corrected the existing React Three Fiber file stack: frame-rate-independent damping,
  functional `rotationFactor`, zero-value handling, stable indexed mapping, and valid mesh props.
- Updated Storybook to the Next.js renderer types and added default, single, empty, and
  zero-spacing/rotation stories with controls.
- Added co-located pseudocode and implementation architecture documentation.
- Verified targeted ESLint, filtered TypeScript diagnostics, IDE diagnostics, and the
  Storybook 9.1.6 static build.

### Session 2026-07-23 19:58 CDT — Paper document system prototypes

- Added a shared light-paper document system for the four archived UI concepts, with real
  supplied bitmap textures, print-safe tokens, evidence badges, and solid-versus-dashed
  provenance rules.
- Added a responsive design-system specimen and applied the shared layer to the Living
  Research Canvas, Evidence Ledger, Temporal–Geospatial Observatory, and Hypothesis Lab.
- Browser-verified all four prototypes at 1440×960 and 390×844; ledger/lab reflow for mobile,
  while canvas/observatory retain deliberate horizontal pan surfaces. No console errors.
- Verified HTML structure, PostCSS parsing, Prettier formatting, local asset responses, and
  `git diff --check`.
