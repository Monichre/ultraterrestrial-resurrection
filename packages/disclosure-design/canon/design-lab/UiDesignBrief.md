# Design Lab — UI Design Brief

**Package:** `packages/design-lab`  
**Date:** 2026-07-24  
**Living design context:** `PRODUCT.md`, `docs/vision/{DESIGN_REGISTERS,UX_LANGUAGE_GUIDE,RESEARCH_NARRATIVE_RUBRIC,UI_INSPIRATION}`, this brief + design-lab assets. Root `DESIGN.md` is **not canonical** — a limited Microfilm Dark *canvas chrome* sketch; useful for token names / bans, not the full ambition.  
**Sources:** `prototypes/01–04` HTML surfaces + `dossier-art/` / `ui-mockups/` / `textures/`  
**Sibling docs:** `DesignLabUiBrief.md` (architecture), `DesignLab.md` (asset inventory)

---

## Purpose

`packages/design-lab` is the **visual sandbox and surface-concept archive** for Ultraterrestrial’s research product — not a standalone SaaS app.

It exists so designers and coding agents can:

- explore investigation UI before (or beside) wiring production React in `apps/app`
- keep a shared language for four research instruments: canvas, ledger, observatory, hypothesis lab
- port paper/dossier materiality into the live Research Canvas without inventing a second product aesthetic

**Target users of the lab itself:** product designers, design-system authors, and agents migrating lab HTML into `apps/app` (research-canvas, Storybook, guided-tour variants).

**End users of the shipped surfaces:** serious independent UFO/UAP researchers working long evening sessions on large monitors — assembling records, weighing contradictions, refusing premature closure.

---

## Product Feel

| Axis | Direction |
|---|---|
| Scene | Night desk, microfilm reader glow, dossiers pulled into lamplight |
| Density | High information, low decoration; instrument, not dashboard |
| Emotion | Clinical, slightly ominous, reverent toward evidence |
| Registers | Archival-material (paper, stamps, grain) **coexisting with** techno-analytical HUD (coordinates, overlays, dashed inference) |
| Anti-feel | Purple SaaS, neon cyberpunk maximalism, X-Files camp, chat-first AI chrome |

One-line: **paperwork left behind after reality got breached** — paper objects on a void canvas, HUD ghosts at low opacity.

---

## Design Principles

1. **Provenance before prose** — every visual unit answers “sourced vs inferred?”
2. **Paper is the subject; chrome recedes** — evidence objects (cards, dossiers, maps) carry hierarchy; rails/toolbars stay quiet.
3. **Epistemic states are first-class** — bracketed badges `[ CORROBORATED ]`, solid vs dashed borders for deterministic vs AI.
4. **Plural readings over single thesis** — Hypothesis Lab and ledger lanes encode counter-readings structurally.
5. **Refuse premature closure** — synthesis ends on open questions / next trace, never “solved.”
6. **Correct the prototypes toward living design context** — HTML mocks use Inter, heavy radius, side-stripes, and glow; production follows vision + design-lab direction (use root `DESIGN.md` only as a partial canvas-chrome token/ban checklist — it is not canonical).
7. **One composition per surface** — not a wall of identical metric cards.

---

## Primary Surfaces / Screens

Shared shell (lab artboards): **icon rail** · **brand topbar** · **context crumb** · **global search** · **sync / identity chips**.

| # | Surface | Lab file | Job |
|---|---|---|---|
| 1 | Living Research Canvas | `prototypes/01-living-research-canvas.html` | Assemble investigation as spatial constellation of paper records + threads |
| 2 | Evidence Ledger | `prototypes/02-evidence-ledger.html` | Work a single claim: support vs challenge, provenance, comparison |
| 3 | Temporal–Geospatial Observatory | `prototypes/03-temporal-geospatial-observatory.html` | Filter events in space + time; brush chronology |
| 4 | Hypothesis Lab | `prototypes/04-hypothesis-lab.html` | Compare competing explanations; bounded synthesis |
| — | Interface Gallery / references | `prototypes/interface-gallery-overview.png` + `dossier-art/` / `ui-mockups/` | Mood / materiality reference (not interactive) |

Platform target: **desktop web** (lab framed at ~1440×960). Mobile is secondary; preserve readability of dossiers, not full spatial board fidelity.

---

## Screen-by-Screen Notes

### 1. Living Research Canvas

- **Hero content:** investigation title + count meta (`entities · relationships · unresolved contradictions`).
- **Board:** rotated paper cards (artifact / government record / org / event / testimony / hypothesis) pinned and thread-linked.
- **Left dock:** layer toggles (all / corroboration / contradictions / hypotheses / verified) + saved views.
- **Right dock:** selected-entity dossier — quote, fact rows, evidentiary weight, AI suggestion panel (dashed / violet register).
- **Tools:** Add Pin, Connect, Run Proximity Analysis, Epistemic overlay pill.
- **Canon corrections:** replace Inter/Georgia chrome with Martian Mono labels + one Special Elite title moment; clipped dossier corner on inspector; redaction-bar loading; drop glow blooms and soft SaaS radii.

### 2. Evidence Ledger

- **Left:** research index tree (claims, primary sources, testimonies, orgs, hypotheses, contradictions, circular citations) + active filters.
- **Center:** claim statement as H1; working interpretation; **Support** / **Challenge** lanes with source cards; source comparison matrix.
- **Right:** provenance lineage (press office → newspaper → microfilm → OCR) + credibility composition meters + Evidence Agent callout.
- **Language:** “Claim” only for source-extracted assertion (correct here). AI text is inference, never “evidence.”
- **Canon corrections:** remove left accent side-stripes (DESIGN ban); use badge grammar + lane color instead; rename “Credibility model” toward **Evidentiary Weight**.

### 3. Temporal–Geospatial Observatory

- **Upper:** map plane with grid, event points (corroborated / contested / contradiction), arcs, event bubbles.
- **Lower:** chronology axis + brush selection + play sequence.
- **Filters:** date range, infrastructure class, confidence threshold.
- **Canon corrections:** HUD legend at ≤15% surface share; no neon point blooms; event bubbles as clipped dossiers; confidence filters must not imply “proven.”

### 4. Hypothesis Lab

- **Grid:** competing hypothesis panels (supports / challenges / strongest / weakness) + dashed **testable prediction** band.
- **Stack:** ranking, evidence-space matrix, strategic synthesis with open questions.
- **Canon:** dashed borders for AI/analytical layer; rankings are provisional fit scores, not truth; vocabulary may prefer Reading / Counter-reading where product copy lands.

---

## Layout / Information Architecture

```
App shell
├── Rail (surface switch: Canvas · Ledger · Observatory · Hypothesis · …)
└── Shell
    ├── Topbar (brand · context · search · sync · identity)
    └── Main viewport (one active instrument)
        ├── Canvas: board + floating docks
        ├── Ledger: 3-column (index · claim · provenance)
        ├── Observatory: map / timeline split
        └── Hypothesis: comparison grid + synthesis column
```

**IA rules**

- Rail switches **instruments**, not marketing pages.
- Global search is a **trace** entry point (⌘K in product), not a separate “search product.”
- Intelligence lives **in records, waypoints, and connections** — not extra sidebars of “insight cards.”
- Live app already uses Zustand `setActiveView()` for canvas views; lab rail should map to those views / overlays, not invent a parallel router taxonomy.

---

## Component Inventory

### Shared chrome

| Component | Role |
|---|---|
| Icon rail / surface switcher | Instrument navigation |
| Brand wordmark | Ultraterrestrial identity |
| Context crumb | Surface + investigation focus |
| Search field / CommandK trigger | Trace entry |
| Sync / status chip | System truth (latency, connection) |
| Identity chip | Researcher session |

### Evidence objects

| Component | Role |
|---|---|
| Paper record card | Primary visual unit on canvas |
| Pin + thread/edge | Spatial relationship |
| Dossier inspector panel | Selected entity detail (clipped corner) |
| Evidentiary badge | `[ STATE ]` mono |
| Source card (ledger) | Support/challenge item |
| Provenance step list | Chain of custody |
| Event bubble / map point | Observatory markers |
| Timeline axis + brush | Temporal selection |
| Hypothesis panel | Competing reading |
| Prediction band | Falsifiable forecast (dashed) |
| Synthesis / bounded conclusion | Analytical overlay |
| Layer list / saved views | Canvas filters |
| Redaction-bar skeleton | Loading state |
| Film grain + warm dot grid | Texture primitives |

### Semantic / epistemic

| Component | Role |
|---|---|
| Solid vs dashed border | Sourced vs inferred |
| Support / Challenge lanes | Structural counter-reading |
| Weight meters (optional) | Evidentiary Weight composition — never “proof” |
| Next-trace CTA | Recommended research action |

---

## Key User Flows

1. **Open investigation → pin records → connect → inspect → accept/dismiss AI link suggestion**
2. **Select claim → weigh support vs challenge → walk provenance → collapse circular citation families**
3. **Filter map by nuclear infrastructure + date brush → open event bubble → jump to ledger or canvas entity**
4. **Compare hypotheses → run falsification pass → open synthesis → leave with open questions / next traces**
5. **⌘K / search → land on entity → continue in active instrument**

---

## States to Design

| State | Treatment |
|---|---|
| Empty investigation | Invitation: “Assemble records to begin an investigation” — not “No data” |
| Loading | Redaction-bar skeletons that declassify into text; optional `RETRIEVING…` |
| Partial provenance | Show broken chain explicitly; do not invent steps |
| AI suggestion pending | Dashed panel + Review / Dismiss |
| AI failure | Mature fallback; terminal: `NO CARRIER` or plain safety reframing |
| Contested / contradiction | Amber / stamp-red badges; contradiction as research object |
| Brush / filter empty map | Honest empty map + “widen filters” — no fake points |
| First-run | Minimal tutorial chrome; hide unused tour chrome when idle |
| Repeat-use | Restore saved views / last brush / last selected entity |
| Reduced motion | Disable decorative thread shimmer; keep state transitions ≤250ms |

---

## Visual Direction

### Partial canvas chrome checklist (from non-canonical `DESIGN.md` — not full ambition)

- Void / surface / paper / stamp OKLCH tokens (warm manila ~hue 85)
- Martian Mono for labels/badges; Special Elite once per surface title
- Clipped dossier corner; film grain ~5%; warm dot grid; soft vignette
- Motion: 150–250ms ease-out; redaction shimmer only while loading
- Bans: side-stripe accents, gradient text, hero-metric blocks, identical card grids, neon >15% share, display fonts in controls

### Lab vs production gap

| Lab HTML today | Production target |
|---|---|
| Inter + Georgia | Martian Mono + Special Elite moment |
| Soft 14px radii, shadows, glows | Flat hairlines, clipped panels, low-opacity HUD |
| Side-stripe source cards | Badge + lane semantics |
| Numeric “credibility” hero | Evidentiary Weight, inspectable, non-triumphal |
| `document-system/` unfinished | Specimen + CSS exist under `design-lab/document-system/` but are **not live** — broken consumer links, stale nav, no React handoff. See [`document-system/README.md`](./document-system/README.md) |

### Dual register on one surface

Paper cards / dossiers = archival-material. Map grid, arcs, dashed AI bands = techno-analytical. Do not force a mode picker.

---

## Accessibility and Responsiveness

- Desktop-first; Observatory and Canvas may degrade to list + detail below ~1200px rather than fake a corkboard.
- Color is not the only signal: badges include text; map legend has labels.
- Contrast: paper cards on void must keep body text ≥ WCAG AA; muted meta may be fainter but never sole carrier of critical state.
- Keyboard: rail switch, search, inspector focus trap, dismiss AI suggestion.
- Reduced motion: respect `prefers-reduced-motion`.
- Screen reader: investigation title, selected entity, evidentiary state announced; decorative threads `aria-hidden`.

---

## Content / Copy Notes

Follow `UX_LANGUAGE_GUIDE.md` and `RESEARCH_NARRATIVE_RUBRIC.md`.

- Reserved: **Claim** (source-extracted only), **Inference** (AI), **Evidence** (source-derived only).
- Adopted: Investigation, Dossier, Trace, Constellation, Reading/Counter-reading, Evidentiary Weight, Field Note, Open Questions.
- Ban: proves/confirmed for anomalous conclusions; “Oops!”; enterprise filler; emoji.
- Empty: “Assemble records to begin an investigation.”
- AI edge tooltip: “inferred connection,” not “discovered link.”
- File-ref micro-headers must be system-truthful (`UT·RC // N:07 · E:05`), never decorative “SECTION 01.”

---

## Optional Image-Generation Concepts

Images not generated — prompts stored for taste exploration only.

### 1. Conservative

```text
Create a high-fidelity UI concept screenshot for Ultraterrestrial, an anomalous-knowledge research platform for serious UFO/UAP investigators. Platform: desktop web, 1440x900. Screen: Living Research Canvas — dark research workspace with left layer list, center node board, right detail panel. Target user: independent researcher at night. Product feel: calm professional dark tool, restrained. Layout: thin left icon rail, top search bar, central graph of rectangular cards connected by thin lines, right inspector with quote and metadata rows. Must show: investigation title, a few document-like cards, evidentiary status chips, subtle search. Avoid: generic SaaS filler, fake KPI hero metrics, purple gradients, neon cyberpunk glow, stock photos, unreadable tiny text, playful illustration. Style: flat dark UI, warm gray text, minimal radius, no glassmorphism. The image should be a realistic product UI mockup suitable for turning into a design brief.
```

### 2. Strong-fit (preferred)

```text
Create a high-fidelity UI concept screenshot for Ultraterrestrial Research Canvas. Platform: desktop web, 1440x900. Screen: night “Microfilm Dark” investigation board — void canvas with warm manila paper dossier cards slightly rotated and pinned, thin thread connections, low-opacity clinical HUD docks. Target user: Vallée-grade researcher. Product feel: archival dossier photographed at night; institutional, clinical, slightly ominous. Layout: quiet icon rail; top bar with spaced Ultraterrestrial wordmark and mono context crumb; center paper cards (press release, testimony, artifact photo); left layers dock; right clipped-corner dossier inspector with bracketed mono badge [ CONTESTED ], quote, fact rows, and a dashed-border AI inference suggestion. Must show: film grain, warm dot grid, paper texture on cards, solid borders on sourced cards and dashed on AI panel. Avoid: purple SaaS, neon bloom, identical metric card grids, gradient text, Halloween UFO kitsch, chat bubbles as primary UI, side-stripe accents. Style: Microfilm Dark — OKLCH warm neutrals, teletype mono labels, one typewriter title moment. The image should be a realistic product UI mockup suitable for turning into a design brief.
```

### 3. Divergent

```text
Create a high-fidelity UI concept screenshot for Ultraterrestrial. Platform: desktop web, ultra-wide. Screen: literal archival desk under a single desk lamp — physical manila folders and redacted photocopies spread on dark wood, with only a ghostly translucent HUD reticle and timeline brush floating above the papers; almost no app chrome. Target user: researcher who wants maximum materiality. Product feel: evidentiary sublime; paperwork after reality breached; HUD as digital ghost. Layout: full-bleed desk photograph illusion; tiny mono file-reference header; one open dossier with stamp; faint map projection in the grain. Must show: redaction bars, classification stamp in restrained red, provenance micro-header, open question note. Avoid: dashboard cards, sidebar navigation, neon, purple, emoji, fake analytics, busy icon rails. Style: cinematic still that still reads as usable research UI. The image should be a realistic product UI mockup suitable for turning into a design brief.
```

---

## Selected Direction

**Strong-fit — Microfilm Dark investigation instruments.**

Ship the four lab surfaces as a coherent instrument set under one quiet shell: **paper evidence objects on a void canvas**, clinical HUD at low opacity, dual register (archival + techno-analytical) without a mode switch. Correct prototype chrome toward living vision + design-lab direction (dossier materiality, mono/typewriter moments, solid/dashed provenance); root `DESIGN.md` is only a partial token/ban checklist, not the design SoT. Prefer on-canvas progressive disclosure over card-wall dashboards. Treat Hypothesis Lab and Ledger as the structural home of counter-readings; Canvas as constellation; Observatory as space–time filter.

Conservative is acceptable only as an interim engineering scaffold. Divergent (literal desk photo) is reserved for marketing/mood, not primary product chrome.

---

## Open Questions

1. **Shell permanence:** Does production keep a persistent icon rail (lab) or stay with FullScreenMenu + CommandK + view switcher (live canvas)?
2. **Scoring language:** Keep numeric fit / weight meters, or demote numbers in favor of badge + prose Evidentiary Weight?
3. **Paper rotation:** Keep corkboard tilt on cards in production, or flatten to dossier panels for density/a11y?
4. **Surface shipping order:** Canvas-first only, or Ledger / Observatory / Hypothesis as first-class views in the same milestone?
5. **document-system (UNFINISHED):** Finish and wire [`document-system/`](./document-system/) (fix prototype CSS links, specimen nav, Microfilm Dark alignment, React handoff) — or explicitly archive it once React document primitives own the register?
6. **Hypothesis vocabulary:** “Hypothesis” in lab titles vs product “Reading / Counter-reading” — which wins in UI chrome?
7. **Credibility radar:** Keep the ledger spider/radar viz, or is it too “dashboard metric” for the brand?

---

## Handoff Notes for Implementation

1. **Do not treat lab HTML as pixel-perfect source of truth** — treat this brief + `docs/vision/` as the living design context; root `DESIGN.md` is not canonical. HTML is interaction/IA reference.
2. **Port order (suggested):** shared paper/dossier primitives → Living Research Canvas inspector/layers → Evidence Ledger lanes → Hypothesis Lab comparison → Observatory map/timeline.
3. **Reuse live substrate** where it exists: research-canvas views, evidentiary badges, CommandK, Zustand `setActiveView()`, document reference-prototype components under `research-ui/documents/`.
4. **Map lab rail icons** to existing or planned views; do not add ghost routes.
5. **AI panels always dashed + labeled inference**; never mix into solid sourced cards.
6. **Acceptance criteria:** empty/loading/error states present; counter-reading visible on ledger & hypothesis; no side-stripe accents; no hero KPI strip; Microfilm Dark tokens applied.
7. **Images (if generated later)** are inspiration only — translate into tokens/components/criteria before build.
8. **Next artifact:** implementation spec / agent handoff should reference **Selected Direction: Strong-fit** explicitly.
