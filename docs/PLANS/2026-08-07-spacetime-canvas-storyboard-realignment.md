---
status: live
role: eng
spine: do
updated: 2026-08-07 12:40 PT
---

# Spacetime Canvas — storyboard realignment (T-047)

Rebuild of `/spacetime` against the four concept boards in
[`docs/vision/storyboards/`](../vision/storyboards/) and spec §9's "Primary
interaction layout" ([`TEMPORAL_OBSERVATORY.md`](../vision/TEMPORAL_OBSERVATORY.md)).

Direct follow-on to
[`2026-08-06-spacetime-canvas-multi-agent-review.md`](./2026-08-06-spacetime-canvas-multi-agent-review.md),
which measured the shipped surface against the boards (§8a) and named the seam
itself as the thing to re-examine (§9 item 7). This does that.

**Trigger:** the product owner, on seeing the running canvas — *"The spacetime
canvas looks nothing like the provided mock ups I gave you"* — then supplied
concepts 01, 03 and 04 directly.

---

## 1. The architectural change

The canvas was a **two-layer scroll shell**: a Mapbox globe in a
`pointer-events-none .fixed.inset-0` slot with a `z-10` full-viewport
`preserve-3d` narrative scrolling over it.

It is now the **docked observatory** the boards and spec §9 both show:

```
┌───────────────────────────────────────────────┐
│ header — lockup · corpus readout · actions    │  72px
├──────┬────────────────────────────────────────┤
│ rail │  MAP — foreground, receives input      │  1fr
│ 72px │  chrome docks *inside* this region     │
├──────┴────────────────────────────────────────┤
│ ADAPTIVE TEMPORAL INSTRUMENT                  │  auto
└───────────────────────────────────────────────┘
```

This is the fix for both shipped breaks, not a patch on them. Review §8a's
finding — *"Both shipped breaks are seam defects of the substituted
architecture… Neither failure mode exists in the boarded layout"* — held:

- **Break 1** (globe accepts no input) was the `z-10` narrative layer spanning
  the frame and swallowing every pointer event. With the map as foreground and
  chrome docked into it, there is nothing to swallow them.
- **Break 2** (scroll maps to the wrong station) was `stationAtProgress(stations,
  …)` indexing the *full* station list while the UI rendered a filtered, sliced
  subset. The chapter column now indexes the exact array it renders.

The guided narrative survives as a **docked chapter column** with an explicit
`‹ n/12 ›` control (concept-02 frame 4) — scroll still advances it in `guided`
mode, per the original one-line spec, but can no longer disagree with what is
on screen.

`?spike=1` keeps the old two-layer markup, inlined locally: that harness exists
to measure WebGL-under-preserve-3d, so reusing the new shell would stop it
measuring what it claims to.

---

## 2. Board features built

| Board | Feature | File |
|---|---|---|
| 01 f1, 03 f1 | Left icon rail, 6 slots | `components/spacetime-rail.tsx` |
| 01 f1 | Observatory header + corpus readout | `components/spacetime-topbar.tsx` |
| 01 f1 | `34.0522° N …` · `ALT 35,786 KM` · `UTC …` strip | `components/viewport-readout.tsx` |
| 01 f1, 04 f2 | Compass · zoom · recenter stack | `components/map-controls.tsx` |
| 01 f1 | Bottom-left evidence key with live counts | `components/evidence-legend.tsx` |
| 01 f2 | `LAYERS` panel · layer visibility · **DENSITY** legend | `components/evidence-layers-panel.tsx` |
| 01 f2 | Milestone chips over a fine tick ruler, docked full-width | `components/temporal-dial.tsx` |
| 04 f2 | Cluster-timeline density histogram under the dial | `components/temporal-dial.tsx` |
| 04 f2–f3 | Playback transport — play · speed · event stepping · `n/N` | `components/playback-transport.tsx` |
| 01 f3 | Event Inspector with the board's stat row | `components/event-inspector.tsx` |
| 02 f4 | Chapter column with prev/next chapter control | `components/waypoint-narrative.tsx` |
| 01, 02 | Globe projection + atmosphere, halo-and-core pins | `components/spacetime-globe.tsx` |

Palette sampled from concept-01/02 and centralised in `lib/spacetime-theme.ts`
— techno-analytical register per `docs/vision/DESIGN_REGISTERS.md`. The warmer
`prototypes/03-temporal-geospatial-observatory.html` supplied the *proportions*
(72px rail, ~68px header, docked bottom instrument), not the colour.

---

## 3. Where the build departs from the boards, and why

Each of these is a case where drawing the board exactly would have meant
asserting something the data does not support. Recorded so the next reviewer
sees a decision, not an omission.

**`CREDIBILITY 72%` ring — not drawn.** The curated `events` table has no
corroboration, provenance or source-tier column (`category` is the literal
string `"famous"` on all 142 rows). The inspector keeps the board's stat cell
and prints `—` with *"corpus carries no score"*, so a researcher can see the
absence rather than merely fail to find a number. Same for `SOURCES 128`.
Returns when Lane A's provenance backfill (H4) lands.

**`CLAIMS (SUMMARY)` / `TAGS` — not drawn.** No per-claim or tag column exists.

**`RESOLUTION` cell — added, not on the board.** `timePrecision` is a real field
the normalizer computes and nothing rendered. A medieval chronicle and a 1947
press date are not the same claim about time; the inspector is where that has
to be visible. It is also now encoded on the globe: `circle-blur` scales with
precision, so a year-only record is a diffuse bloom and a day-level one is
tight. (Review §9 item 5: "unblocked, value already computed.")

**Deep-time bracket on the dial — added, not on the board.** The boards' dial
spans 1900–2024. This corpus starts at **196 CE**, and a linear axis over
196–2026 crushes every modern milestone into the last few percent of the width.
The dial opens on the dense era (~92% of records) with a
`+ 9 before 1850` bracket that widens the domain on click. Nothing is hidden —
it is scoped, and states its own count.

**`LIVE ▶` → a playback transport.** Nothing streams, so the board's live feed
is not built. But concept-04 frames 2–3's *transport* — play, speed, prev/next
event, `n / N events` — needs only timestamps, which every record has, so it is.
Its surrounding panels (`AI SYNTHESIS`, `NOTABLE CLUSTERS`, `MILITARY RESPONSE`,
sighting-type breakdown) are not: they need sensor modality, sortie counts and
cluster attribution, none of which this corpus carries.

Stepping is **event-to-event, not wall-clock**. The board plays a 24-hour flap
where uniform time-stepping always has something happening; this corpus spans
196 CE → 2026 with long empty stretches, so a uniform sweep would sit on nothing
for most of its run. Speed is labelled `1/s · 2/s · 5/s` — records per second —
rather than a `1.0×` that would imply real time.

**Relationship arcs — not built.** No relationship data on this path yet.

**Selected-event descent capped at zoom 9.5, not street level.** The corpus
geocodes to place level ("NA, United States"). A street-level descent would put
road names under a pin whose source never located it to a street.

---

## 4. Data-layer fixes found on the way

- **Every record was being filtered off the canvas.** `events` rows normalize to
  type `historical_event`, but `DEFAULT_LAYERS` had `sightings: true,
  historicalEvents: false`. The instrument read `0/142` and the globe painted no
  pins. Now `historicalEvents: true`.
- **The dial rendered 193 ticks.** A fixed decade step across 196–2026. Replaced
  with `niceYearStep()` (1/2/5×10ⁿ), so ticks stay round at any span.
- **The chapter list was the 12 *earliest* stations** — Angel hair 196 through
  Utsuro-bune 1803, nothing later, while most records sat below the fold.
  Ranking by `density` alone does not fix it: with no credibility signal,
  density is "records sharing this day", which is 1 for nearly every station, so
  the sort is a near-total tie that falls back to earliest. Chapters are now a
  stratified spread, densest-per-bucket.
- **Cursor-follow flew to a centroid of unrelated points.** Selecting the 1983
  chapter flew to 30°N 21°W — open ocean, nothing from that chapter in frame.
  A station cursor now fits bounds to the records it actually names.
- **The canvas opened already descended.** The mount-time cursor default was
  treated as a navigation. It now holds the whole-earth view until the cursor
  actually moves.
- **"Fit the mapped records in view" ignored the filters.** It fitted bounds
  over every loaded event, so with a layer or attestation filter active it
  framed space containing nothing the user could see. Now fits the filtered set.
- **`useSpacetimeStore.setState` ran in the render body.** Moved to a lazy
  `useState` initializer.

---

## 5. Evidence

Dev server: `bun run dev --port 3737` in `apps/app`, live Neon + live Mapbox
token, automation Chrome at 1600×960 unless noted. Screenshots tracked at
[`docs/dogfood-output/spacetime-canvas-2026-08-07/`](../dogfood-output/spacetime-canvas-2026-08-07/)
(`00-before.png` is the pre-rebuild state).

**Typecheck** — `npx tsc --noEmit -p tsconfig.json`, filtered to the feature:

```
$ npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E "features/spacetime"
(no output)
```

Scope: this says the feature is clean. The repo carries ~1,700 pre-existing
errors elsewhere; that baseline is unchanged and was not addressed here.

**Break 1 — globe accepts input.** All three gestures the review named
(*"click a pin, drag the map"*, plus zoom) were driven, not just hit-tested.

Hit test, `document.elementFromPoint` at three points across the map region:

```
mapCenter     {tag: CANVAS, cls: mapboxgl-canvas, pe: auto}
mapUpperRight {tag: CANVAS, cls: mapboxgl-canvas, pe: auto}
mapLowerMid   {tag: CANVAS, cls: mapboxgl-canvas, pe: auto}
```

Pin click, swept over the North America cluster until the inspector opened:

```
{hit: {x: 580, y: 322}, title: "El Indio-Guerrero UFO Crash", attempts: 6}
```

Pan — 12-step drag on `.mapboxgl-canvas-container` (mousedown on the container,
mousemove/mouseup on `document`, which is where Mapbox binds them):

```
before: 51.9820° N, 57.0232° W
after:  56.4502° N,  4.5412° E     moved: true
```

Wheel zoom — 4 × `deltaY -140` at map centre:

```
ALT 15,451 KM → ALT 11,009 KM
```

*(A first pan attempt using synthetic `PointerEvent`s on the canvas itself did
not move the camera. That was the wrong target, not a broken map — recorded so
the next person doesn't read it as a regression.)*

**Break 2 — chapter, cursor and camera agree.** Clicked chapter 12 of 12:

```
clicked: 11   activeRow: 11
header:  "12/12 · 1983"
dial cursor: 1983-01-01
coords: 28.5194° N, 100.2793° W  →  41.9209° N, 73.9613° W
```

Guided scroll — M0's actual exit criterion — sampled at three scroll positions
in `guided` mode, reading the highlighted chapter and the dial cursor at each:

```
progress 0.0  → chapter  1/12  "0196-01-01 Angel hair"        cursor 0196-01-01
progress 0.5  → chapter  7/12  "1907-01-01 Mihal Grameno UFO" cursor 1907-01-01
progress 1.0  → chapter 12/12  "1983-01-01 2 events · 1983"   cursor 1983-01-01
```

**Camera framing, three chapters:**

```
11 · 1954 · 2 events  → 69.4261° N, 12.8050° E · ALT 12,210 KM
12 · 1983 · 2 events  → 41.9209° N, 73.9613° W · ALT 280 KM
 6 · 1896 Mystery airships → 40.5512° N, 85.6024° W · ALT 49 KM
```

(The third is a single-record chapter, so it also selects the record and
descends — intended.)

**Controls:**

```
dial chip     cursor 1947-07-08 → 2006-11-01, mode → free
zoom in ×2    ALT 280 KM → 69 KM
recenter      25.0000° N, 30.0000° W · ALT 15,950 KM
deep-time     "+ 9 before 1850" → "Focus 1850–2026";
              axis ticks widen to 200 … 1600; chips re-select to
              196 · 740 · 1450 · 1609 · 1803 · 1954
layers panel  reachable with inspector open; bounded inside the map
              region (panelBottom 646.75 ≤ mapBottom 761.5), scrollable
```

**Playback transport:**

```
manual step   30/142 → 31/142 · cursor 1947-07-08 → 1948-01-01 · inspector opens
play @ 5/s    31/142 → 41/142 over 2.2s (10 steps ≈ 5/s) · inspector stays closed
pause         holds at 41/142 · cursor 1952-01-29
```

**Corpus:** `142/142 on canvas · 104 mapped · span 100–2026`.

**Console:** no React, hydration, or Mapbox errors. Three entries, all dev
tooling — the `Agentation` dev component and the impeccable live-reload script
on `:8400`, both `ERR_CONNECTION_REFUSED`.

**Viewports walked:** 1600×960 and 1280×800.

### Not verified

- **No production build.** Dev server only.
- **A dev-only intermittent 404** on the first request to `/spacetime`
  immediately after an HMR recompile, while `/_not-found` compiles; recovers on
  the next request and does not reproduce on a settled server (5/5 → 200). Not
  investigated further; would need a `next build` to rule out.
- **No browser other than the automation Chrome**, no mobile/touch viewport, no
  keyboard-only or screen-reader pass.
- **`sightings`-backed surfaces untouched** — this canvas reads `events` only.

---

## 6. Files

New: `components/{spacetime-rail,spacetime-topbar,viewport-readout,map-controls,evidence-legend,event-inspector,waypoint-narrative,playback-transport}.tsx`,
`lib/{spacetime-theme,map-controller}.ts`

Modified: `components/{spacetime-canvas,spacetime-canvas-shell,spacetime-globe,temporal-dial,evidence-layers-panel,preserve3d-globe-spike}.tsx`,
`lib/{normalize,temporal-stations}.ts`, `state/spacetime-store.ts`,
`types/spacetime.ts`, `actions/load-spacetime-events.ts`, `index.ts`,
`services/sightings/get-events.ts`

`sightingToSpacetimeEvent` / `sightingsToSpacetimeEvents` are no longer exported
from the feature index. They derive `credibilityScore` from the length of a
comment field; that fabrication must not re-enter this surface. They remain in
`lib/normalize.ts` for any future sightings-backed surface that decides to own
the tradeoff explicitly.

---

## 7. Open

1. Concept 03 (Temporal Compare) remains unbuilt — M3, correct sequencing per
   plan §4; it needs reconstructions, which do not exist. Concept 04's transport
   is built; its AI-synthesis and cluster-analysis panels are not, and need
   corpus columns that do not exist (see §3).
2. Relationship arcs need relationship data on this path.
3. Credibility ring, source count and claims list need Lane A H4 provenance.
4. `Analytics` and `Settings` rail slots render visibly inert — no surface exists.
5. The lever rules (plan §3) stay vacuously satisfied: nothing generates yet.
