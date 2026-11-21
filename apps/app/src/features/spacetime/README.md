# Research Canvas + Spacetime Canvas — start here

**Updated:** 2026-09-13 16:44:15 CDT (UTC−05:00). **Status:** source-verified orientation; runtime UNVERIFIED in this documentation pass. Existing browser reports are historical evidence, not a new validation.

Use this source-local entry point to distinguish the working route owners from visual references and proposals. Research Canvas organizes ideas, entities and relationships; Spacetime Canvas organizes evidence geographically and temporally. They are sibling research surfaces, not two names for one implementation.

## Read the feature in three steps

1. Identify the route owner in the table below. For graph work, continue with [`apps/app/src/features/mindmap/CLAUDE.md`](apps/app/src/features/mindmap/CLAUDE.md).
2. Compare current source behavior with the labelled design references and stories below. A mockup or story is not proof of product integration.
3. Consult the decisions and open work before implementing. **The requested unified rendered presentation remains pending the user's format decision.** This instructional guide and its links do not deliver that presentation; no runtime docs app or new framework was created.

## Surface map — source, not runtime acceptance

| Surface | Current owner and boundary |
|---|---|
| `/research-canvas` | [`apps/app/src/app/(site)/research-canvas/page.tsx`](apps/app/src/app/(site)/research-canvas/page.tsx) loads bounded graph data and renders MindMap. [`apps/app/src/features/mindmap/mind-map.tsx`](apps/app/src/features/mindmap/mind-map.tsx) supplies Graph to [`apps/app/src/features/mindmap/research-canvas/ViewSwitcher.tsx`](apps/app/src/features/mindmap/research-canvas/ViewSwitcher.tsx); active UI state selects Graph or legacy timeline/globe/search/detail peers. |
| `/spacetime` | [`apps/app/src/app/(site)/spacetime/page.tsx`](apps/app/src/app/(site)/spacetime/page.tsx) loads up to 400 events by default and renders SpacetimeCanvas. Mapbox is the default; `?engine=cesium` selects the experimental adapter. `?spike=1` selects the older measurement harness, not the product experience. |
| Temporal Observatory — family | The existing T-047 plan calls this the feature family and Spacetime Canvas its first surface: [`docs/PLANS/2026-08-01-spacetime-canvas-implementation.md`](docs/PLANS/2026-08-01-spacetime-canvas-implementation.md). The family name does not establish shared implementation with the prototype below. |
| Temporal Observatory — visual prototype | [`apps/app/src/features/research-platform/temporal-observatory/`](apps/app/src/features/research-platform/temporal-observatory/) is a separate presentation prototype. Its map uses CSS land and pixel-positioned points; story labels, source counts and evidence statuses are fixtures, not queried evidence. Source/import search in the app found no product consumer of TemporalObservatory outside that prototype tree. |
| Older Research Canvas collection | [`apps/app/src/features/research-canvas/`](apps/app/src/features/research-canvas/) is distinct from the live nested [`apps/app/src/features/mindmap/research-canvas/`](apps/app/src/features/mindmap/research-canvas/). The route imports mindmap, not the older collection. This is an ownership distinction, not a blanket deletion ruling. |
| Standalone sightings | [`apps/app/src/app/(site)/sightings/page.tsx`](apps/app/src/app/(site)/sightings/page.tsx) and [`apps/app/src/app/(site)/sightings/realtime/page.tsx`](apps/app/src/app/(site)/sightings/realtime/page.tsx) remain separate route surfaces under [`apps/app/src/features/sightings/`](apps/app/src/features/sightings/). Mindmap's nested sightings peer is separate again. They are not aliases for Spacetime. |

### Current Spacetime behavior

[`apps/app/src/features/spacetime/components/spacetime-canvas.tsx`](apps/app/src/features/spacetime/components/spacetime-canvas.tsx) composes a **docked shell, topbar, rail, interactive map, temporal dial and waypoint narrative**, with evidence controls and event inspection. The old fixed-background / full-viewport scroll-layer description is superseded by the docked layout; see [`apps/app/src/features/spacetime/components/spacetime-canvas-shell.tsx`](apps/app/src/features/spacetime/components/spacetime-canvas-shell.tsx).

The bounded loader [`apps/app/src/features/spacetime/actions/load-spacetime-events.ts`](apps/app/src/features/spacetime/actions/load-spacetime-events.ts) reads curated events through [`apps/app/src/services/sightings/get-events.ts`](apps/app/src/services/sightings/get-events.ts), normalizes them and builds temporal stations. It is not the static sightings GeoJSON path. Standalone sightings uses a different adapter, [`apps/app/src/services/sightings/actions/events-time-chunk.ts`](apps/app/src/services/sightings/actions/events-time-chunk.ts); both reach the Postgres `getEventsByDateRange` query. Shared query/data access does **not** mean shared navigation, selection or temporal state.

[`apps/app/src/features/spacetime/state/spacetime-store.ts`](apps/app/src/features/spacetime/state/spacetime-store.ts) owns Spacetime's cursor, selection, layers and filters. The dial and waypoint narrative consume that cursor. [`apps/app/src/features/spacetime/components/spacetime-globe.tsx`](apps/app/src/features/spacetime/components/spacetime-globe.tsx) subscribes to it for Mapbox camera behavior.

### God's Eye View / Cesium — narrow experiment, not transplantation

Spacetime predates the donor work. Local history checks on this pass resolve `a9ff0b3d` to the **2026-08-01 06:39:31 −05:00** scaffold and `09bf6149` to the **2026-08-01 07:40:25 −05:00** product shell. These were checked with `git show -s` and `git log --diff-filter=A`; older tracker hashes can be invalid after history rewrites.

[`apps/gods-eye-view-main/src/app/application.js`](apps/gods-eye-view-main/src/app/application.js) and [`apps/gods-eye-view-main/src/app/viewer.js`](apps/gods-eye-view-main/src/app/viewer.js) supplied reference contracts. The new [`apps/app/src/features/spacetime/components/cesium-spacetime-globe.tsx`](apps/app/src/features/spacetime/components/cesium-spacetime-globe.tsx) is a **reference-informed TypeScript adapter using the Cesium npm dependency and existing Spacetime state**, not imported donor modules. It was untracked at inspection; surrounding route wiring was dirty before this documentation pass.

Source implements client-only Cesium loading, Esri imagery, the supplied Houston camera preset, coordinate readouts, attribution, curated-event points, click selection and flight to a selected event. It reuses layer/credibility/epistemic filtering through [`apps/app/src/features/spacetime/lib/filter-events.ts`](apps/app/src/features/spacetime/lib/filter-events.ts).

**Time limitation:** Cesium does not subscribe to `temporalCursor`; the shared evidence filter has no time-window argument. Event selection can fly its camera, but scrubbing the dial is not implemented as Cesium timeline-to-camera or time-window filtering parity. Mapbox-specific map controls are omitted in the Cesium branch. The donor shell, feeds/backend, tactical HUD, share/hash parser and proposed typed customization interface were **not** imported or implemented by this adapter. It does not reproduce the full supplied tactical preset.

## Design references and Storybook — inspect, do not treat as shipped

Paths below were checked on disk during the concurrent design-lab reorganization. They are local design/reference artifacts, not runtime imports or evidence of approved consolidation. No assets were moved in this pass.

| Material | Open / interpretation |
|---|---|
| Product vision and historical decision | [`docs/vision/TEMPORAL_OBSERVATORY.md`](docs/vision/TEMPORAL_OBSERVATORY.md) and [`docs/adr/0002-temporal-observatory-gl4ss-integration.md`](docs/adr/0002-temporal-observatory-gl4ss-integration.md): intent and historical GL4SS decision, not a current Cesium acceptance report. |
| Spacetime storyboard / prototype sources | [`packages/disclosure-design-lab/design/vision/storyboards/`](packages/disclosure-design-lab/design/vision/storyboards/) and [`packages/disclosure-design-lab/design/vision/prototypes/03-temporal-geospatial-observatory.html`](packages/disclosure-design-lab/design/vision/prototypes/03-temporal-geospatial-observatory.html). |
| Canvas + observatory HTML mockups | [`packages/disclosure-design-lab/design/mock-ups/01-living-research-canvas.html`](packages/disclosure-design-lab/design/mock-ups/01-living-research-canvas.html) and [`packages/disclosure-design-lab/design/mock-ups/03-temporal-geospatial-observatory.html`](packages/disclosure-design-lab/design/mock-ups/03-temporal-geospatial-observatory.html). These coexist with prototype copies; no canonical-copy ruling is made here. |
| Source imagery and material references | [`packages/disclosure-design-lab/design/mock-ups/`](packages/disclosure-design-lab/design/mock-ups/) contains supplied/generated images; [`packages/disclosure-design-lab/design/design-lab/textures/`](packages/disclosure-design-lab/design/design-lab/textures/) and [`packages/disclosure-design-lab/design/design-lab/mood-references/`](packages/disclosure-design-lab/design/design-lab/mood-references/) hold visual materials. Reference presence does not establish runtime use or licensing clearance. |
| Temporal Observatory story | [`apps/app/src/features/research-platform/temporal-observatory/TemporalObservatory.stories.tsx`](apps/app/src/features/research-platform/temporal-observatory/TemporalObservatory.stories.tsx), title **Features/Research Platform/Temporal Observatory**: prototype fixtures, not the live Spacetime route. |
| Research Canvas stories | [`apps/app/src/features/research-platform/living-research-canvas/LivingResearchCanvas.stories.tsx`](apps/app/src/features/research-platform/living-research-canvas/LivingResearchCanvas.stories.tsx) is the separate visual prototype; [`apps/app/src/features/mindmap/research-canvas/tool-card.stories.tsx`](apps/app/src/features/mindmap/research-canvas/tool-card.stories.tsx), title **Research Canvas/ToolCards**, exercises feature-local tool-card states rather than full-route acceptance. |

No co-located Spacetime Storybook story was found in the feature directory. Existing stories were inspected as source only; Storybook was not started or built in this pass.

## Decisions and open work

- **Retain the current sibling distinction.** No consolidation of Temporal Observatory prototypes into Spacetime, no default-engine replacement and no final design/UX direction was approved by this documentation request. Expectations, visual fidelity and desired interactions still need the user's decision.
- **Keep donor scope lean.** The source-reviewed ruling and remaining proposals live in [`docs/PLANS/2026-09-10-gods-eye-view-integration.md`](docs/PLANS/2026-09-10-gods-eye-view-integration.md). Typed customization, supported snapshot fields, HUD treatment, engine-neutral controls, temporal parity and performance/import-budget verification remain open; optional feeds require a concrete investigation use case.
- **Preserve the evidence contract.** Reconstruction generation requires an explicit action; passing a waypoint is not consent. Reconstruction, comparative analysis and guided-investigation expansion are not delivered by this docs pass. T-047's provenance-dependent work and milestone grooming remain in [`docs/PLANS/TODO.md`](docs/PLANS/TODO.md).
- **Choose the rendered documentation format.** The user wants purpose, behavior, source imagery/mockups, stories and open decisions together in one instructional presentation. This guide establishes the existing source-local entry point; the rendered presentation itself is pending format selection, not complete because links exist.
- **Verify product behavior separately.** No runtime test, browser audit, build, Storybook run or database-count measurement was performed here. All product/runtime completion gates remain unchanged. Durable work record: [`DAILY_WORK_PLAN.md`](DAILY_WORK_PLAN.md); strategic context: [`docs/PLANS/FEATURES.md`](docs/PLANS/FEATURES.md).
