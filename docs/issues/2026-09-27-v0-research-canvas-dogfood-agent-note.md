# Agent Note — v0 Research Canvas dogfood: suggested-card click flow is an animated dead end

**Date:** 2026-09-27 05:31 CDT
**Tested by:** Hermes Agent (dogfood skill, browser-harness CDP + deployed-chunk code analysis)
**Target:** https://v0-ultraterrestrial-research-canva.vercel.app/ (the v0 prototype for the Research Canvas direction)
**Evidence:** [`docs/dogfood-output/2026-09-27-v0-research-canvas-suggested-card-flow/`](../dogfood-output/2026-09-27-v0-research-canvas-suggested-card-flow/) — full report, reusable behavior-spec prompt, 10 screenshots
**TODO registration:** **T-065** in [`docs/plans/TODO.md`](../plans/TODO.md)

---

## Why every agent touching Research Canvas should read this

Liam ran a dogfood pass on the v0 "Ultraterrestrial Research Canvas" prototype to mine it for UX patterns. The prototype's landing → suggested-card → guided-tour flow is the exact interaction our Research Canvas work (T-053 / DMGD-219, RC-P0) is designing toward. Two things matter:

1. **The good parts are worth stealing** — they were verified at runtime AND at code level (recovered from the deployed Next.js chunk).
2. **The fatal flaw is the exact trap this repo's guided-tour philosophy already warns against** — a gorgeous animated flow that goes nowhere. See the "Learned User Preferences" rule: guided tours must be traversable evidence graphs, not scrolling articles or decorative chrome.

## What the prototype gets right (verified, steal these)

- **Card-deck fan-out with per-card rotation** — hover spreads 4 cards to ±200px/±70px with −6°/+6° rotation; click pins the chosen card (scale 0.8, zIndex 10) and hides siblings. Feels physical.
- **The 600ms "pin" beat before submit** — a deliberate dramatic pause between click and the command appearing in the composer.
- **Character-by-character typing of the command into the assistant panel header** — makes the card→panel handoff feel conversational, not navigational.
- **Width-animated panel reveal** (0.6s ease) instead of an instant modal pop; body, then decorative elements, then `complete` — a staged choreography with real rhythm.
- **Card click → composer echo** (sparkle + command text) keeps one visible source of truth for user intent.

## What is broken (do NOT replicate)

- **All three CTAs in the intro panel ("Guided Tour" / "Deep Research" / "Explore Network") are dead ends.** The entire click handler is `s({ target: { value: \`Tell me about ${e.title.toLowerCase()}\` } })` — it rewrites a header string and does nothing else. No navigation, no fetch, no canvas mutation. Verified 3× (one per row, 18s observation each): zero DOM change, zero network activity, zero console errors.
- **Panel body is hardcoded and topic-agnostic** — clicking "Roswell" vs "Ancient Archaeology" yields the identical "Ultraterrestrial Research" body; the topic lives only in the typed header string.
- **Empty-state header never clears** — "Start your investigation by typing a query below" stays on screen after an investigation has started.
- **600ms dead gap** between card click and any visible composer feedback.
- **Close affordance nearly invisible** — 12px X in a 24px circle, no Esc handler.
- **Intentional blurred decorative pill** overlaps interactive rows and reads as a rendering bug in every vision pass.

## The lesson for T-053 / RC-P0

Every animation beat in this prototype is good chrome around a missing core. If we adopt the deck, the typing header, or the staged reveal, the binding requirement is that the row click **lands the user in a traversable evidence graph** (claim → basis → counterpoint → unresolved → next waypoint contract) — the click must mutate real canvas/graph state, not echo a string. Animation is the garnish; the waypoint graph is the meal.

## Reproduce

1. Open https://v0-ultraterrestrial-research-canva.vercel.app/
2. Click any suggested card (deck pins, composer fills with "Start guided tour: <topic>")
3. Press Enter → "Loading..." flash → intro panel types its header, reveals body
4. Click "Guided Tour" (or either other row) → header text changes, nothing else, ever

Full issue-by-issue report with severity: [`report.md`](./report.md). Reusable prompt with recovered source code: [`prompt-card-click-behavior.md`](./prompt-card-click-behavior.md).
