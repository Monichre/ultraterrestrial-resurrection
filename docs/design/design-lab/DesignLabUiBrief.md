# DesignLabUiBrief

**Created:** 2026-07-24  
**Package:** `packages/design-lab`  
**Skill artifact (full brief body):** [`UiDesignBrief.md`](./UiDesignBrief.md)  
**Pseudocode:** [`DesignLabUiBrief_PSUEDOCODE.md`](./DesignLabUiBrief_PSUEDOCODE.md)  
**Asset inventory:** [`DesignLab.md`](./DesignLab.md)

This document summarizes the **architecture of the UI brief itself** and the **module / data-flow model** of the design-lab surfaces — so implementers can navigate from lab HTML → product without treating the sandbox as a second product.

---

## What `packages/design-lab` is

A **prototype + reference archive**, not a publishable app package:

| Asset class | Examples | Role |
|---|---|---|
| Surface HTML | `prototypes/01`–`04` | Fixed artboard concepts for four research instruments |
| Gallery / refs | `prototypes/`, `dossier-art/`, `textures/`, `ui-mockups/` | Materiality + product mock mood board |
| Missing link | `./document-system/ut-document-system.css` | Referenced by HTML but absent — gap |

There is no `package.json`, Storybook, or build. Consumption path is: **read → brief → port into `apps/app`**.

---

## Key modules (surfaces)

```
┌─────────────────────────────────────────────────────────────┐
│ Shared Shell                                                │
│  Rail · Brand topbar · Context · Search · Sync · Identity   │
└───────────────┬─────────────────────────────────────────────┘
                │ surface switch
    ┌───────────┼───────────┬──────────────┬──────────────────┐
    ▼           ▼           ▼              ▼                  
 Canvas      Ledger    Observatory   Hypothesis Lab           
 (spatial)   (claim)   (space-time)  (readings)               
```

| Module | Responsibility | Primary objects |
|---|---|---|
| **Living Research Canvas** | Spatial investigation assembly | Paper cards, pins, threads, layers, dossier inspector |
| **Evidence Ledger** | Claim-level evidentiary accounting | Support/challenge lanes, provenance lineage, comparison |
| **Temporal–Geospatial Observatory** | Pattern filter in map + chronology | Points, arcs, bubbles, timeline brush |
| **Hypothesis Lab** | Competing explanations + bounded synthesis | Hypothesis panels, ranking, prediction bands, open questions |
| **Shared epistemic layer** | Provenance grammar across modules | Badges, solid/dashed borders, AI suggestion panels |

---

## Data flow (conceptual)

Not wired in the lab HTML (static mocks). Target product flow:

```
Postgres / @db/postgres records
        │
        ▼
Research Canvas investigation (Zustand + mindmap graph)
        │
        ├──► Canvas view     ← pins / edges / inspector
        ├──► Ledger overlay  ← claim + sources + provenance
        ├──► Observatory     ← geo/time facets of same entities
        └──► Hypothesis Lab  ← readings over selected cluster

AI paths (mindmap agent / Prometheus)
        │
        ▼
Inference overlays (dashed, [ INFERRED ]-family)
        │
        ▼
Human Review / Dismiss / Next trace
```

**Rule:** lab surfaces share one investigation context. Switching instruments must not fork a second “project” model.

---

## Brief architecture (this deliverable)

| File | Role |
|---|---|
| `DesignLabUiBrief_PSUEDOCODE.md` | Planning algorithm + inputs/outputs |
| `UiDesignBrief.md` | Skill-structured UI brief (purpose → handoff) |
| `DesignLab.md` | Asset taxonomy + rename inventory |
| `DesignLabUiBrief.md` | This file — modules, flow, selected direction pointer |
| Cursor canvas `design-lab-ui-brief.canvas.tsx` | Interactive review beside chat |

```
Canon (DESIGN/PRODUCT/vision)
        │
        ▼
Lab HTML + imagery ──► Pseudocode ──► 02 brief + DesignLabUiBrief
                                             │
                                             ▼
                                      Canvas review
                                             │
                                             ▼
                               Implementation / React port
```

---

## Selected UI direction (summary)

**Strong-fit Microfilm Dark:** four instruments under quiet chrome; paper evidence as the visual subject; clinical HUD ghosts; dual archival + techno-analytical register; correct lab SaaS-isms toward `DESIGN.md`. Full criteria, inventory, flows, states, image prompts, and open questions live in `UiDesignBrief.md`.

---

## Relationship to other labs

| Location | Relation |
|---|---|
| `apps/app/src/app/design-lab/` | Guided-tour canvas variants — adjacent playground, different brief |
| `apps/app/.../research-ui/` | Production document / dossier components — preferred port target for paper materiality |
| `apps/app` research-canvas views | Live Graph / Timeline / Sightings / Search / Detail — map lab instruments onto these |

---

## Handoff

Implementers should start from **Selected Direction in `UiDesignBrief.md`**, use HTML only for IA/interaction reference, and apply Microfilm Dark tokens + UX language before any pixel match to the lab CSS.
