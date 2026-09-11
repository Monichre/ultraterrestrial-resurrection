# Daily Work Plan — Ultraterrestrial Resurrection

**Last updated:** 2026-08-14
**Branch:** `dev`
**Focus:** Lane B assembling-components apply (token aliases + root providers) · Lane B Disclosure Lab (DMGD-216 / T-052) · Research Canvas Gen-UI (DMGD-219 / T-053, **needs grooming/review**) · Lane A ingestion hardening (T-048) · Spacetime M0/M1 (T-047)
**Reference:** Linear owns implementation tickets; `docs/plans/TODO.md` kept in parity. Canonical specs: `docs/plans/2026-08-09-disclosure-lab.md`, `docs/plans/2026-08-09-research-canvas-genui.md`, proposed MVP `docs/plans/2026-08-10-rc-p0-tool-cards.md`. Assembling apply: `docs/plans/AssemblingComponentsApply.md`.

## Session 2026-08-14 — T-053 tracking: grooming/review required (no product code)

T-053 / DMGD-219 remains **OPEN / needs grooming**. The epic (`2026-08-09-research-canvas-genui.md`) and RC-P0 ToolCards MVP (`2026-08-10-rc-p0-tool-cards.md`) are the canonical plans; **the idea and feature need grooming and review from the agent team before implementation.** RC-P0 is the proposed first slice, not started, and not locked-to-build until that review.

## Session 2026-08-13 — assembling-components apply (gap-fill, not a scaffold)

- Applied assembling-components to the existing Next.js 15 app. Plan: `docs/plans/AssemblingComponentsApply_PSUEDOCODE.md`. Architecture: `docs/plans/AssemblingComponentsApply.md`. FEATURES Decision 13.
- Wired `--color-*` / `--spacing-*` / `--font-size-*` / `--radius-*` / `--shadow-*` / `--chart-color-*` / `--z-*` / `--duration-*` as aliases on `@repo/disclosure-ui` `--du-*`.
- Root layout: tokens → globals import order; `data-theme` + `class`; `ToastProvider`; `prefers-reduced-motion` in `globals.css`.
- `validate_tokens.py` errors = 0 on disclosure-ui tokens + new feedback/dashboard CSS. Full-app hex migration remains open.
- **UNVERIFIED**: `next build` / visual dogfood not run this session.

## Current state — 2026-08-10

| Ticket | Lane | Status | Next step |
| -------- | ------ | -------- | ----------- |
| **DMGD-216 / T-052** — Disclosure Lab (`apps/disclosure-lab`) | B — Platform & Experience | **IN PROGRESS** — grilling closed; canonical plan in `docs/plans/`; build started | Scaffold app + write-policy + split-pane home; smoke against live Neon |
| **DMGD-219 / T-053** — Research Canvas Gen-UI upgrade | B — Platform & Experience | **OPEN / needs grooming** — epic + RC-P0 plans exist; **agent-team review required before implementation** | Groom/review with agent team; do not claim RC-P0 until then (RC-P4 still soft-deps T-050 render) |
| **T-047** — Temporal Observatory / Spacetime Canvas | B — Platform & Experience | **M0 done; M1 closed at honest scope** | M1 remainder blocked on T-048 H4 |
| **T-048** — Ingestion hardening | A — Corpus & Ingestion | IN PROGRESS — H0 landed; H1–H4 remain | **H1 — Identity:** sha256 + dedup |
| **T-050** — Guided Tours convergence | B — Platform & Experience | IN PROGRESS — subtasks 1–2 landed | Subtask 3 — Render on mindmap canvas (unblocks T-053 RC-P4) |
| **T-054** — Trace Map provenance graph | A — Corpus & Ingestion | **DONE (deterministic layer)** — 2026-08-10 | T-055 interpretive layer; T-056 web path |
| **T-057** — UAP podcast playlist ingest manifest | A — Corpus & Ingestion | **OPEN** — filed 2026-08-12 | Blocked on T-048 H1; pilot one P0 playlist |
| **T-058** — Grouped video retrieval + timestamp citations | B — Platform & Experience | **OPEN** — filed 2026-08-12 | Port n8n workflow patterns to mindmap/Prometheus |
| **T-059** — Playlist-id corpus index | A — Corpus & Ingestion | **OPEN** — filed 2026-08-12 | Playlist-level "already ingested?" lookup |

### Session 2026-08-12 — YouTube workflow fit review → T-057/058/059

- Reviewed n8n templates in `packages/ai/prompts/*youtube*workflow*.json` + 52-playlist UAP podcast catalog.
- **Decision 12** (FEATURES): enhance `playlist_ingestion.py` + live AI paths; reject parallel n8n+Qdrant production stack.
- Opened **T-057** (tiered manifest + pilot ingest), **T-058** (grouped retrieval + `&t=` citations), **T-059** (playlist-level index).

### Session 2026-08-10 — T-054 shipped: Trace Map provenance graph in the ingest flow

- **What it is.** Every processed source now produces `<stem>_trace_map.json` and
  `<stem>_trace_map.md` beside its transcript, chunks, and NER — a `trace-map.v1` graph
  (`apps/disclosure-rag/docs/TRACE_MAP_OUTPUT_SPEC.md`) of one source: segments in source order,
  topics, claims, entities, evidence, agent inferences, and open questions.
- **The thing that was missing before.** Nothing downstream of the chunker could point back at
  the moment in the source that supported it. The map aligns chunk text and NER `span_quote`s
  against the timed segment sidecar, so a claim now carries a character span, a segment range,
  and a timestamp. On the live evidence run 16 of 17 chunks anchored exactly and one was
  interpolated between its neighbours — labelled `interpolated`, never passed off as exact.
- **Deterministic on purpose — no LLM call.** Node typing is decided by whether text anchors in
  the source: an assertion that does not locate is an `inference` carrying `[Inferred]`, never a
  Claim. `supporting_evidence` keeps only its quoted span; the analyst's wrapper prose around it
  is not Evidence.
- **Two-list validator.** `errors` mean the artefact is wrong (a Claim with no anchor, an
  Inference typed as a Claim, a state outside the canonical eight) and fail the run. `gaps` mean
  the spec asks for something no pipeline stage produces — Readings, Counter-readings, Next
  Traces, speaker attribution, evidence→claim linkage, partial coverage — and are printed rather
  than hidden. A gap cannot be closed by fabricating the missing nodes, which is the point.
- **Coverage is the honest headline.** The evidence run anchored **35% of the source** (21,480 of
  60,574 chars, 697 of 2,030 timed segments) because `RAG_PIPELINE_MAX_SOURCE_CHARS=24000`
  truncates the chunker's input. That number was invisible before; it is now in the artefact, the
  Markdown, and the run summary.
- **Follow-ups opened:** **T-055** (interpretive layer + evidence→claim linkage), **T-056**
  (web-article path, deliberately deferred — its bundle directory is not available where the
  pipeline result is).

### Session 2026-08-09 — T-053 / DMGD-219 opened: Research Canvas Gen-UI feature upgrade

- **Canonicalized** the dual Gen-UI fit analysis (Deep Research agent + Dashboard Canvas agent → research-canvas shell) into living tier docs:
  - Spec: `docs/plans/2026-08-09-research-canvas-genui.md`
  - FEATURES Decision 11 + Current Focus §5b
  - TODO **T-053** (Lane B backlog)
  - Linear **[DMGD-219](https://linear.app/digital-mischief-group/issue/DMGD-219/lane-b-research-canvas-gen-ui-upgrade-deep-research-loop-agentic)** (Backlog, Feature)
- **Verdict locked:** steal plan→multi-hop→dossier + ToolCards and agentic shared-state canvas geometry; reject CopilotKit/ADK/LangGraph dual runtimes and Workspace sidecars; expand T-027 `researchSession` on the live mindmap shell.
- **Phases:** RC-P0 ToolCards → RC-P1 session AgentState → RC-P2 wire Deep Research mode → RC-P3 SynthesisPanel bridge → RC-P4 plan→waypoints (soft-deps T-050).
- **Not done:** no implementation this pass — documentation + tracking only. Scratch notes under `.scratch/deep-research-genui-fit/` remain analysis residue; canon is the `docs/plans/` spec.

### Session 2026-08-09 — Disclosure Lab build kickoff (DMGD-216 / T-052)

- Canonicalized grilling plan → `docs/plans/2026-08-09-disclosure-lab.md`; FEATURES Decision 10; TODO T-052 → IN PROGRESS; Linear DMGD-216 → In Progress.
- Domain docs already applied (`CONTEXT-MAP.md`, `packages/db/CONTEXT.md`).
- Implementation of `apps/disclosure-lab` started this session.

### Session 2026-08-09 — T-051 opened: `packages/openai-vector-store-mcp` verified live, but unreachable from Claude Code

- **Verified the tools actually work — did not take "finished" on trust.** Booted the console script over stdio (`timeout 15 .venv/bin/openai-vector-store-mcp < /dev/null` → exit 0, FastMCP **3.4.6**, clean shutdown), then called both tools in-process: `list_tools()` → `['fetch', 'search']`; `search("Roswell")` → **10 results**, first `AARO_Historical_Record_Report_Vol_1_2024.pdf`; `fetch(<that id>)` → **168,636 chars** with the correct `platform.openai.com/storage/files/` citation prefix. This is a working retrieval surface over the same OpenAI Vector Store the app's two live AI paths use for `file_search` — confirmed by reading them, not inferred: `api/prometheus/chat/route.ts:76` and `services/ai/openai/config.ts:26` both resolve `process.env.OPENAI_VECTOR_STORE_ID`, which is the variable this server falls back to. Not a scaffold, and not a separate store.
- **`bun run setup` has been run.** `.venv/` exists with `bin/openai-vector-store-mcp` installed, so "finished" means installed and runnable.
- **The gap that matters: it is registered in `.cursor/mcp.json` but not in root `.mcp.json`.** Root registers only `context7`, `chrome-devtools`, `DeepGraph Next.js MCP`, `open-knowledge`. **Cursor can reach this server; Claude Code sessions in this repo cannot.** Left as T-051's first action item rather than done in passing — registering a server changes the tool surface for every future session in this repo, which is the user's call.
- **The whole workspace is untracked.** `git status` → `?? packages/openai-vector-store-mcp/`, zero commits, absent from a fresh clone. Not `git add`ed — it is the user's uncommitted work.
- **Linear checked, not duplicated.** [DMGD-218](https://linear.app/digital-mischief-group/issue/DMGD-218/lane-b-packagesopenai-vector-store-mcp-mcp-server-exposing-openai) already covers this workspace (state **Backlog**, created earlier today). No new issue filed; the live-verification evidence was appended to it as a comment, since its description still said "functionally unverified / no smoke test run recorded" — which this session falsified.
- **Found a latent break:** `pyproject.toml` floors `fastmcp>=2.0` while the code is FastMCP-3-only (`output_schema=` on `@mcp.tool`; host/port as `run()` transport kwargs, which the source comment states outright). The venv holds 3.4.6, so it works today, but a fresh `bun run setup` resolving 2.x would plausibly break. Recorded in T-051, not fixed — and stated as "requires 3.x", since nobody actually ran it against 2.x.
- **Not done / not verified:** only **stdio** was exercised — `sse` and `http` are untested despite the README advertising all three; no test suite exists in the package (`scripts/` is empty). Root `.mcp.json` untouched. No row added to the "Current state" table above — T-051 is a backlog item with no in-flight next step, and that table tracks in-flight work.
- **Open question flagged rather than resolved:** should this workspace be committed, and should root `CLAUDE.md`'s architecture section name it? Right now a future agent scanning tracked files concludes this tool does not exist.

### Session 2026-08-09 — T-052 opened: `apps/disclosure-lab` verified as plan-only, zero code

- **Verified the workspace does not exist.** `ls apps/disclosure-lab` fails; `apps/` contains only `app` and `disclosure-rag`. All **six** todos in the plan's frontmatter (`scaffold-app`, `write-policy-gui`, `agent-read-assist`, `gui-parity`, `monorepo-wire`, `domain-docs`) are `status: pending`. This is a plan, not a partial build — future agents should not assume any scaffold exists.
- **Confirmed the plan is decision-locked but not formally closed.** `.cursor/plans/neon_lab_next_app_133476f6.plan.md` records three grilling rounds settling Q1–Q10 (admin-layer context, human-only writer, entity-table allowlist, live shared `DATABASE_URL`, split-pane home, confirm-every-write, `runSqlRead` + typed read tools, no deletes in v1, auto-attached selection chip, hard-blocked SQL `DELETE`/`TRUNCATE`). **Q11 ("Close") is still marked `Pending`** in the file itself — the "Decision lock" section is the working resolution, and the entry says so rather than overstating it.
- **Linear checked, not duplicated.** [DMGD-216](https://linear.app/digital-mischief-group/issue/DMGD-216/lane-b-build-appsdisclosure-lab-ai-native-neon-explorer-with-writeedit) already exists — "Lane B — Build apps/disclosure-lab (AI-native Neon explorer with write/edit)", state **Todo** (unstarted), priority 2, created 2026-08-08. No new issue filed.
- **Opened T-052** in `docs/plans/TODO.md` under "Backlog (Not Sequenced)", Lane B. Flagged the cross-lane hazard explicitly: the Lab reads/writes the **same live Neon DB** that Lane A's T-048 ingestion populates, so a T-048 migration and the Lab's write allowlist can diverge silently — neither lane should assume exclusive control of schema changes.
- **Flagged rather than resolved:** (1) the plan's writable allowlist lists `key_figures` with `personnel` parenthesized — the real table name is unverified against `packages/db/src/postgres/`; (2) `CONTEXT-MAP.md` still doesn't scope the inference-only write rule to Research Canvas (the plan's own `domain-docs` todo covers it, pending); (3) **the plan file is untracked in git** — not ignored, just never `git add`ed — so a tracked ticket currently points at a file absent from a fresh clone.
- **Not done:** no code scaffolded (documentation-only pass by design); the malformed YAML list item in the plan's frontmatter (`-   - id: agent-read-assist`, double dash) was left as-is; no row added to the "Current state" table above, which tracks in-flight tickets with a next step — a zero-implementation backlog item doesn't belong there.

### Session 2026-08-05 (later) — Doc-claim verification, tour test baseline, T-050 opened + subtasks 1–2

- **Verified two prior claims rather than trusting them.** The Spacetime closeout claim held on 9 of 11 points — commits `fdfaf93`/`2c28b4d` exist and contain what was described, eslint is clean on the touched files, tsc shows zero errors in them, and the synthetic single-event-day truncation reproduces byte-for-byte (`"WITNESSES REPORTED A LARGE CIGAR SHAPED…"`). **Two were false:** the committed work log asserted `TODO.md`'s stale T-048 "H0 next" line had been corrected (it had not — all three hunks of that diff sat inside the T-047 block), and "fully-committed" was true of the code but not of the tier-2 entry, which was still uncommitted. Both fixed in `c182c4a`.
- **Greened the guided-tours test suite** (`3318ac6`). `transition-sequence.ts`'s `wait()` used `window.setTimeout`, which throws `ReferenceError: window is not defined` under the test runtime — reproduced at HEAD in a clean worktree, so pre-existing, not a regression from the in-flight choreographer work. Global timers behave identically in the browser and let the module be unit-tested outside a DOM. Also discovered `apps/app` had **no `test` script at all**, so root `package.json`'s `test:app` had always been dead; added `bun test src`.
- **Opened T-050** (`a7fec24`). The repo had two unrelated things both called "tour" and neither was tracked in any tier: mindmap tours (thin chronological spine, Neon-resolved, on-canvas, `stepIndex`-only progress) and Nuclear Shadow (Zod-validated evidence-graph runtime with epistemic gates and five typed edge kinds, on its own route, **zero** `@db/postgres` imports). Ticket scopes the real merge, with pass bar and TDD seam named up front.
- **Landed T-050 subtasks 1–2** (`7fe46f0`), TDD — tests written red first. One mode-discriminated Zod schema covers both engines. Every evidence-graph waypoint now carries a **required** `corpusAnchor`: a resolvable query/recordId, or `none` **with a stated reason**. The field deliberately has no unset member — silence would read as "not resolved yet", which would let a program with no declassified record render as though one exists. Manhattan/Trinity/Smyth/Roswell anchor to real records; Restricted Data, RD/NSI, SAPs and the propulsion fork are marked narrative-only. `useTourStore` and `useGuidedTourStore` are now aliases of one store holding the union of both runtimes; field names don't collide, so every existing selector and `getState()` call reads a superset of what it read before.
- **Verification:** tests 7 → 24, all green; eslint exit 0 on touched paths; zero tsc errors under `guided-tours/` and `mindmap/tours`; repo total unchanged at 1,712 pre-existing.
- **Not done:** T-050 subtasks 3–5 (render on canvas, bind anchors to Neon, single launch path). T-047 M0.5 (retiring the static path in the 78KB legacy `sightings-globe.tsx`) remains open — two background agents assigned to it and to this work died on a session limit before writing anything; this half was then done inline.

### Session 2026-08-03 — T-047 M0 dogfood + R1 frame-timing measurement (closes M0)

- **Live dogfood** of `/spacetime` in Chrome against the real Neon DB + a real `NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN`: bounded load reported **384/387 geolocated events, range 1940–2026**; the Mapbox background rendered real sighting pins (colored by `epistemicStatus`), not the static `sightings.geojson` fixture.
- **Scroll → cursor → camera loop verified live:** scrolling the narrative layer advanced the temporal dial (e.g. to the 1950 station), updated the cursor readout, and eased the map camera toward the nearby geolocated cluster — confirms D1 (bidirectional cursor, scroll authoritative in `guided` mode) is wired correctly end-to-end, not just in the store.
- **R1 (`preserve-3d` WebGL jank) measured on the actual product surface and cleared**, closing the last open M0 risk. Two passes, deliberately not just the spike:
  - **Spike (`/spacetime?spike=1`, scaffolding only, `interactive: false`, no pins, 5 hardcoded cards):** 16.7ms median frame under 4s of programmatic scroll.
  - **Product (`/spacetime`, real):** interactive Mapbox map with the live 384-point geojson circle layer, up to 16 station cards, and a 900ms `easeTo` camera animation firing on every cursor change while the `preserve-3d` sibling scrolls — this is the actual compositing contention R1 was written about. Measured directly (rAF delta sampling, 6s / 361 frames of programmatic scroll covering the full narrative): **median 16.70ms, p95 17.50ms, max 34.0ms** (single outlier frame, not sustained). Comfortably under the ~20ms D2 threshold. A DevTools performance trace over the same scroll reported **CLS 0.00**.
  - **Gotcha for future measurement:** an rAF-based readout (the spike's `useFrameTiming`, or any similar probe) reads `—`/never updates when driven through an automation session whose tab is backgrounded (`document.visibilityState === 'hidden'`, `hasFocus() === false`) — Chrome throttles `requestAnimationFrame` almost to zero in that state, so a 30-sample buffer never fills. Not a product bug. Use a foregrounded tab, or sample frame deltas directly via `evaluate_script` / a DevTools trace (both measure independent of tab focus).
  - **Decision:** per D2, the live globe is retained for M0 — no static-plate fallback needed.
- **Event selection verified live** (not just planned): clicked a real event card in the guided narrative on `/spacetime` — `EventInspector` rendered with timestamp, location, credibility (55%), epistemic status, summary, and provenance (`SIGHTINGS · REC_COBD`), confirming `stillVisible`/auto-deselect logic (`spacetime-canvas.tsx:24-30`) doesn't immediately null the panel out.
- **D1 (bidirectional cursor) verified in both directions**, not just scroll→cursor: clicked a station directly on the `TemporalDial` while scroll position was held fixed (`scrollTop` unchanged, 411→411) — the cursor updated to the clicked station (`event-1947-04-15` → `historical-1970`) and `interactionMode` flipped from `guided` to `free` (confirmed via the mode button's active styling, not just the text label). Dial-writes-cursor in `free` mode is real, not just implemented in the store.
- **M0 exit criteria** (`docs/plans/2026-08-01-spacetime-canvas-implementation.md` §4): open `/spacetime`, scroll, watch the globe camera and visible evidence field change with the cursor, select an event, see its sources and credibility — **met**, verified live end-to-end. No reconstruction, no compare, no playback attempted (correctly out of scope for M0).
- Not done this session: retiring the static `sightings.geojson` path in the legacy `features/sightings/sightings-globe.tsx` (M0.5's "optional" half — that component is a separate, still-live surface at `/sightings`, not something `/spacetime` depends on).

### Session 2026-08-04 — Data-honesty fixes: fake credibility + broken titles

User called the feature not-yet-excellent after dogfooding; two concrete, verified defects, both fixed and confirmed live:

- **`confidence` was hardcoded to `'medium'` for every sighting** (`services/sightings/get-sightings.ts:50`, pre-fix), so every event showed an identical "Credibility 55% · inferred" in the UI regardless of the underlying record — false precision dressed as evidentiary scoring. Root-caused against the platform's own vocabulary docs: CONTEXT.md's 8-state evidentiary system is scoped to "edges, readings, and agent inferences" (not applicable here); TEMPORAL_OBSERVATORY.md §3.7's `documented/inferred/disputed` is actually specced for *reconstruction-manifest* elements (M2, unbuilt) but the doc itself uses "documented sightings" generically for the raw corpus (§1) — so the existing 3-state type was kept (no new terminology invented, none needed), but the computation was fixed to be honest:
  - `get-sightings.ts`: `confidence` now derives from whether `comments` has real content (≥15 chars) — `'medium'` (real account) vs `'low'` (thin/placeholder row). `'high'` intentionally never emitted — nothing in this ingestion path (no witness count, no media, no cross-reference) justifies it.
  - `normalize.ts`: score/status tables now honest and narrow-banded (`0.2/0.4/0.7`, not `0.3/0.55/0.85`) so nothing implies evidentiary weight the source data can't support; `medium → documented`, `low → inferred`.
  - **Verified against real data**, not assumed: sampled 508 live sighting rows — 501 (98.6%) have real narrative content, 7 (1.4%) are thin/placeholder. The fix produces genuine, data-driven variance, not a different flat default.
  - UI copy in `EventInspector` and the guided-narrative station cards no longer states a bare "Credibility X%" (the anti-pattern CONTEXT.md's epistemic-layers section explicitly warns against: *"Avoid 'confidence score', 'probability', 'certainty rating' in UI copy"*) — now reads "Documented report · single-source, uncorroborated" / "Thin record", and the compact station-card list only annotates the minority thin-record case instead of repeating a number on every row.
  - Globe pin radius interpolation (`spacetime-globe.tsx`) stops matches the new `0.2–0.7` score range.
- **Titles truncated mid-word** (`record.comments?.substring(0, 50)`, plus a `.slice(0, 80)` fallback in `normalize.ts`) — e.g. "…OVER THE AT" (cut inside "ATLANTIC"). Both call sites now use a shared word-boundary-safe truncator (cuts at the last space at-or-before the limit, appends `…`). Source-data typos (e.g. "arodinamic") are left as-is — not something a title formatter should silently "fix" without misrepresenting the primary source.
- Verified live in Chrome after each change: real per-event titles ending cleanly, `EventInspector` showing differentiated documented/thin labeling, zero new TypeScript or ESLint errors in the four touched files.
- **Not done / flagged, not silently decided:** the deeper epistemic-taxonomy question — whether Spacetime Canvas should eventually adopt CONTEXT.md's 8-state vocabulary once it starts ingesting record types that actually carry that signal (testimonies, documents with `source_tier`) — is a real product/terminology decision (CONTEXT.md: "no additions without a terminology ruling") and was deliberately left for a human call, not resolved unilaterally under this fix pass.
- **Advisor-caught follow-ups, same pass:** the globe's missing-score fallback (`?? 0.5`) was now off-scale against the new `0.2–0.7` range — fixed to `?? 0.2` (absent signal reads as minimum, not mid-tier). The `EvidenceLayersPanel` credibility control still read "Credibility ≥ X%" — same anti-pattern removed elsewhere but left standing; replaced the continuous 0–100 slider (a false-precision cliff against real scores clustered at 0.2/0.4) with four discrete, honestly-labeled tier stops (Any/Thin+/Docmt+/Corrob+) mirroring the epistemic checkbox pattern.
- **User-requested camera behavior (same session):** selecting an event now commits the globe to a real on-terrain view — `mapbox-dem` terrain source + `setTerrain` + sky layer added on load, and event selection does `flyTo` the event's exact coordinates at zoom 15.5/pitch 70 (ground-level, terrain-relief visible). Absent a selection, cursor/scroll drives a regional descent (zoom 8.5/pitch 45) toward the nearest events to the current timestamp — this is what the implementation plan's §1 "rendered as descent" language meant and the original flat `easeTo` pan wasn't delivering. Re-verified R1 after the change: **still 16.70ms median / 17.5ms p95 / 34.1ms max** — terrain didn't reintroduce jank. One benign Mapbox console warning (sun-direction/lighting anchor), no errors.
- **Final sweep of the same anti-pattern, grep-driven across `features/spacetime` (and `features/sightings` for comparison — that tree is legacy/dead per CLAUDE.md, left alone):**
  - `temporal-stations.ts`'s day-scoring reduce still had the pre-fix `?? 0.5` fallback — corrected to `?? 0.2` for consistency with the globe fallback, though in practice this path is currently unreachable: `normalize.ts` always sets `credibilityScore` for every sighting-derived event, so the `??` never fires against the live pipeline. Harmless, correct-for-consistency, not an observed behavior change.
  - `temporal-stations.ts`'s single-event dial-station label was re-truncating an already word-boundary-safe title down to 42 chars with a raw `.slice(0, 42)` — reintroducing the exact mid-word-cut bug fixed earlier, just at a third render site (station dial labels). **Not verified live**: at `maxEventStations = 24` against the current corpus, no single-event day makes the ranked cutoff — every dial station in the live check showed "N events · year," never a single title. The fix is correct by inspection (mirrors the two already-verified call sites) but this exact path wasn't exercised in the browser.
  - Since this made three independent copies of the same word-boundary truncator (`get-sightings.ts`, `normalize.ts`, and now `temporal-stations.ts` needing it), extracted it to a shared `truncateAtWordBoundary` in `src/lib/utils/text.ts` and imported it directly (not via the `@/lib/utils` barrel, to keep the server-side `get-sightings.ts` data module's import surface minimal) from all three call sites.
  - `tsc --noEmit` and `eslint` clean on every touched file; no new errors, pre-existing unrelated `packages/db` type errors untouched.
  - **Advisor caught a real defect in the tier-button fix from the previous entry, before it shipped**: swapping the credibility slider for four tier buttons (`Any/Thin+/Docmt+/Corrob+`) left two dead controls — `Corrob+` (0.7) is unreachable because `CONFIDENCE_TO_SCORE` never emits `high` in this sightings-only pipeline, and the `Disputed` provenance checkbox is unreachable because `CONFIDENCE_TO_STATUS` never emits `disputed`. Selecting either silently returns/contributes nothing — the exact false-affordance problem this session had been fixing, just relocated. Fixed by deriving reachability from the live `events` array (`presentStatuses` / `maxCredibility` in `evidence-layers-panel.tsx`) and disabling+labeling unreachable options ("No loaded event reaches this tier yet" / "NONE LOADED"), mirroring the existing `LAYER_ROWS` "soon" pattern — self-corrects once a richer ingestion path lands rather than needing a hardcoded flag flipped by hand.
  - Verified live in Chrome: `CORROB+` renders disabled with the tooltip, `Disputed` renders dimmed with "NONE LOADED"; clicking `THIN+` (0.2) leaves count at 387/387 (the corpus floor), clicking `DOCMT+` (0.4) correctly drops to 350/387 (removing the thin-record events, including the "CIGAR SHAPE" card seen earlier) — confirms the filter comparison (`score < min` excludes) is inclusive-minimum and the tier buttons are not a no-op. Console clean except the same pre-existing benign Mapbox sun-direction warning.
  - The "fix them all" sweep for this class of defect (false precision / dead affordances) is closed for `features/spacetime` as of this verification pass.

### Session 2026-08-05 — Storybook fix + M1 closeout at honest scope

- **Unrelated fix, same session:** Storybook dev server crashed on startup (`Failed to load static files, no such directory: docs/design/reference-prototype/public/images`). Root cause: `docs/design/reference-prototype` was deleted wholesale in the 2026-07-19 docs-prune commit (`3c0c451`) after its components were already migrated into `apps/app/src/components/design-system/research-ui/documents/reference-prototype/`, but `.storybook/main.ts` still pointed `staticDirs` and a webpack `@reference` alias/`NormalModuleReplacementPlugin` at the now-deleted path. Confirmed nothing still imports `@reference/...` (the migrated story file was already retargeted). Removed both dead references; `bun run storybook` now reaches 100% with no errors.
- **Verified and closed out the 2026-08-04 M1 data-honesty work**, which was sitting uncommitted: `bunx eslint` clean on all seven touched spacetime/utils/services files, `bunx tsc --noEmit` shows zero new errors introduced (remaining repo errors are pre-existing, unrelated files). Committed.
- **Closed the one open verification gap** the 2026-08-04 log flagged: the single-event dial-station label truncation (`temporal-stations.ts:87`) was "correct by inspection" but never exercised live (no single-event day makes the ranked cutoff at `maxEventStations = 24` against the current corpus). Ran `buildTemporalStations` directly against a synthetic single-event day with a long title — confirmed the label cuts at a word boundary (`"WITNESSES REPORTED A LARGE CIGAR SHAPED…"`, not mid-word). No code change needed; this closes the asterisk on that fix.
- **Checked whether M1's remaining items (relationship arcs, precision/uncertainty rendering) could proceed**, since the user asked to "finish" the feature. They cannot yet: confirmed via `git log` that T-048 (Lane A, the ticket gating this) has only landed H0 (commits `cd77135`, `b6d1d5a`) — H1 (identity), H2 (Postgres bridge), H3 (runs), and H4 (provenance backfill, the actual blocker) are all still open. `TODO.md`'s stale "H0 next" status line for T-048 was corrected to reflect this. Building arcs/uncertainty now would reintroduce the exact false-precision problem the 2026-08-04 session spent two passes removing — declined.
- **Decision:** M1 is closed at its current, honestly-supportable scope. Updated `docs/PLANS/2026-08-01-spacetime-canvas-implementation.md` §4 (M1 section) and `docs/plans/TODO.md` (T-047 entry) to state this plainly, and to name T-048 H4 as the concrete unblock condition rather than leaving M1 in an ambiguous "partially landed" state. Per the plan doc's own §4 rule, M2 (reconstruction) was **not** started — it is a full milestone (generation lever, Event Evidence Packet, artifact/manifest storage, synthetic labeling), not a finishing pass on M1.
- **Not done:** re-auditing T-048/Lane A's own H0 commits for correctness — out of scope for this session, which touched Lane B (T-047) only. The H0-landed claim above is sourced from `git log`, not a fresh review of that code.

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
| --- | ------------- | -------- |
| **SP1** | Schema + relational load | ✅ DONE — 29 tables loaded + verified on Neon (2026-06-15) |
| **SP2** | Library + ingestion pipeline (re-ingest ~960 files, embeddings, edge extraction) | ✅ DONE — 189 docs / 4,946 chunks / 1,405 entity embeddings live (2026-06-15) |
| **SP3** | App `@db` data-layer cutover (~25 call sites) | ✅ DONE — all call sites migrated to `@db/postgres`, `@db/xata` retired |
| **SP4** | ufo-ui cherry-pick (`NetworkTimelineExplorer`) | ✅ DONE |

---

## Board CLEARED — supervised waves complete (2026-06-20)

| Ticket | Description | Wave | Result |
| -------- | ------------- | ------ | -------- |
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
| ------ | -------- |
| Syntax-corrupt files (47 parse errors) | ✅ FIXED — `NewLogo.tsx` (raw SVG→JSX), `hud-sightings-terminal.tsx` (unescaped braces), `tailwind.config.ts` (theme never closed — plugins was nested inside it), 3 `components/blocks/*` files (markdown fences pasted into .tsx), stray `hooks\use-mobile.ts` file (backslash in filename), duplicate `use-mobile.ts/.tsx` merged |
| **T-028 Phase A** | ✅ DONE — deleted `/api/sse/xata/ask` + `/send` + `/api/sse/test`; deleted dead consumers (`useSSE`, `useAskXata`, `XataAskComponent`, `useXataAsk`, `ask-example*`, `features/mindmap/debug/`); `AskAIStreaming` rewired to `useMindMapAgent` (canonical route); `xata-to-xyflow.ts` fetchRecords→`readById`, AI fallbacks→`searchTable`; `process-resource.ts`→`searchTable`; Clerk webhook rewritten on `@db/postgres` (URL kept); all `@db`/`@db/xata`/`@db/src` value imports purged from live code |
| **CORRECTED BASELINE** | ⚠️ The "48 tsc errors" gate was a stale-incremental artifact (`tsconfig.tsbuildinfo`). A clean `bunx tsc --noEmit` shows **~2,100+ errors** project-wide (build passes only because `next.config.ts` sets `ignoreBuildErrors: true`). Biggest buckets: features/mindmap (~500), components/ui (~190), features/ai (~180), stories (~130). Wave reduced total by ~70 with zero new-error files. Fixing this debt is now tracked honestly — do not quote "48 baseline errors" again. |

**Needs runtime smoke (out of scope for tsc-only gate):** canvas Ask-AI streaming via `/api/disclosure/mindmap`, Clerk webhook user sync against Neon.

### Wave 2026-07-05 (later session) — T-028 Phase B + runtime smoke + Prometheus v6 fix

| Item | Result |
| ------ | -------- |
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
| ------- | -------------- |
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
| ------ | -------- |
| **Model fallback chain hardened** (commit 37d9a6c) | ✅ `src/lib/ai/model-fallback.ts` made resilient to real-world provider failures: env-alias gating (tiers skipped unless their key is actually set), z.ai `.chat()` call fix, Gemini `thinkingBudget: 0`, per-tier retries, and a `gemini-3-flash-preview` backup tier added. New smoke script `apps/app/scripts/smoke-model-fallback.ts`. `generateText`/`generateObject` fallback chain verified live end-to-end: with only the Google tier currently funded, the first live **Synthesize Investigation** dossier was served by Gemini 3 Flash in the UI. |
| **Microfilm Dark canvas** (commit 0ce78d6) | ✅ Repo-root `PRODUCT.md` + `DESIGN.md` authored as canonical product/design context ("Microfilm Dark" design language). Research canvas retinted to archival-dystopian dark tokens. Synthesis panel reworked into an **A–I Case Synthesis** dossier with redaction-skeleton loading state and a **NO CARRIER** failure stamp. Provenance rule applied (dashed edge = AI inference). Record-ID leak fixed in `synthesize-investigation.ts` prompt. |
| **Typecheck** | ✅ Baseline 1901 maintained — zero new errors. |

**External blockers (user-side):** OpenAI / Anthropic / z.ai billing not funded; Groq key invalid; `GEMINI_API_KEY` revoked as leaked (needs rotation). Only the Google tier is live, which is why the fallback chain currently lands on Gemini 3 Flash.

**Next steps:** T-037 remainder — extend the fallback chain with a `streamText` + tool-call variant so both live agent routes (`/api/disclosure/mindmap`, `/api/prometheus/chat`) survive a single-provider outage; UT-voice review of `build-agent-context.ts` and the Prometheus tool prompts. Then Phase 2 design work (theories user-owned model + canonical claims table).

### Wave 2026-07-12 — Open-ticket swarm + Linear cutover

| Ticket | Result |
| -------- | -------- |
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


## Session memory — 2026-09-10 01:31:55 CDT — God’s Eye View planning

Inspected donor source and current Spacetime code; saved phased proposal at [docs/plans/2026-09-10-gods-eye-view-integration.md](docs/plans/2026-09-10-gods-eye-view-integration.md). Key finding: Cesium renderer extraction and feed backend migration are separate work. User supplied an Esri/tactical preset. Browser connection returned `No browser is available`; visual fidelity remains UNVERIFIED. Planning only; no product code changed.


**Scope refinement / session memory — 2026-09-10 01:35:57 CDT:** User requires extremely lean, Ultraterrestrial-specific or customizable imports. The [docs/plans/2026-09-10-gods-eye-view-integration.md](docs/plans/2026-09-10-gods-eye-view-integration.md) now makes minimal extraction, typed configuration, excluded donor subsystems, and import/bundle auditing explicit. Feed integrations remain optional; full donor parity is not a requirement. Planning only.
