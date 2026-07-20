# Brainstorm: Borrowing A Possible Reference UX for Ultraterrestrial Mindmap

**Created:** 2026-06-26  
**Inputs:** Dogfood of [apossible.com/references/character-strengths-and-virtues](https://apossible.com/references/character-strengths-and-virtues), repo scan of `apps/app/src/features/mindmap/`, [2026-06-26-dogfood-mindmap-integration-assessment.md](../plans/2026-06-26-dogfood-mindmap-integration-assessment.md)

---

## What We're Building

A **reference-grade entity detail experience** inside the research canvas — not a new app section, but an upgrade to how mindmap nodes hand off to deep content. When a researcher clicks "View Details" on Roswell, Jacques Vallée, or a testimony node, they get an A Possible–style **spatial context panel** (graph neighborhood) plus a **structured dossier** (metadata, description, related entries, sources).

This closes the biggest gap identified in both dogfood passes: Ultraterrestrial has rich graph AI and vintage document components, but no unified "encyclopedia entry" surface wired to `@db/postgres`.

---

## Why This Approach

A Possible proves that **research platforms don't need to choose between graph and document**. Their reference page keeps you in spatial context (orbital graph) while delivering citation-grade metadata in a calm reading column. Ultraterrestrial already has:

- Live graph + agent (`graph.tsx`, `useMindMapAgent`)
- Vintage dossier components (`research-ui/documents/*`) — orphaned in Storybook
- ViewSwitcher `detail` view — mock UFO incidents only
- Broken handoff from nodes (`enhanced-entity-node.tsx` expands inline, never navigates)

Borrowing A Possible's **layout and information architecture** — not their visual brand — lets us reuse existing assets instead of designing from scratch.

---

## A Possible Patterns → Ultraterrestrial Mapping

| A Possible pattern | Ultraterrestrial equivalent | Borrow? |
|--------------------|----------------------------|---------|
| Orbital graph (active node centered, related on rings) | React Flow graph + `loadEntityGraph` | ✅ Adapt for detail view left pane |
| Dossier metadata rows (Authors, Year, Source, Type, Kind) | Entity fields from Postgres (`events`, `key_figures`, `documents`, `testimonies`) | ✅ Schema per entity type |
| Key Strengths (thematic tags) | `topics`, contextual intelligence badges, classification | ✅ High value for UAP taxonomy |
| Guide card (framework explainer) | Research session onboarding / tour copy | ✅ Optional Phase 2 |
| Prev/Next entry browse | Graph BFS ordering or date-sorted entity list | ✅ For library-style browsing |
| Entries with similar themes | `getGraphContext`, vector similarity, shared topics | ✅ Wire to `@db/postgres` |
| Entry type badge (Reference, Interview…) | Entity type + source type (FOIA doc, testimony, event) | ✅ Already have classification |
| Source + Archive links | Primary source URL + knowledge-base file path | ✅ Natural fit for disclosure corpus |
| Pull quotes on satellite cards | Testimony excerpts, witness quotes | ✅ For testimonies/key figures |
| Zoom/pan/center/fullscreen | React Flow controls (already exist) | ✅ Reuse, don't rebuild |
| Split dark canvas / light dossier | Mindmap dark canvas + vintage cream dossier (`research-ui`) | ✅ Brand-aligned |

---

## Three Approaches

### Approach A — Split View inside ViewSwitcher `detail` (Recommended)

Replace the mock `content-card-detail-view` with a two-pane layout:

- **Left:** Mini React Flow showing focused entity + 1-hop neighbors (orbital or force layout)
- **Right:** Entity dossier panel — metadata schema + description + related entries

**Navigation:** `enhanced-entity-node` "View Details" → `setActiveView('detail')` + `referenceEntity: { table, id }` in `mindmap-ui-store`.

| Pros | Cons |
|------|------|
| Fits existing ViewSwitcher architecture | No shareable URL without extra work |
| Reuses React Flow + Zustand patterns | Two-pane may feel tight on mobile |
| Minimal new routing | Requires generic entity adapter |

**Best when:** You want fastest path to production inside research canvas (matches CANN + MMAP roadmap).

---

### Approach B — Slide-over dossier on canvas (A Possible mobile-style)

Keep user on graph; open dossier as a right slide-over (like `evidence-detail-sidebar.tsx` in case-files kit). Spatial graph stays full-width; dossier overlays 40%.

| Pros | Cons |
|------|------|
| Never leaves graph context | Overlays stack (see ISSUE-002 from ufo-ui dogfood — palette + rail) |
| Matches existing sidebar pattern | Less room for long prose + related grid |
| Lower ViewSwitcher churn | Harder to browse Prev/Next across entries |

**Best when:** Detail is quick inspection, not long reading sessions.

---

### Approach C — Standalone entity routes (`/entities/[type]/[id]`)

Full-page reference URLs like A Possible's `/references/...`. Mindmap links out via `router.push` or new tab.

| Pros | Cons |
|------|------|
| Shareable, SEO-friendly, bookmarkable | Breaks CLAUDE.md guidance ("navigation via setActiveView") |
| Clean reading experience | Context switch away from canvas |
| Matches A Possible URL model exactly | Two codepaths for same content |

**Best when:** Public reference library is a first-class product surface.

---

## Recommendation

**Approach A** for v1, with optional URL sync later (`?entity=events:uuid` read on load). It respects the canonical render path, reuses ViewSwitcher, and directly fixes the broken node → detail handoff. Steal A Possible's **information design**, not their routing model.

Phase 2 can add Approach B as a "quick peek" from graph nodes (double-click = slide-over, "Open full reference" = ViewSwitcher detail).

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Presentation tier | **Vintage dossier for personnel/testimonies; modern case file for events** | `research-ui` already encodes this split; matches disclosure aesthetic |
| Data source | **`@db/postgres` only** | Cannibalization audit rule; no static `UFO_SIGHTINGS` |
| Related entries | **Graph neighbors + topic tags + vector similarity** | Three ranked sources; show top 3–5 like A Possible |
| Metadata schema | **Per-entity-type field maps** | Events: date, location, classification; Personnel: role, org, credibility; Documents: source, FOIA status |
| Spatial mini-graph | **1-hop ego network, orbital layout** | Simpler than full mindmap; matches A Possible canvas |
| Prev/Next | **Date-ordered within same entity type** | Predictable browse; optional filter by topic |
| Avoid A Possible bugs | **Sidebar related links must navigate** | Their ISSUE-001; wire ours to `setReferenceEntity` |
| Guide/onboarding | **Defer to Phase 2** | Focus v1 on entity detail; add framework card after core works |

---

## Implementation Sketch (WHAT, not HOW)

### New/updated surfaces

1. **`EntityReferenceView`** — replaces body of `content-card-detail-view/page.tsx`
2. **`EntityDossierPanel`** — right column; maps entity → metadata rows + description + related list
3. **`EntityNeighborhoodGraph`** — left column; React Flow ego graph from `loadEntityGraph`
4. **`mindmap-ui-store.referenceEntity`** — `{ table, id } | null`
5. **Wire `enhanced-entity-node` QuickActions** — "View Details" sets store + `setActiveView('detail')`

### Reuse (don't rebuild)

- `components/design-system/research-ui/documents/PersonnelFileCard.tsx`
- `components/design-system/research-ui/documents/KeyFigureCaseFile.tsx`
- `features/mindmap/utils/contextual-intelligence.ts` — related filtering
- `packages/db/postgres` — `readById`, `loadEntityGraph`, `searchDatabase`

### Avoid

- Extending ghost routes or `OracleInput` path
- Third Zustand store (use existing `mindmap-ui-store` slice)
- Copying A Possible's broken sidebar-only related links

---

## Open Questions

1. **Vintage vs modern default** — Should all entity types use vintage dossier, or only personnel/testimonies?
2. **URL sync priority** — Is shareable `?entity=` required for v1, or acceptable as Phase 2?
3. **3D timeline relationship** — Does entity reference view replace part of ISSUE-005 timeline split, or stay separate?
4. **Prometheus integration** — Should dossier panel include "Ask about this entity" inline, or rely on existing canvas console?

---

## Resolved Questions

_(none yet)_

---

## Success Criteria

- Click any graph node → "View Details" → full reference view in <500ms (skeleton while loading)
- Dossier shows ≥5 structured metadata fields per entity type from live DB
- Related entries list ≥3 items from graph/similarity; each click updates the view
- Prev/Next browses entities without returning to canvas
- No static mock data in detail view
- Passes accessibility: all controls have clear labels (learn from A Possible ISSUE-004)

---

## Relationship to Existing Plans

| Plan | Connection |
|------|------------|
| [2026-06-26-dogfood-mindmap-integration-assessment](../plans/2026-06-26-dogfood-mindmap-integration-assessment.md) | Phase 1 item 5 (SearchView detail links) merges into this |
| [2026-06-20-ufo-ui-cannibalization-audit](../plans/2026-06-20-ufo-ui-cannibalization-audit.md) | CANN-1 console UX + this reference view = complete research canvas |
| MMAP-004/005/006 tickets | Timeline split and DB wiring are parallel, not blocking |

---

## Next Steps

1. Run `/workflows:plan` on Approach A → implementation tickets
2. Resolve open questions (especially vintage vs modern and URL sync)
3. Prototype `EntityDossierPanel` with one entity type (`key_figures`) as vertical slice
4. Dogfood the prototype against A Possible reference page for parity check
