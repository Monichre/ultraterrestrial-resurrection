# Design Audit — apossible.com/library

**Date:** 2026-07-09
**Method:** Live browser walkthrough (chrome-devtools MCP), programmatic interaction (the site's canvas is SVG-rendered, not DOM cards — see Findings)
**Why:** requested as a reference audit alongside a reflection on the "Ultra Terrestrial: Memory-First Vision Capture" document (external draft, not yet reconciled with this repo's PRODUCT.md/DESIGN.md)
**Evidence:** `docs/research/screenshots/apossible-library-overview.png`, `docs/research/screenshots/apossible-library-detail-view.png`

## What the page is

APOSSIBLE's Library is a curated research archive — essays, interviews, installations, personal devices, books — framed by three "foundational themes": care, inquisitiveness, self-control. It pairs a dark, full-bleed archival canvas on the left with a paper-toned reading panel on the right.

## Walkthrough findings

**The canvas is a hand-built SVG scene, not a card grid.** `elementFromPoint` at a card's coordinates returns an `<svg><path>`, three DOM levels below a `.visualisation` container holding ~300 SVG nodes. There is no `<img>`, no `<div class="card">` — every photograph, polaroid border, and typewritten label is drawn. This is a deliberate, expensive choice: it buys them uniform grain/tint across every asset and precise control over z-ordering and overlap, at the cost of accessibility (nothing here is screen-reader legible) and of standard DOM interaction (my first three click attempts on real DOM nodes hit zero-size wrapper elements; only dispatching a raw `MouseEvent` sequence at page coordinates worked — the same "handles don't listen for synthetic PointerEvents" class of problem this session already hit twice in our own `use-mindmap-agent` and `Handle` fixes).

**Selecting a card re-centers the whole scene around it**, not just highlights it. The clicked node lifts into a cream polaroid frame while everything else stays sepia-toned and slightly receded; a dashed line is drawn from the selected node to one related node elsewhere on the board; a faint circular guide ring persists across every state as a constant orientation anchor, never a decoration tied to one item.

**The right panel is a mode switch, not a permanent inspector.** At rest it's a themed filter (three labeled sliders — CARE / INQUISITIVENESS / SELF-CONTROL — plus a sortable Title/Type/Category table of every entry). On selection it becomes a full reading view: breadcrumb (`Menu → Interviews`), headline, body copy, a citation block set off by a thin left-hand dashed rule, embedded photograph. Nothing is a modal. The transition is the same panel changing its content, which keeps the canvas state (pan, zoom, selection) alive underneath at all times.

**Provenance is typographic, not chromatic.** Every card carries a small diamond-glyph tag — `◇ Reference`, `Interview`, `News`, `Concept` — mono, uppercase, low-key. Type is doing the classification work that color would do in a lesser version of this. Combined with the sepia/cream photographic treatment, the whole board reads as "archive" without a single decorative flourish — the atmosphere is structural, exactly the "uncanny because the relationships are uncanny, not because of decoration" principle articulated in the vision doc (§3).

**A contextual "Guide" popup** (`.help-popup-inner`, triggered from a corner control) explains the three-theme framework in place, without forcing a first-run tour. Low-commitment onboarding — closer to a tooltip than a scripted walkthrough.

## Strengths worth stealing

1. **One card, two states, no modal.** Detail is "the same object, expanded" rather than a new surface. Our `user-input-node` / dock pattern already does something adjacent for AI responses; this suggests record cards on the canvas could support the same in-place expansion instead of routing to a separate `DetailView`.
2. **Persistent circular guide as spatial anchor.** Costs nothing functionally but gives the eye one fixed reference point while everything else pans/zooms/re-centers — worth prototyping on the research canvas, especially once node density gets high.
3. **Dashed line = "this is a proposed relationship," not a committed one.** They use it for "related item" rather than our "AI-inferred vs. researcher-asserted" distinction, but the visual grammar is the same instinct we already encoded in `nodes.css` this session (dashed in-flight connection wire, solid on commit). Confirms the choice rather than contradicts it.
4. **Type-tag as the only classifier.** No color-coded category system, no icon soup — a single mono uppercase tag per card. Cheap to implement, reads instantly, ages well.

## Where it would fail Ultra Terrestrial's brief

The vision doc's core complaint about generic tools — "flattened into answers," "PDF graveyard," "map with pins" — doesn't apply here; APOSSIBLE is closer to a mood board than a research instrument. There's no evidentiary weight, no contradiction tracking, no distinction between a claim and its source, no competing readings. It's a single flat "Reference" tag for almost everything. That's fine for a design studio's curated bookshelf; it would be a regression for a system whose stated job is to keep "claim," "inference," and "resonance" epistemically separate (see `agent_inferences` reservation and the provenance rule already in `DESIGN.md`). The lesson to take is the *form* — archival SVG board, dashed-vs-solid, type-tag-as-classifier, panel-as-mode-switch — not the epistemics, which this project already has a stricter model for.

## On the vision document

The "Memory-First Vision Capture" draft is explicitly framed as pre-repo — "the soul... not a code-verified spec" — so it isn't being reconciled line-by-line against the codebase here. Two things are worth flagging for whoever does that reconciliation later:

- Its five-layer narrative structure (evidentiary → analytical → relational → mythopoetic → operational) and "claim temperature" states (Observed/Corroborated/Contested/Inferred/Speculative/Mythic-Resonant/Unverified/Disconfirmed) go considerably further than what exists today. The current system has exactly two live AI paths (mindmap agent, Prometheus chat) and one hard rule — `agent_inferences` never feeds retrieval — not a graded evidentiary-state model. Treat the doc as a target, not a status report.
- Its instinct that "claim" needs to stay a reserved, disciplined term matches this project's existing standing rule almost exactly. That's a good sign the two are pointed the same direction even though the vocabulary ("claim temperature," "resonance," "counter-reading") hasn't been reconciled with the code yet.

No code changes made this session; this is a reference audit only.
