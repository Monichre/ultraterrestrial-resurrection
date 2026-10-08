## Session October 7th, 2026, 21:46:30 CDT — attached interface journey

- User confirmed three images: Visual Foundation, Trinity, and Controlled Revelation. Implemented [interactive reference studies and journey stories](apps/app/src/features/guided-tours/nuclear-shadow/interface-studies/) using the supplied artwork intact and the existing tour narrative.
- Provisional four-screen gallery changes were removed; `git status --short -- apps/app/src/features/research-platform` returned empty.
- [Handoff](docs/work_logs/october-7th-2026-interface-journey-handoff.md) records files, resume handle, source boundaries, and remaining audit work. Runtime acceptance remains open.

## Session 2026-10-07 14:40 CDT (UTC-0500) — T-060 URL drop session estimate

- Read Cursor session `6120d5d5-c831-485c-bbf0-e8c2a84cbbcb` (October 6th, 2026, 19:21–21:47 CDT). Goal: YouTube and page URLs on the research canvas, same path as file drop. Agent died twice before browser proof.
- Code is on disk, uncommitted: `url` form field on [`POST /api/processing/drop`](apps/app/src/app/api/processing/drop/route.ts), canvas drag of `text/uri-list`, node kinds `url` / `youtube`. Unfurl only (oEmbed + existing Firecrawl scrape). No corpus INSERT.
- Parser tests rerun this session: `cd apps/app && bun test src/services/processing/drop/parse-url.test.ts` → `7 pass`, `0 fail`, exit 0.
- T-060 in [`docs/plans/TODO.md`](docs/plans/TODO.md) remains IN PROGRESS. No dogfood. Do not close.
- Handoff: [`docs/work_logs/october-7th-2026-t060-url-drop-handoff.md`](docs/work_logs/october-7th-2026-t060-url-drop-handoff.md). Next: open `/research-canvas` and drop a public YouTube URL.

## Session 2026-10-02 20:15:09 CDT (UTC-0500) — semantic surface pairings

- Corrected four aliases in [`packages/disclosure-ui/styles/tokens.css`](packages/disclosure-ui/styles/tokens.css): light tertiary surface uses existing raised paper, light secondary/tertiary body text mixes existing sampled metal with ink, and archival tertiary text uses existing desk-muted. Primitive palettes and font roles unchanged. Baseline role pairs measured 1.09:1, 2.75:1, 3.23:1 and 4.13:1; new contrast regression failed 13 combinations before the fix.
- Added an opt-in [semantic surface specimen](packages/disclosure-ui/src/style-guide/semantic-surface-specimen.tsx) with [scoped styles](packages/disclosure-ui/src/style-guide/semantic-surface-specimen.css) and [Storybook entry](packages/disclosure-ui/src/style-guide/style-guide.stories.tsx). [Running review](http://localhost:6007/iframe.html?id=style-guide--semantic-surfaces&viewMode=story). It compares body roles in runtime contexts; it does not select another product skin.
- Package `bun run test:tokens`: `Ran 22 tests in 0.284s`, `OK`, exit0. `bun run type-check`: `Token parity: 27 CSS primitives and 4 font roles match TypeScript exports`, exit0. Scoped `git diff --check` empty, exit0. Named CSS context existence now asserted to prevent accidental fallback passing the regression.
- Live computed browser pairs: `36/36 >=4.5:1; minimum 4.89:1`; context minima desk5.76, paper4.89, archive5.92. Desktop and 390px inspected; mobile viewport390/document375 (15px scrollbar), 36 pairs, one column, 0 overflowing cards. Captured error/warn log entries `[]`. Viewport restored. Separate reviewer inspected both saved screenshots and approved this limited visual scope, independently reran22tests, and confirmed each reverted alias triggers the regression.
- External JSON/screenshot evidence saved in the task visualization directory. Updated consumer heuristic still exits1 with 71 candidates across 6 checked files; no bulk replacements. No full-app audit, accent/button contrast claim, canon choice, production notebook integration, commit or strategic/ticket completion; broader design goal remains active.

## Session 2026-10-02 20:05:38 CDT (UTC-0500) — truthful consumer token audit

- Corrected [`packages/disclosure-ui/scripts/validate_tokens.py`](packages/disclosure-ui/scripts/validate_tokens.py): the previous package command only found the token definitions it skipped, then reported clean. [`packages/disclosure-ui/package.json`](packages/disclosure-ui/package.json) now scans both styles and src; definitions-only input exits 2 with `Discovered: 1; checked: 0; skipped: 1` and `No consumer CSS files checked`.
- Declaration-scoped matching stops treating font sizes and folder widths as spacing; comments, strings and data URLs preserve source positions without inventing findings. Foreign palette and malformed variable suggestions removed. Input/read failures remain failures. Added regression coverage in [`packages/disclosure-ui/scripts/test_validate_tokens.py`](packages/disclosure-ui/scripts/test_validate_tokens.py).
- Package `bun run test:tokens` output: `Ran 21 tests in 0.255s`, `OK`, exit 0. `bun run type-check`: `Token parity: 27 CSS primitives and 4 font roles match TypeScript exports`, exit 0. Scoped `git diff --check` empty, exit 0. Separate reviewer independently reran 21 tests, audited the actual CLI and confirmed suggested variables exist; approved this tool scope.
- Package `bun run validate:tokens` now exits 1: 6 discovered, 5 checked, 1 skipped; `Total violations: 71`, `Errors: 69`, `Warnings: 2`, with `font-sizes: 21`, `radii: 2`, `spacing: 48`. These are heuristic review candidates, not 71 confirmed canon violations. No consumer CSS replaced to silence the audit.
- External command output/JSON evidence saved in the task visualization directory. Developer-tool change only; no new product visual audit, production integration, canon promotion, commit or strategic/ticket completion. Wider design direction and contextual review remain open.

## Session 2026-10-02 19:54:33 CDT (UTC-0500) — research-folder tuning prototype

- User found [Cojeev Motion Drawer](https://000h.cojeev.com/docs/motion-drawer/) and requested tuning. Added a stack-only local study in [`packages/disclosure-ui/src/style-guide/research-folder/`](packages/disclosure-ui/src/style-guide/research-folder/), retaining MIT notices for adapted continuous folder geometry. No production route or canon defaults changed.
- Paper and ink reuse existing package primitives; technical labels and selectable technical/artifact/UI body faces remain scoped to the prototype. Seven Storybook controls tune width, grain, body face, edge, stiffness, damping and stagger. [Review preview](http://localhost:6007/iframe.html?id=reference-studies-research-folder--tuned&viewMode=story) and [tuning controls](http://localhost:6007/?path=/story/reference-studies-research-folder--tuned).
- Running visual audit exercised all four tabs, arrow/Home/End keys, selecting another fixture record while open, close/Escape focus return, immediate next Tab during exit, outward header drag, mobile390 and reduced motion. Exit controls were corrected to become inert/hidden immediately. Mobile output: viewport390/documentWidth390/folderWidth366. Initial type error fixed with MotionStyle.
- Package `bun run type-check` output: `Token parity: 27 CSS primitives and 4 font roles match TypeScript exports`, exit0. `bun run test:tokens`: `Ran 10 tests in 0.005s`, `OK`, exit0. Separate code review approved. Existing Storybook HMR/reload diagnostics remain in audit evidence; no clean-console claim.
- Added Motion12.23.26 as a prototype devDependency; installer also registered the current disclosure-design/research-base workspace manifests in [`bun.lock`](bun.lock). Uncommitted. Real records, production canvas integration, persistence, mobile modality and canon adoption remain open; no strategic/ticket completion promoted.

# Daily Work Plan — Ultraterrestrial Resurrection

## Session 2026-10-02 18:12:04 CDT (UTC-0500) — Bill Guo homepage study

- User narrowed recreation to the homepage only. Added a prop-driven [homepage prototype](packages/disclosure-ui/src/style-guide/homepage-prototype.tsx) and [Storybook stories](packages/disclosure-ui/src/style-guide/homepage-prototype.stories.tsx), with Ultraterrestrial copy and explicitly labeled procedural artwork. [Running preview](http://localhost:6007/iframe.html?id=reference-studies-bill-guo-homepage--homepage&viewMode=story).
- `bun run type-check` returned `Token parity: 27 CSS primitives and 4 font roles match TypeScript exports`, exit 0. Separate reviewer approved after focus and six-position scene fixes. Browser audit observed desktop composition, 390px layout (viewport / scroll width / study width all `390`), search / empty results / Ctrl+K / Escape, navigation panels, stamp selection, wheel search, modal focus, and reduced-motion animation `none` / transition `0s`. Extended collection rendered `6` scene stamps while retaining `7` archive entries and searchable `EXTRA FILE`.
- Screenshot and detailed JSON evidence saved outside the repository. This is an uncommitted exploration prototype for user review: no application route, database, notebook, Kensho page, font canon, or wider migration adoption. No strategic/ticket status promoted to done.

## Session 2026-10-01 18:54:10 CDT (UTC−05:00) — token parity and typography exploration

- **Running document study — 2026-10-01 19:50:17 CDT (UTC−05:00):** launched `bun run dev:app` and inspected [/document-panel](http://localhost:3000/document-panel). Next returned `GET /document-panel 200`; CDP rendered-font inspection confirmed Spectral SemiBold, Inter, Caveat, and IBM Plex Mono SemiBold for the selected heading/prose/annotation/API nodes. Fixed global paragraph tracking leaking into the prototype with a scoped reset in [`apps/app/src/styles/document-panel.css:131`](apps/app/src/styles/document-panel.css#L131). After explicit reload, computed prose/intro/subtitle tracking changed from `1px` to `normal`; eyebrow remained `1.44px`. Desktop and 390px layout inspected, narrow document width `390` matched viewport `390`; saved screenshots externally. PostCSS returned `PostCSS: parsed document-panel.css`; scoped `git diff --check` empty, exit 0; independent reviewer approved. Typography isolation only: no font selection, component adoption, full interaction audit, or broader completion claim.

- **Typography source audit — 2026-10-01 19:20:15 CDT (UTC−05:00):** inspected all 14 font-provider declarations in [`apps/app/src/app/fonts.tsx`](apps/app/src/app/fonts.tsx). Legacy Neue Haas, Monument Grotesk, Monument Mono, and Lukas variables now provide Inter, Plus Jakarta Sans, JetBrains Mono, and Space Grotesk respectively. [`apps/app/src/app/research-ui.css:400`](apps/app/src/app/research-ui.css#L400) assigns the generic mono utility to the technical stack; selected document prototypes use it for body copy. [`apps/app/src/components/design-system/research-ui/documents/reference-prototype/DocumentOne.tsx:51`](apps/app/src/components/design-system/research-ui/documents/reference-prototype/DocumentOne.tsx#L51) applies mono to header/metadata while its sibling footer falls outside that scope. Captured six evidence anchors with source hashes in an external JSON audit. Source inspection only; actual app cascade/route adoption not audited. No font replacement, canon promotion, or migration performed.

- **Concept comparison — 2026-10-01 19:17:03 CDT (UTC−05:00):** built a standalone [local comparison board](http://localhost:6008/ultraterrestrial-concept-selection.html) from six originals in [`packages/disclosure-design/canon/design-lab/`](packages/disclosure-design/canon/design-lab/). Python validation returned `Embedded source images: 6/6 byte-identical; SHA-256 matches`. Running browser audit exercised all six images, note/shortlist persistence, shared-reference synchronization, zoom, and manual JSON export; desktop light/dark and narrow layout inspected. Test choices cleared. The Roswell source is a photographic collage with typed fields and paragraphs, not a fully typed document page. No visual winner, canon promotion, or legacy migration selected; broader goal remains open.

- **User clarification — 2026-10-01 19:00:56 CDT (UTC−05:00):** still selecting preferred visual concepts; legacy document code is implementation history, not a final typography decision. Canon promotion and broad migration remain open. Corrected the archival panel default from dark ink on dark panel (regression: `1.09:1`) to existing light paper text. Register headings now inherit the real pair. `bun run test:tokens` → `Ran 10 tests`, `OK`; typecheck/parity exit 0; live guide and separate reviewer confirmed this narrow correction.

- Preserved runtime CSS as current token truth while keeping generated mockups, chat decisions, and stored canon distinct. No new final typography ruling or app-wide migration. CSS/TypeScript parity generation and its gate live in [`packages/disclosure-ui/scripts/sync_tokens.py`](packages/disclosure-ui/scripts/sync_tokens.py).
- Added an editable review story at [`packages/disclosure-ui/src/style-guide/typography-specimen.stories.tsx`](packages/disclosure-ui/src/style-guide/typography-specimen.stories.tsx): clean Courier New document body, Special Elite ink impression, JetBrains Mono notation, and modern system UI. Four candidate role exports are synchronized from CSS. Body-level host font variables resolve locally; deeper themes must redeclare dependent roles.
- `bun run test:tokens` → `Ran 9 tests`, `OK`; `bun run type-check` → `Token parity: 27 CSS primitives and 4 font roles match TypeScript exports`, exit 0; package-scoped `git diff --check -- .` → empty output, exit 0. Separate read-only code reviewer approved after the font-scope correction.
- [Running Storybook comparison](http://localhost:6007/iframe.html?id=style-guide-typography-roles--comparison&viewMode=story) visually inspected at desktop and 390px: identical edits update four bodies, 14/16/18 px selections apply, and narrow layout has one column with page width equal to viewport width. Rendered font inspection confirmed Courier New, custom Special Elite, custom JetBrains Mono, and SF NS. Screenshots saved outside repo in the task visualization directory. Full-app typography adoption and broader design-drift reconciliation remain **UNVERIFIED / OPEN**; user design acceptance remains pending.

## Session 2026-09-30 01:13:15 CDT (UTC−05:00) — park Jev, switch focus to UI

- User deferred T-067. Preserve the native helper and offline evidence in [`packages/ai/tools/jev/README.md`](packages/ai/tools/jev/README.md); no live call is approved or required for UI work.
- UI target and desired change await user clarification. No UI implementation has been started.

## Session 2026-09-29 23:47:35 CDT (UTC−05:00) — native Jev helper, T-067

- Added gateway-only, advisory intercept/verify CLI and typed schemas at [`packages/ai/tools/jev/README.md`](packages/ai/tools/jev/README.md), with provisional thresholds and human-labelled Brier review. Coding-agent chat model unchanged; no vendor skill installed.
- Offline tests exercise request bounds, causal state, uncertainty, active-key rejection, contradictory responses, deadlines and no retries. Independent review findings addressed in regression tests.
- Live calls remain pending explicit user approval and locally configured `EXPERIENTIAL_API_KEY`. No live response, calibration dataset or exact tokenizer is available: integration remains UNVERIFIED. Existing unrelated shared-tree edits were preserved.

## Session 2026-09-29 15:30 CDT (UTC−05:00) — record that Upstash is dead

- Wrote [`docs/issues/2026-09-29-upstash-sync-reports-success-but-accounts-are-dead.md`](docs/issues/2026-09-29-upstash-sync-reports-success-but-accounts-are-dead.md). Both Upstash accounts have been gone for about six months, so the "Upstash sync ✅" lines are false.
- Added warning banners to [`apps/disclosure-rag/STATUS.md`](apps/disclosure-rag/STATUS.md), [`apps/disclosure-rag/docs/INTEGRATION_STATUS.md`](apps/disclosure-rag/docs/INTEGRATION_STATUS.md), [`apps/disclosure-rag/README.md`](apps/disclosure-rag/README.md), and a note in [`docs/plans/TODO.md`](docs/plans/TODO.md).
- No code, credentials, or `dy` runs touched. Open decision: retire Upstash (recommended) or revive it.
- **Update 2026-10-07:** Upstash provider confirmed revived and live by Liam; retire-vs-revive determination still pending (revival would likely start from scratch). Recorded in the issue file and [`docs/plans/TODO.md`](docs/plans/TODO.md). No code re-wired.

## Session 2026-09-28 17:10 CDT (UTC−05:00) — ticket pipeline correction

- Four read-only reviews compared [`docs/plans/`](docs/plans/), [`docs/dogfood-output/`](docs/dogfood-output/), and [`docs/archive/vision/`](docs/archive/vision/) to [`docs/plans/TODO.md`](docs/plans/TODO.md).
- Corrected the lane table: T-053 is merged into T-050, T-061 is active, and T-062 through T-065 are listed. H1 is md5 with the UNIQUE constraint still blocked. T-050 subtasks 3 and 6 are on disk and unverified.
- [`docs/plans/FEATURES.md`](docs/plans/FEATURES.md) pipeline no longer offers T-053 as ready to claim. [`docs/README.md`](docs/README.md) now indexes the load-bearing plans.
- No code, tests, or dogfood run. Untracked leftovers, not opened as tickets: (1) prompt-cache live smoke plus an unimported `frontendTools` call in the Prometheus chat route, (2) dead CLI leftovers from the 2026-07-09 ingestion audit, (3) Vision Phase 2 claims/theories. Finished plans still in `docs/plans/` stay put until Liam says to archive them.
- Shared with Claude Code as memory `ticket-pipeline-correction-2026-09-28` (indexed first in that project's `MEMORY.md`). Do not reopen T-053.

## Session 2026-09-28 16:50 CDT (UTC−05:00) — register the playlist postmortem

- Opened **T-066** in [`docs/plans/TODO.md`](docs/plans/TODO.md) from [`docs/issues/2026-08-14-playlist-ingestion-postmortem.md`](docs/issues/2026-08-14-playlist-ingestion-postmortem.md). The issue file now points back at T-066.
- Still open on that ticket: stage-2 promotion into Neon, a real transcript cache, exception text on fetch failures, the 51-episode refetch, schema enforcement past `rag_ingestion`, and the gate-5 loose ends. No ingest was run.

## Session 2026-09-27 18:15:30 CDT (UTC−05:00) — review Claude's donor-overlap audit

- Read the user-supplied conversation as review material and checked current source. Its selective-reuse direction is reasonable; the stated 80% Observatory / 15% God's Eye View overlap and half-day/two-hour port estimates have no measurable acceptance inventory behind them. Similar component names and installed dependencies do not prove interaction or integration parity.
- **Concrete correction:** the existing [`apps/app/src/features/guided-tours/nuclear-shadow/nuclear-shadow.definition.ts`](apps/app/src/features/guided-tours/nuclear-shadow/nuclear-shadow.definition.ts) has eight waypoints about secrecy architecture, ending at Roswell. It does not contain the prototype's Malmstrom/Rendlesham sequence. Same tour title does not mean the same investigation already ships. Five Nuclear Shadow test files exist; no tests were executed during this review.
- **Contract ownership:** `CorpusAnchor` is defined by [`apps/app/src/features/guided-tours/shared/types/tour-definition.ts`](apps/app/src/features/guided-tours/shared/types/tour-definition.ts). [`apps/app/src/features/spacetime/components/waypoint-narrative.tsx`](apps/app/src/features/spacetime/components/waypoint-narrative.tsx) uses temporal stations and the Spacetime store; it does not consume that tour contract. The prototype source tray browses/selects per-waypoint source records and opens an evidence reader; Spacetime's evidence-layers panel filters events. They are not equivalent features.
- **Existing reuse to preserve:** the tour contract already includes `narrative.question`, `narrative.handoffQuestion` and `epistemic.openQuestions`; adding another questions field is not automatically necessary. [`apps/app/src/features/mindmap/tours/tour-chips.tsx`](apps/app/src/features/mindmap/tours/tour-chips.tsx) and the shared tour registry already provide launch infrastructure. An investigation library would improve presentation and discovery rather than invent tour launching. Current prototype [`apps/temporal-observatory/lib/demo-data.ts`](apps/temporal-observatory/lib/demo-data.ts) derives displayed layer counts from enriched demo sources; preserve derived counts when adapting real data.
- **Separate prototype:** [`apps/temporal-observatory/`](apps/temporal-observatory/) is distinct from the older research-platform prototype. Source confirms four modes, conditional globe mounting and explicit demonstration records. Local checks found no package manifest or installed Next entry in its own node_modules; it is untracked. This prevents a normal standalone package launch, not source review or selective adaptation. No secret values were read.
- **Recommendation, not an implementation decision:** reuse the existing investigation/tour contract and launch registry, adapt the prototype's choose-investigation → navigate → chapter → evidence flow, and implement any geographic view through the existing Spacetime renderer. Avoid another persistent store or third globe renderer without demonstrated need. A note that consolidation was not approved is a status record, not a permanent design prohibition; existing canvas ownership remains the current decision until intentionally revised.
- God's Eye View annotations, scene/camera modules and label arbitration exist on disk, but their suitability, coverage and the advertised live-feed count were not runtime-verified here. Existing Cesium temporal-parity gap still stands. No product files changed, no new app started, and no runtime comparison or test-suite run performed; this review establishes source facts only.

## Session 2026-09-27 18:11:23 CDT (UTC−05:00) — launch Spacetime UI

- Started `bun run dev --port 3002` from [`apps/app/`](apps/app/), preserving the unrelated portfolio server on port 3000. Output: `Ready in 3.4s`; `GET /spacetime?engine=cesium 200 in 14691ms`.
- Opened [Spacetime Cesium demo](http://localhost:3002/spacetime?engine=cesium) in a visible retained browser tab. Screenshot confirmed satellite imagery, the Houston camera readout, guided-investigation list, layers and temporal dial. The narrow Codex panel visibly compresses/overlaps the desktop layout; requested bottom-panel placement for a wider view, returned `queued`.
- Left the server running. Launch/display verification only; no product changes or full acceptance audit.

## Session 2026-09-27 17:34:50 CDT (UTC−05:00) — Spacetime status review

- User requested an update. `git log --since=2026-09-14 --date=short --format='%h %ad %s' -- apps/app/src/features/spacetime apps/app/src/features/research-platform apps/app/src/features/research-canvas apps/app/src/features/sightings` returned `74ab227a 2026-09-24 feat(spacetime): add Cesium as a selectable globe engine`. The demo adapter, route wiring and asset preparation are now committed; the September 13 guide's untracked-source observation is historical.
- Current source still defaults to Mapbox and selects Cesium with `?engine=cesium`. The 248-line adapter retains Esri imagery, Houston camera seed, existing event filters and selection flight; it still has no temporal-cursor subscription. Typed customization, tactical treatment, shared camera controls, performance acceptance and a Spacetime Storybook story remain open. No product source was changed or runtime acceptance claimed in this review.
- The requested unified rendered instructional package remains undelivered. Agent/doc/tracker pointers exist, but six checked design-reference paths in [`apps/app/src/features/spacetime/README.md`](apps/app/src/features/spacetime/README.md) no longer exist under the former package name. Current design pointer: [`docs/design/README.md`](docs/design/README.md); storyboard images remain in [`docs/vision/storyboards/`](docs/vision/storyboards/) and prototype HTML in [`docs/vision/prototypes/`](docs/vision/prototypes/), with further lab material under [`packages/disclosure-design/lab/`](packages/disclosure-design/lab/). No new canonical-copy ruling or broad link repair made in this status-only pass.
- The prior demo server is not running: `lsof -a -p 47884 -d cwd -Fn` identified the current port-3000 listener as the user's separate portfolio project. Did not stop it or start another server. Last visual evidence in this task remains September 13; no browser/build/test/database-count rerun today.
- Recommended next slice: synchronize Cesium with temporal navigation, establish shared camera controls, measure the engine cost, and present the feature-local instructional package with current references and explicit live/prototype labels. These are recommendations, not completed work.

## Session 2026-09-13 23:47:11 CDT (UTC−05:00) — reopen Cesium demo

- User requested the previous demo again. Started `bun run dev --port 3000` from [`apps/app/`](apps/app/); terminal output: `Ready in 1709ms`, `GET /spacetime?engine=cesium 200 in 17306ms`.
- Opened [Spacetime Cesium demo](http://localhost:3000/spacetime?engine=cesium) in a visible Codex browser tab and retained it for the user. Screenshot confirmed Houston-area Esri imagery, Observatory shell, guided-investigation panel and temporal dial; UI reports 142 events / 104 mapped.
- Server left running. This was a launch/display check only; no product source changes or full interaction/feature acceptance audit. Existing temporal-parity gaps remain recorded in [`apps/app/src/features/spacetime/README.md`](apps/app/src/features/spacetime/README.md).

**Last updated:** 2026-09-28
**Branch:** `dev`
**Focus:** Lane A T-048 (H2 next) and T-061 · Lane B T-050 (subtasks 4, 5, 7, 8; dogfood 3 and 6), T-052, T-060 · T-066 gates the playlist batch. T-053 is merged into T-050.
**Reference:** Linear owns implementation tickets; `docs/plans/TODO.md` kept in parity. Canonical specs: `docs/plans/2026-08-09-disclosure-lab.md`, `docs/plans/2026-08-09-research-canvas-genui.md`, proposed MVP `docs/plans/2026-08-10-rc-p0-tool-cards.md`. Assembling apply: `docs/plans/AssemblingComponentsApply.md`.

## Session 2026-08-14 — T-053 tracking: grooming/review required (no product code)

**Superseded 2026-08-17.** T-053 was merged into T-050. The paragraph below is the session record, not current status.

T-053 / DMGD-219 remains **OPEN / needs grooming**. The epic (`2026-08-09-research-canvas-genui.md`) and RC-P0 ToolCards MVP (`2026-08-10-rc-p0-tool-cards.md`) are the canonical plans; **the idea and feature need grooming and review from the agent team before implementation.** RC-P0 is the proposed first slice, not started, and not locked-to-build until that review.

## Session 2026-08-13 — assembling-components apply (gap-fill, not a scaffold)

- Applied assembling-components to the existing Next.js 15 app. Plan: `docs/plans/AssemblingComponentsApply_PSUEDOCODE.md`. Architecture: `docs/plans/AssemblingComponentsApply.md`. FEATURES Decision 13.
- Wired `--color-*` / `--spacing-*` / `--font-size-*` / `--radius-*` / `--shadow-*` / `--chart-color-*` / `--z-*` / `--duration-*` as aliases on `@repo/disclosure-ui` `--du-*`.
- Root layout: tokens → globals import order; `data-theme` + `class`; `ToastProvider`; `prefers-reduced-motion` in `globals.css`.
- `validate_tokens.py` errors = 0 on disclosure-ui tokens + new feedback/dashboard CSS. Full-app hex migration remains open.
- **UNVERIFIED**: `next build` / visual dogfood not run this session.

## Current state — 2026-08-10 (historical snapshot, superseded 2026-09-28)

Use the lane table in [`docs/plans/TODO.md`](docs/plans/TODO.md). This table is the 2026-08-10 record. T-053 is merged. H1 landed on md5. T-050 subtasks 3 and 6 are on disk and unverified.

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

**Session memory — 2026-09-13 12:09:13 CDT:** User placed God’s Eye View at [`apps/gods-eye-view-main/`](apps/gods-eye-view-main/). Inspected its current modular layout: [`apps/gods-eye-view-main/src/app/application.js`](apps/gods-eye-view-main/src/app/application.js) and [`apps/gods-eye-view-main/src/app/viewer.js`](apps/gods-eye-view-main/src/app/viewer.js) are the only immediate architectural donors. The 90 MB checkout, its third-party datasets/assets/models, provider server, and DOM-bound shell are excluded. Updated [docs/plans/2026-09-10-gods-eye-view-integration.md](docs/plans/2026-09-10-gods-eye-view-integration.md). Planning only; no product code changed and runtime remains UNVERIFIED.

**Session memory — 2026-09-13 14:59:01 CDT:** Implemented the first lean God’s Eye View extraction: [`apps/app/src/features/spacetime/components/cesium-spacetime-globe.tsx`](apps/app/src/features/spacetime/components/cesium-spacetime-globe.tsx) loads Cesium only for `?engine=cesium`, uses the existing curated Spacetime event corpus, seeds the supplied Houston camera position, and shows provider attribution. [`apps/app/scripts/prepare-cesium-assets.mjs`](apps/app/scripts/prepare-cesium-assets.mjs) stages runtime assets before dev/build without tracking them. Dogfooded default Mapbox and Cesium renderer routes; the Cesium route displayed Esri imagery, exact 30.0059° N / 95.3506° W / 6.1 km readout, event controls, and Esri/Cesium attribution. Production build, lint, formatting, filtered TypeScript check, generated-asset ignore rule, and diff whitespace check passed. Final production-build retries then encountered missing generated Next route files because another app-local `next dev` process was concurrently writing [`apps/app/.next/`](apps/app/.next/); this is an environment verification constraint, not a Cesium compilation failure. The renderer is intentionally a narrow spike: no donor feeds, services, bulk data, tactical HUD, lens presets, or full donor shell were imported.

**Architecture audit / correction — 2026-09-13 15:27:45 CDT:** The user flagged ambiguous ownership across Research Canvas, research-platform, sightings, and Spacetime. Git records [`apps/app/src/features/spacetime/`](apps/app/src/features/spacetime/) as a greenfield T-047 implementation from August 1, 2026 (`a9ff0b3d`), predating this Cesium session. The [implementation plan](docs/plans/2026-08-01-spacetime-canvas-implementation.md) explicitly calls Temporal Observatory the feature family and Spacetime Canvas its first surface. [`apps/app/src/features/research-platform/`](apps/app/src/features/research-platform/) contains four presentation prototypes with Storybook fixtures; source search found no consumers outside that directory in app code. Its Temporal Observatory uses pixel-positioned points and CSS land, not a geospatial renderer. The live Research Canvas route renders [`apps/app/src/features/mindmap/mind-map.tsx`](apps/app/src/features/mindmap/mind-map.tsx); the separate [`apps/app/src/features/research-canvas/`](apps/app/src/features/research-canvas/) directory is older component/prototype material, not that route's owner. Standalone sightings and the mindmap's sightings view have separate UI/data adapters; Spacetime reuses an events query service but not their navigation state. God’s Eye View was consulted for viewer configuration; no donor module was imported or transplanted. Today's change is a newly written Cesium adapter against the npm dependency and existing Spacetime UI. Calling it an extraction overstated reuse. Cesium currently observes event selection and evidence filters, but does not subscribe to the temporal cursor as the Mapbox renderer does: timeline-to-camera parity remains open. This audit inspected source/imports/history only; it made no product-code changes and did not rerun browser validation.

**Source-local instructional documentation — 2026-09-13 16:44:15 CDT (UTC−05:00):** Updated the existing [`apps/app/src/features/spacetime/README.md`](apps/app/src/features/spacetime/README.md) as the combined Research Canvas + Spacetime / Temporal Observatory / God's Eye View entry point, with purpose, live-source versus prototype/proposal distinctions, current docked shell, Cesium time limits, donor provenance, verified design-lab locations and labelled Storybook references. Added narrowly scoped guide context to [`apps/app/src/features/mindmap/CLAUDE.md`](apps/app/src/features/mindmap/CLAUDE.md), plus pointers/current-state corrections in [`docs/README.md`](docs/README.md), [`AGENTS.md`](AGENTS.md), [`docs/PLANS/FEATURES.md`](docs/PLANS/FEATURES.md), [`docs/PLANS/TODO.md`](docs/PLANS/TODO.md) and [`docs/PLANS/2026-09-10-gods-eye-view-integration.md`](docs/PLANS/2026-09-10-gods-eye-view-integration.md). Local history resolves the August 1 scaffold (`a9ff0b3d`) and subsequent product shell (`09bf6149`), confirming Spacetime predates donor work.

**Pending, not delivered:** the unified rendered instructional presentation requires the user's format decision; links alone do not satisfy it. Final design/UX expectations and any prototype consolidation remain open. This pass changed documentation only, created no new docs/app/framework, moved no assets and performed no runtime test, browser audit, build, Storybook run or database measurement. Pre-existing dirty changes and concurrent reorganization were preserved; no commit or push was made. **Verification — 2026-09-13 16:47:03 CDT (UTC−05:00):** OpenKnowledge `exec` rereads and two explicit-root `ls -d` checks found all newly introduced link targets on disk. `git diff --check -- AGENTS.md DAILY_WORK_PLAN.md docs/README.md docs/PLANS/FEATURES.md docs/PLANS/TODO.md docs/PLANS/2026-09-10-gods-eye-view-integration.md apps/app/src/features/spacetime/README.md apps/app/src/features/mindmap/CLAUDE.md` returned no output, exit 0. OpenKnowledge's link checker is **not green**: it resolves the binding repo-root href convention relative to each document and truncates route-group paths at parentheses, so its warnings are not a reliable filesystem verdict here. No configuration or link convention was changed. Pre-existing missing targets remain outside scope: the old document-UI reference-prototype pointer in [`AGENTS.md`](AGENTS.md) and the methodology pointer in [`docs/README.md`](docs/README.md); exact missing paths are included in the handoff. No unresolved human-review comments were reported on the inspected docs.
