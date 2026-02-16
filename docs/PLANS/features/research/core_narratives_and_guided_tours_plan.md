# Core Narratives and Guided Tours — Promotion Plan

Generated: 2025-09-21 02:55:49 CDT
Owner: Augment Agent

## Goal
Evolve sufficiently thought‑through research items into Core Narratives (a.k.a. Threads/Narratives) and Guided Tours as first‑class artifacts with clear lifecycle, schema, commands, and automation.

## 1) Taxonomy and Concepts
- Research Item (current): Raw→refined investigation units in RESEARCH_QUEUE.md
- Core Narrative (Thread/Narrative): Curated storyline that synthesizes research into an explanatory artifact
- Guided Tour: Interactive, stepwise “show me” experience built from a Core Narrative (scenes/steps, assets, references)
- Trackboard mapping:
  - Paradigm Tracks: conceptual narratives (theories, frameworks, origins)
  - Project Threads: application-specific threads tied to Ultraterrestrial

## 2) Lifecycle and Promotion Criteria
- Research Item: New → Active → Refined → Candidate Narrative → Promoted → Archived
- Core Narrative: Draft → In Review → Published → Deprecated
- Guided Tour: Scaffolded → Authored → Playtested → Published
- Readiness checklist:
  - Narrative thesis + problem statement
  - 5–10 authoritative references with citations
  - Structured outline with arc and counterpoints
  - Evidence summary and known‑unknowns
  - Tags/category + links to supporting research items
  - For tours: 5–9 steps with user goals, assets, expected insights

## 3) File/Directory Structure
- RESEARCH_QUEUE.md (existing)
- narratives/
  - narratives/<slug>.md (front matter + body)
- tours/
  - tours/<slug>/tour.yaml (steps, assets, wiring)
  - tours/<slug>/assets/* (images/docs)
- Cross‑links:
  - Narrative front matter: related_research_ids, tags, category
  - Research item metadata: “Promoted: <slug> @timestamp”

## 4) Schemas (front matter)
Core Narrative front matter (YAML):
---

```
title: Zeta Reticuli — Origins Narrative
slug: zeta-reticuli-origins
status: draft
type: narrative
tags: [origins, abduction, astronomy]
related_research_ids: [R-0021, R-0033]
summary: Thesis and scope in 1–2 sentences.
```

Guided Tour front matter (YAML):

```
title: Tour — Zeta Reticuli Map Debate
slug: tour-zeta-map
status: scaffolded
narrative_slug: zeta-reticuli-origins
steps: 7
assets_dir: tours/tour-zeta-map/assets
```

Tour steps scaffold (YAML):

```
steps:
  - id: intro; goal: context; ref: refs/overview.md
  - id: map; goal: star-map analysis
  - id: evidence; goal: weigh claims vs data
  - id: counter; goal: present counterarguments
  - id: synth; goal: synthesize + takeaways
```

## 5) Command/Workflow Design
- /narrative promote "<research-item-title-or-id>" --slug "<slug>" [--type guided|narrative|both]
  - Creates narratives/<slug>.md from template, links back to research item, sets research “Promoted”
- /narrative edit "<slug>"
- /narrative list [--status draft|review|published]
- /tour scaffold "<narrative-slug>" --slug "<tour-slug>" --steps 7
- /tour publish "<tour-slug>"
Automation hooks:
- On promote: append to RESEARCH_QUEUE.md item: “- Promoted: <slug> (YYYY-MM-DD HH:MM:SS)”
- On publish: update Queue Statistics and create a “Published Narratives” index
Validation:
- Check references exist/resolve; enforce minimal fields; warn on missing summary/tags

## 6) Templates and Authoring Guides
Core Narrative body skeleton:

```
## Context & Thesis
## Evidence
## Counterpoints
## Synthesis
## Open Questions
## References
```

Guided Tour authoring:
- Each step includes: goal, materials, action, expected insight, timebox, output

## 7) Governance and Quality Gates
- Review checklist: claims cross‑checked; citations formatted; scope clear; counters included
- Versioning: keep CHANGELOG in each narrative/tour folder
- Status transitions to “Published” require reviewer sign‑off
- Attribution of sources; speculative sections are explicitly flagged

## 8) Analytics and Signals
- Metrics: time‑to‑promotion, number of sources, completeness score, engagement (views/plays), step drop‑off
- Signals for “candidate for promotion”: long notes, high refs count, explicit outline present, repeated mentions/links

## 9) Roadmap (Phased)
- Phase 0 — Naming decision (1 day): finalize terms (Core Narrative vs Thread; Guided Tour naming)
- Phase 1 — Schema + Scaffolding (1–2 days): create directories, templates, indexes
- Phase 2 — Commands + Promotion Flow (2–4 days): implement /narrative and /tour commands; wire cross‑links
- Phase 3 — Validation + Publishing UX (2–4 days): add checkers; minimal renderer or doc site integration
- Phase 4 — Migration + Curation (ongoing): promote top 3–5 mature items; set review cadence

## 10) Open Decisions
- Final terminology: “Core Narrative” vs “Thread”
- Minimal references threshold for promotion (e.g., ≥ 5)
- Where to host rendered tours (docs site vs app module)
- Reviewer roles and sign‑off workflow

## Recommendation
Adopt “Core Narrative” for curated stories and “Guided Tour” for interactive flows.
Start pilot promotions:
- Zeta Reticuli Thread → Core Narrative
- Advanced Propulsion Thread → Core Narrative + Tour scaffold

