# God’s Eye View → Spacetime Canvas integration

Updated: 2026-09-13 16:44:15 CDT (UTC−05:00) · Lane B · Status: proposal with a source-present experimental adapter; runtime UNVERIFIED in this documentation pass.

## Current-state correction — 2026-09-13 16:44:15 CDT

Read [`apps/app/src/features/spacetime/README.md`](apps/app/src/features/spacetime/README.md) first for the source-local instructional guide, ownership map, design references and open decisions. Spacetime predates this donor review. The current `?engine=cesium` branch is a newly written, reference-informed adapter using the Cesium npm dependency and existing Spacetime events/state, **not transplanted God’s Eye View source**. Its component was untracked when inspected: [`apps/app/src/features/spacetime/components/cesium-spacetime-globe.tsx`](apps/app/src/features/spacetime/components/cesium-spacetime-globe.tsx).

The source implements Esri imagery, the supplied camera seed, attribution, event filtering, picking and selection flight. It does not consume `temporalCursor`; timeline-to-camera and time-window parity are open. No donor shell, feed backend, tactical HUD, share/hash parser or typed customization interface was imported or implemented. Mapbox remains the default. The extraction ruling below is an admission policy and reference plan, **not a report that its destinations have landed**.

No product or Storybook test was performed in this docs pass. Prior session browser reports remain historical evidence in [`DAILY_WORK_PLAN.md`](DAILY_WORK_PLAN.md). Final UX expectations, any prototype consolidation, default-engine replacement and the requested unified rendered documentation format remain unresolved; this guide does not approve them.

## Recommendation — remaining proposal, not acceptance

Integrate a Cesium renderer into `/spacetime`, behind an engine flag initially. Retain the existing temporal cursor, normalized evidence, guided navigation, and research workflow. Extract the donor’s engine capabilities and tactical presentation into composable modules. A permanent iframe would preserve the donor quickly but split selection, time, navigation, accessibility, and deployment into two applications. A wholesale import would also carry substantial unrelated backend machinery.

The first milestone should reproduce the supplied camera and visual preset, then display real curated events and support selection. Keep Mapbox available until the new renderer passes visual and functional parity. Only mount one engine at a time.

## Binding scope refinement — 2026-09-10 01:35:57 CDT

User requirement: imported source and features must be extremely lean and Ultraterrestrial-specific or customizable. This supersedes any implication below that donor feature parity or its full panel/state system is required.

- **Import admission rule:** each module must support a named Ultraterrestrial user action, identify its dependencies, and justify why existing app code cannot serve it. Extract the smallest useful implementation; adapt or rewrite tightly coupled donor code when extraction would drag in unrelated subsystems. Preserve applicable attribution for copied or adapted code.
- **Initial scope:** Cesium lifecycle and camera; one imagery provider; curated event rendering/picking; essential geographic readouts; optional scope and sharpening; existing time, selection, and research integration. Cesium itself is a substantial dependency: lazy-load it, measure its production bundle and runtime costs, and keep it off unrelated routes.
- **Customize through typed props and small configuration objects:** palette tokens, readout fields, overlay visibility, density, motion, camera presets, and layer definitions. Use existing UI primitives and explicit extension points for record selection/source access. No general plugin framework, schema-driven dashboard builder, or duplicate global store.
- **Default exclusions:** donor application shell, global CSS, DOM-ID bindings, panel registry, key setup, voice assistant, radio, CCTV, traffic simulation, bike sharing, decorative visual modes, and unused scenes/assets. Do not import the donor layer manager or detection engine merely to draw evidence markers. A disabled feature still costs code if it is bundled; excluded features must be absent from the dependency graph.
- **Reference fidelity is selective:** preserve the requested camera, imagery, and desired tactical treatment, translated into Ultraterrestrial controls. The supplied hash is a reference fixture, not a mandate to support every donor parameter. Parse only supported fields; report unsupported options rather than implementing their subsystems. Ship an Ultraterrestrial snapshot format without the donor panel registry.
- **Feeds are optional proposals:** military facilities, aircraft, and satellites require a concrete investigation use case before implementation. They are not committed roadmap scope. Each enabled adapter owns cancellation, freshness, temporal semantics, and attribution; no background polling while disabled.
- **Lean acceptance gate:** review the actual import graph, production chunk sizes, copied assets, and active requests/timers. Document every new dependency and its consumer. No unused donor modules, duplicate styles/state, or unrelated requests. Keep the Mapbox fallback only for the migration period; decide its retirement after parity and user acceptance rather than maintaining two engines indefinitely.

## Donor extraction ruling — 2026-09-13 12:09:13 CDT

The source is now available in [`apps/gods-eye-view-main/`](apps/gods-eye-view-main/). It is a **donor repository**, not an app to make part of this monorepo. Its checkout is 90 MB, its source tree is 16 MB, and its bundled datasets, runtime providers, and models carry licenses distinct from the MIT source license. Leave its directory untouched and out of the application dependency graph.

The donor is newer and better structured than the first source review indicated: [`apps/gods-eye-view-main/src/main.js`](apps/gods-eye-view-main/src/main.js) is a 17-line standalone entrypoint, while [`apps/gods-eye-view-main/src/app/application.js`](apps/gods-eye-view-main/src/app/application.js) has a clean abort-aware lifecycle and [`apps/gods-eye-view-main/src/app/viewer.js`](apps/gods-eye-view-main/src/app/viewer.js) owns a small Cesium viewer factory. Those are useful reference material. The implementation should reproduce their contracts in TypeScript under [`apps/app/src/features/spacetime/`](apps/app/src/features/spacetime/), not import their application shell.

| Candidate donor material | Decision | Ultraterrestrial destination |
|---|---|---|
| Cesium viewer construction | Reimplement, then validate against the donor factory | client-only `CesiumSpacetimeGlobe` |
| Abort-aware lifecycle order | Adapt the pattern; React owns mount/unmount | renderer controller hook |
| Explicit idle rendering | Adapt only after the baseline renderer works | Cesium render scheduler |
| Camera/hash parsing | Extract only camera fields we support; write a new snapshot schema | Spacetime URL adapter |
| Visual effects / cockpit HUD | Recreate a small prop-driven treatment using UT tokens | optional tactical overlay |
| Imagery-provider switcher | Reimplement a minimal Esri-first control | map source control |
| Data layers, detections, voice, panels, scenes, standalone server, bundled datasets/models | Exclude | none |

Do not copy [`apps/gods-eye-view-main/src/data/infrastructure.js`](apps/gods-eye-view-main/src/data/infrastructure.js): it pulls bundled third-party geographical datasets. Do not copy any [`apps/gods-eye-view-main/server/`](apps/gods-eye-view-main/server/) provider by default. The donor's [`apps/gods-eye-view-main/LICENSE`](apps/gods-eye-view-main/LICENSE) permits source adaptation with notice retention, but expressly excludes third-party data, assets, and models from that grant.

## Grounded findings

- Donor location supplied by the user: [`apps/gods-eye-view-main/`](apps/gods-eye-view-main/). Its package declares vanilla JavaScript, Vite 6, Cesium ^1.124.0, satellite.js, and MIT licensing. Its local LICENSE names Bilawal Sidhu. Preserve the notice with extracted code; separately inventory imagery and dataset attribution requirements.
- The current donor is modular: its standalone entrypoint delegates to application, viewer, UI, data, server-provider, and source modules. Its app factory and viewer factory are separable, but the product shell remains DOM-bound and non-React.
- Its checkout includes 90 MB, including dependencies and third-party data/assets. The source tree alone is 16 MB. That is direct evidence for extraction, not import.
- Donor sharelink.js owns versioned camera, effects, layer, scope, and panel state. renderGovernor.js owns module-global viewer/hold state: extraction must make lifecycle ownership explicit.
- Existing [`apps/app/src/features/spacetime/components/spacetime-canvas.tsx`](apps/app/src/features/spacetime/components/spacetime-canvas.tsx) composes the map with research chrome. [`apps/app/src/features/spacetime/components/spacetime-globe.tsx`](apps/app/src/features/spacetime/components/spacetime-globe.tsx) implements Mapbox rendering.
- [`apps/app/src/features/spacetime/lib/map-controller.ts`](apps/app/src/features/spacetime/lib/map-controller.ts) exposes a Mapbox instance directly. Controls therefore need an engine-neutral interface before switching renderers.
- [`apps/app/src/features/spacetime/actions/load-spacetime-events.ts`](apps/app/src/features/spacetime/actions/load-spacetime-events.ts) already provides bounded curated events; retain this path. No live database counts were measured during this review.
- The existing contract is one temporal cursor in [`apps/app/src/features/spacetime/state/spacetime-store.ts`](apps/app/src/features/spacetime/state/spacetime-store.ts). Preserve the docked, interactive map structure established in [`docs/plans/2026-08-07-spacetime-canvas-storyboard-realignment.md`](docs/plans/2026-08-07-spacetime-canvas-storyboard-realignment.md).

## Supplied preset: initial acceptance fixture

Camera: latitude 30.0059, longitude -95.3506, altitude 6,143 metres, heading 0°, pitch -35°, roll 360° (equivalent to 0°). Donor serialization reads camera.positionCartographic.height: treat altitude as ellipsoidal camera height, not terrain clearance.

Presentation: Esri imagery; normal style; bloom off; sharpening on at 49; tactical HUD visible; detection mode DENSE, density 75, elastic allocation; keyhole fade 7 and outside opacity 1; celestial ring off; scope on with feather 11. Keep the supplied compact layer/panel encoding in the reference fixture only; document unsupported fields without importing the donor registry. Do not silently enable feeds based only on the detection settings.

This preset does not require Google photorealistic 3D tiles. Esri imagery plus terrain and Google 3D are distinct map capabilities; offer Google 3D later as a provider option. First visually inspect the running donor to establish exact layout and behavior before claiming fidelity.

## Architecture and ownership

Keep feature-local implementation under [`apps/app/src/features/spacetime/`](apps/app/src/features/spacetime/); introduce a shared package only when another actual consumer needs it.

1. **Renderer controller:** mount/destroy, readiness/error, flyTo/cancelFlight, zoom, north/reset, camera subscription, event updates, selection, resize, and render request. Wrap current Mapbox behavior first; implement Cesium against the same contract. Keep mutable engine objects outside Zustand.
2. **Camera model:** explicit geographic position, altitude datum, heading, pitch convention, roll, and target/range where applicable. Mapbox zoom/pitch are not interchangeable with Cesium height/pitch. Preserve engine-specific camera details for round-trip restore and specify conversions explicitly. Throttle camera readouts; never feed every frame through React.
3. **Evidence adapter:** convert SpacetimeEvent records into Cesium entities/primitives with stable source IDs, precision/uncertainty styling, selection, and source access. Missing coordinates stay discoverable in the temporal list; never invent locations. Do not map the current three epistemic statuses into eight categories without a separate terminology ruling.
4. **React presentation:** tactical readout, scope overlay, map-source control, layer controls, and contextual labels receive props and emit intents. Scope CSS and keyboard handlers to the feature. Keep the map hit-testable; decorative overlays must not consume pointer events. Include Storybook states for each new UI component.
5. **Session serialization:** a validated, versioned Spacetime snapshot owns camera, temporal cursor, selected event, layers, and visual preset. Import only the supported camera/visual fields from the legacy GEV hash through a small adapter. One owner writes the URL; restore must finish before default tour/camera effects run. User gestures cancel stale restoration and flights.
6. **Research bridge:** selecting a geographical record can add its canonical record reference to the Research Canvas and return with the same time/view. Reuse existing research-session and graph insertion mechanisms after inspecting their current contracts; do not create a parallel research agent.

## Delivery sequence

| Slice | Work | Exit criteria |
|---|---|---|
| GEV-0: reference + build spike | Capture donor screenshot/interactions at supplied preset; inventory extracted modules, actual lockfile versions, assets and providers; mount client-only Cesium behind `/spacetime?engine=cesium` | Next development and production builds load workers/assets; real imagery visible; repeated enter/leave destroys viewer and listeners; explicit provider failure state |
| GEV-1: camera + evidence parity | Introduce renderer controller; preserve Mapbox adapter; implement Cesium camera, picking, real event rendering, filters, guided/free cursor behavior | Both renderers support controls, event selection, filtering, and chapter navigation; selected record and time agree; camera altitude is truthful |
| GEV-2: tactical preset | Port normal/sharpen treatment, scoped HUD, scope mask, provider switcher, legacy hash import and versioned export | Supported camera and tactical treatment visually matched within Ultraterrestrial chrome; reload/back-forward restore; HUD does not block map; reduced motion and narrow screens audited |
| GEV-3: research workflow | Add selected event to investigation; source access; restore geographical context; waypoint camera handoff | Place → record → evidence → research canvas → return walked end to end; missing source/coordinate cases explained |
| GEV-4: optional contextual feeds | Only after a named investigation use case is accepted, consider one provider at a time: military installations, aircraft, satellites; later ships/earthquakes if useful | Source/time/freshness and modeled status visible; failure, disable, cancellation, and resource cleanup tested; historical mode never implies current feeds are historical evidence |
| GEV-5: promotion | Performance, accessibility, deployment, and visual regression audit; user review | Per-path evidence report and user acceptance before changing default; rollback remains available |

GEV-0 → GEV-1 → GEV-2 is the first useful release candidate. GEV-3 makes it an investigation tool. GEV-4 is a separate expansion, not a dependency of the globe/HUD.

Indicative effort, not a commitment: 1–2 engineering days for GEV-0, 3–5 for GEV-1, 3–5 for GEV-2, 2–4 for GEV-3, plus 2–3 for hardening. Re-estimate after the first spike and visual review; feed work is additional and provider-dependent.

## Backend and data boundaries

Migrate only endpoints needed by an enabled layer into explicit Next server adapters. Allowlist upstreams and validate bounds/time/IDs; cache and bound requests, cancel obsolete work, and expose truthful stale/unavailable states. Server credentials stay server-side; browser map tokens must be provider-approved and restricted. Never port the donor’s local key-writing/setup endpoints into the hosted app.

AIS and any other persistent upstream connection need a suitable persistent service or managed stream, not an assumed long-lived Next request. Decide hosting only when enabling that layer. Do not move the donor’s entire Vite server into the monorepo.

Historical time is authoritative for evidence. Live aircraft belong to a clearly labeled present-day context mode. Propagated satellite positions are modeled, and the donor’s simulated traffic fallback is simulation. Detection boxes and presentation density are not sensor detections or evidentiary weight. Modern satellite imagery/3D geometry must remain labeled as modern context when viewing historical cases. TemporalLayerFeature already provides validity fields in [`apps/app/src/features/spacetime/types/spacetime.ts`](apps/app/src/features/spacetime/types/spacetime.ts).

## Build, performance, and verification

Load Cesium only in the client renderer boundary. Serve its matching Workers, ThirdParty, Assets, and Widgets directories with a stable CESIUM_BASE_URL before engine import, following [Cesium’s official quickstart](https://cesium.com/learn/cesiumjs-learn/cesiumjs-quickstart/). Test the actual Next development and production bundlers; a working Vite donor does not establish Next compatibility.

Adapt the donor’s render governor to per-viewer lifetime: idle uses requestRenderMode, active motion holds continuous rendering, all mutation paths request a frame. This follows [Cesium’s explicit rendering model](https://cesium.com/blog/2018/01/24/cesium-scene-rendering-performance/). Benchmark on named hardware with the same camera, corpus, and layers. Target responsive interaction at >=30 FPS on the agreed baseline device and near-idle rendering at rest; measure rather than assert. Check resource growth across ten route mount/unmount cycles.

Meaningful tests: camera conversion and angle normalization; malformed/legacy hash migration; restore-vs-user navigation races; adapter lifecycle; event ID/pick parity; temporal validity; unavailable providers and stale feeds. Run targeted tests/lint and production build, then record actual command output and scoped failures.

Mandatory visual paths: exact supplied view; pan/zoom/rotate; event pick and source; chapter advance; exact date and range; filter selection removal; share/reload/back-forward; imagery failure; route leave/return; reduced motion; keyboard navigation; narrow viewport; research handoff; live-vs-historical mode when feeds arrive. Preserve visible source attribution in all display modes. No feature completion claim before [`.agents/rules/DEFINITION_OF_DONE.md`](.agents/rules/DEFINITION_OF_DONE.md) gates and user acceptance.

## Review evidence and open work

- Command: `wc -l apps/gods-eye-view-main/src/{main.js,sharelink.js,renderGovernor.js,mapStackController.js} apps/gods-eye-view-main/vite.config.js`. Actual output: `17`, `617`, `146`, `494`, and `3` lines respectively. This is a newer source layout than the previous external copy reviewed on 2026-09-10.
- Command: `du -sh apps/gods-eye-view-main` and `du -sh apps/gods-eye-view-main/{public,src,server}`. Actual output: `90M` checkout; `3.2M` public assets; `16M` source; `536K` server.
- Source reads confirmed the module boundaries and current Mapbox coupling above. No production code changed, no dependencies installed, no database writes, no deployment, no feed runtime test, and no implementation tickets published externally.
- Browser entry attempt for the supplied localhost URL returned: `No browser is available`. The donor and integrated app therefore remain visually UNVERIFIED in this session. Source analysis is sufficient for this proposed plan, not for a fidelity claim.
- Existing worktree contains extensive concurrent changes. Implementation must preserve them and avoid stash/reset.
- Memory: user wants this exact God’s Eye View preset integrated into the existing app. Recommendation is Spacetime engine + tactical presentation + evidence bridge; not a standalone OSINT product. This is a proposal, not an accepted replacement of the current architecture.
