# Temporal Observatory audit, cannibalization plan, and reference insights

**Written:** November 6th, 2026, 05:24 CST. **Updated:** November 6th, 2026, 06:10 CST. Plan items 1 and 2 are built and checked in the running app, uncommitted. See [Build status](#build-status--november-6th-2026-0610-cst).

## Build status — November 6th, 2026, 06:10 CST

**Range brush (plan item 1): built.**
- Dragging across the dial axis sets the existing `range` cursor:
  - [`temporal-dial.tsx`](apps/app/src/features/spacetime/components/temporal-dial.tsx)
  - the shared helpers in [`time-window.ts`](apps/app/src/features/spacetime/lib/time-window.ts)
- The globe dims pins outside the range rather than hiding them. It frames the in-range records, and holds the whole-earth view when they span both hemispheres.
- A "N in range · Clear" button resets the brush.
- **Correction:** the "Gap" row below says range filtering "already branches on" the globe. That was wrong. The globe only used `cursor.start` to aim the camera. Filtering was added in this pass.

**Connection arcs (plan item 2): built.**
- The schema has no direct event-to-event table. The one documented link is two events listing the same subject-matter expert in `event_subject_matter_experts`. So arcs mean exactly that, not similarity.
- Pieces:
  - query: [`load-event-connections.ts`](apps/app/src/features/spacetime/actions/load-event-connections.ts), capped at 12, ranked by experts in common
  - hook: [`use-event-connections.ts`](apps/app/src/features/spacetime/hooks/use-event-connections.ts)
  - arc geometry: [`great-circle.ts`](apps/app/src/features/spacetime/lib/great-circle.ts)
  - map layer: in [`spacetime-globe.tsx`](apps/app/src/features/spacetime/components/spacetime-globe.tsx)
- The inspector lists each connected record with "via <expert>", and it is clickable: [`event-inspector.tsx`](apps/app/src/features/spacetime/components/event-inspector.tsx).

**Evidence:**
- `bun test src/features/spacetime`: 12 pass, 0 fail.
- `tsc --noEmit`: 1,735 errors app-wide, none in `features/spacetime`. All were already there.
- `eslint` on the changed files: clean.
- Running app at `/spacetime`, 1440×900:
  - Brushing 1923→1966 showed "60 in range". The live DB count of `events` dated 1923–1966 is 60.
  - 43 mapped pins were in range, matching the DB's 43 geocoded rows. 61 were dimmed.
  - Selecting "Jimmy Carter UFO incident" drew 11 arcs. Of its 12 links, one has no coordinates. The inspector listed links such as "via Stanton T. Friedman".
  - Clicking a listed record opened it.
  - After a fresh reload: no runtime errors.

**Not done or UNVERIFIED:**
- The brush is pointer-only. There is no keyboard way to set a range, though the Clear button is keyboard-reachable.
- Cesium (`?engine=cesium`) has neither feature.
- The waypoint narrative and inspector do not filter by the range.
- The Next dev overlay shows one hydration warning from `SiteNav` `aria-controls`. It was already there.
- At 1440×900, the bottom of the dial's tick labels sits below the viewport. That is existing layout.

**Evidence level:**
- Spacetime and prototype claims were checked in source. Runtime is UNVERIFIED: no dev server, browser audit or Storybook run in this pass.
- The two v0 chats are UNVERIFIED and unread. They are private, the browser pane was not signed in, and no `V0_API_KEY` exists. See [v0 chats](#1-v0-chats--blocked).

## TL;DR

1. Spacetime already has most of what the local Temporal Observatory prototype shows: map points, legend, timeline markers, and a detail inspector. Do not port those.
2. Two real gaps are worth taking:
   - **Range brush on the temporal dial.** The state already supports it. Only a setter and a drag UI are missing. About half a day.
   - **Connection arcs between related events.** Keep the idea, not the code. It needs a rebuild as a Mapbox line layer plus a relations query. About 1–2 days.
3. From the external references, the transferable ideas are methods, not tools:
   - a review queue with a duplicates tab before publishing
   - an open, keyless read API
   - typed frontmatter with status and conviction
   - a capture → reduce → reflect → verify loop

## 1. v0 chats — blocked

| Chat | ID | State |
|---|---|---|
| Timeline Explorer | `Oxn18qNaqO0` | Not read |
| Ultraterrestrial Temporal Observatory | `kzt6LpdJe3G` | Not read |

**Provenance check:**
- The local prototype in [`apps/app/src/features/research-platform/temporal-observatory/`](apps/app/src/features/research-platform/temporal-observatory/) was added in commit `51e63500` on August 14th, 2026, with the message "here goes".
- Nothing in the folder mentions v0 or Vercel.
- So there is no evidence either way that it came from the observatory chat. Contents of the chats are not inferred from their titles here.

**Unblock, any one of these:**
- Sign in to v0 inside the Claude app's browser pane.
- Run `v0-pp-cli auth set-token` with a key from v0.app/settings/keys. Then run:
  - `v0-pp-cli chats files <id> --tree`
  - `v0-pp-cli chats get <id> --agent`

When unblocked, score each chat against the table in section 2 and add rows. Do not open a new section.

## 2. Local prototype vs live Spacetime

**Prototype:**
- Location: [`apps/app/src/features/research-platform/temporal-observatory/`](apps/app/src/features/research-platform/temporal-observatory/), about 700 lines.
- The map is CSS land with pixel-positioned points, and all data is fixtures. Its types say so: [`types.ts`](apps/app/src/features/research-platform/temporal-observatory/types.ts) positions everything by `x`/`y` px or percentage strings.
- No product route consumes it. See [`apps/app/src/features/spacetime/README.md`](apps/app/src/features/spacetime/README.md).

| Prototype piece | Spacetime equivalent | Verdict |
|---|---|---|
| `MapPoint` (px-positioned glow dot) | Mapbox event points in [`spacetime-globe.tsx`](apps/app/src/features/spacetime/components/spacetime-globe.tsx) | **Have it. Skip.** At most, borrow the glow styling as a paint property. |
| `MapLegend` | [`evidence-legend.tsx`](apps/app/src/features/spacetime/components/evidence-legend.tsx) + [`evidence-layers-panel.tsx`](apps/app/src/features/spacetime/components/evidence-layers-panel.tsx) | **Have it. Skip.** |
| `TimelinePanel` + `TimelineMarker` | [`temporal-dial.tsx`](apps/app/src/features/spacetime/components/temporal-dial.tsx), [`playback-transport.tsx`](apps/app/src/features/spacetime/components/playback-transport.tsx), [`waypoint-narrative.tsx`](apps/app/src/features/spacetime/components/waypoint-narrative.tsx) | **Have it. Skip.** |
| `BrushRange` (timeline selection) | `TemporalCursor` has `{mode: 'range'; start; end}` in [`types/spacetime.ts:20`](apps/app/src/features/spacetime/types/spacetime.ts#L20). The dial and globe read it, but nothing ever sets it. | **Gap. Take the concept.** Add a drag-to-select on the dial that calls `setTemporalCursor({mode: 'range', …})`. Range filtering in the globe already branches on it. |
| `ConnectionArc` (CSS-rotated curves) | No relation rendering on the map. A whole-word search for `arc`/`LineString` in the feature returned nothing. | **Gap. Rebuild; don't copy.** Use a Mapbox line layer (great-circle) fed by event relations from `@db/postgres`. The CSS arcs cannot survive pan or zoom. |
| `EventBubble` (on-map popup with era, title, source count, status) | [`event-inspector.tsx`](apps/app/src/features/spacetime/components/event-inspector.tsx) in the docked panel | **Styling only.** The `sourceCount` and `status` strings are fixtures. The inspector deliberately names absent fields as absent and refuses invented numbers. An on-map bubble may reuse its look, but it must carry the inspector's data contract (epistemic copy, date precision). |
| `TemporalObservatory` shell (map over a 240px timeline) | [`spacetime-canvas-shell.tsx`](apps/app/src/features/spacetime/components/spacetime-canvas-shell.tsx) docked layout | **Have it. Skip.** |
| `observatory.css` (277 lines) | Spacetime theme in [`spacetime-theme.ts`](apps/app/src/features/spacetime/lib/spacetime-theme.ts) | Mine colour tokens only, if the palette is wanted. Prefix any CSS that is carried over, because global class collisions are a known hazard. |

## 3. Cannibalization plan

Sizes are for whoever implements them.

1. **Range brush on the temporal dial.** About half a day.
   - Drag-select on [`temporal-dial.tsx`](apps/app/src/features/spacetime/components/temporal-dial.tsx), plus an escape or click that returns to `exact`.
   - Check that [`spacetime-globe.tsx:296`](apps/app/src/features/spacetime/components/spacetime-globe.tsx#L296) filters correctly.
   - Open gap: Cesium does not subscribe to the cursor (README "Time limitation"), so this is Mapbox-only until parity work.
2. **Relation arcs.** About 1–2 days.
   - Add a relations read for the loaded events through `@db/postgres` (the junction tables already exist).
   - Add a line layer, toggled from the evidence layers panel.
   - Draw arcs only for selected-event neighbours. That avoids the hairball at 400 events.
3. **Bubble styling.** Optional, about 2 hours, after 1 and 2.
   - Only if a lighter on-map affordance is wanted beside the docked inspector.
   - Check it against the "invisible hand" chrome direction first. Chrome should shrink when idle.
4. **Retire the prototype.** Once 1–3 land, the prototype has nothing left to donate. Deleting it is a separate decision for the user.

Nothing above is approved. The Spacetime README states that no consolidation into Spacetime was approved.

## 4. Reference insights

### Archive Genocide (archivegenocide.com) and its Instagram announcement

**What it is:** a public documentation archive of footage from Gaza and the West Bank, in a very different domain. The comparison here is about method only.

| Their method | Our equivalent | Insight |
|---|---|---|
| Per-record classification (Verified / Uncaptioned / Text) shown as a filter | Epistemic status `documented / inferred / disputed` + credibility in [`filter-events.ts`](apps/app/src/features/spacetime/lib/filter-events.ts) | Same idea, already built. Theirs is a **first-class browse filter on every list**. Ours lives only in Spacetime. Worth exposing in search and the Research Canvas too. |
| Detail-panel button: "This video shouldn't be here, flag for review" | None | A **public flag-for-review** affordance is cheap and builds trust. It needs a queue table, and it fits [`apps/disclosure-lab`](apps/disclosure-lab), where a human confirms every write. |
| Review dashboard: Review Queue, a **Duplicates tab**, "Publish to live" | Entity resolution review band in disclosure-rag; disclosure-lab human-confirmed writes | Their staged publish matches our ingestion contract. A **duplicates tab as a UI** for the 0.3–0.92 review band is the concrete thing to steal. |
| Open, keyless search API returning date, source, map location and links, in English and Arabic | No public read API. Most `/api/disclosure/*` routes are public by accident, with no auth middleware. | A deliberate, rate-limited, read-only API would make the corpus citable. A commenter on the post had already wrapped theirs as an MCP tool. Ours could ship as an MCP from day one. This is a strategic idea, not a ticket. |
| Geolocation map + node map + daily log | Spacetime + Research Canvas + (no daily log) | Confirms our surface split. A "what changed in the corpus" log is the one thing we lack. |
| Count drift: 156,000+ on the site vs 186,628 in the post | [`AGENTS.md`](AGENTS.md) still cites 126,483 records "live 2026-07-24" | We have the same problem. Public counts should come from a live query, not prose. |

### Ars Contexta (Claude Code plugin)

**What it is:** a plugin that derives a markdown wiki-link vault with three spaces (`self/` identity, `notes/` the graph, `ops/` queue and sessions). It runs a pipeline of record → reduce → reflect → reweave → verify → rethink. Its hooks cover session orient, schema validation on write, auto-commit and session capture. Templates carry `_schema` blocks.

**Insights:**
- **Reweave** means updating old notes when new evidence lands. It is the step our ingestion lacks: new transcripts add entities but never revise earlier summaries. It maps to entity resolution plus a re-summary pass.
- **Write-validate hooks against a schema** match our need to keep `dy` outputs and prompt frontmatter valid. Borrow the pattern, not the plugin.
- **Session orient and capture** we already cover with Concord, skills, project memory and work logs. Adding a third system would duplicate them.

**Do not install.** The working tree currently shows `.ok/`, `.okignore`, `.agents/skills/open-knowledge/` and `.pi/extensions/open-knowledge.ts` deleted. That removal is uncommitted and its intent is unknown. Either way, adding another markdown-vault tool right now would cut against it.

### Ars Umbris (arsumbris.ai + repo)

**What it is:** an early-alpha, macOS-only, local-first typed graph over files. It has three parts: `au-engine` (types, references and diagnostics), `au-host` (a malleable Electron IDE), and `au-mcp` (a harness for tools, skills and hooks). Its README says it runs unsandboxed code.

**Insights:**
- **Typed notes with `status` and `conviction` (0–1)** are the clearest idea to borrow. Our claims and waypoints could carry `status` (brainstorm / draft / solid) and `conviction` beside the existing evidence tier. That would let a tour or dossier show how sure *we* are, separately from how documented the source is. It maps to the waypoint contract (claim → basis → counterpoint → unresolved → next).
- **Diagnostics over the graph** (missing fields, broken references) is a useful lint for the KB archive and prompt library. A small script could do it, without the IDE.
- **Not adoptable** as a dependency. It is alpha, unsandboxed and macOS-only.

### Polyphonic (polyphonic.chat)

It is behind a login wall, and the only text visible is a title and tagline. Its features are unknown. A possible link to the open-source Polyphon multi-agent chat is unconfirmed, and nothing here is built on it.

## 5. What was not done

- The v0 chats were not read (section 1).
- No runtime check of Spacetime: every Spacetime claim here is from source.
- Archive Genocide's API docs page was not fetched. API details come from the Instagram caption.
- The Ars Umbris per-layer design docs were not read.
