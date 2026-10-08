---
target: connections-canvas storybook components + journey
total_score: 31
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:/Users/liamellis/Desktop/apps/ultraterrestrial-resurrection/apps/app/src/features/research-canvas/case-files/connections-canvas"
timestamp: 2026-10-08T12-24-10Z
slug: arch-canvas-case-files-connections-canvas-3b873c83
---
# Critique — Connections Canvas (Story 2 "Follow the thread")

Method: multi-agent roundtable (design-director · UX/journey · voice-contract/domain, isolated) + impeccable detector + scripted browser journey (puppeteer-core, 11 states, 1440px + 390px)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Tier counts + line samples in legend; ghost dashes surface hidden topology; +N chips quantify hidden records |
| 2 | Match System / Real World | 3 | Epistemic tiers, "counter-reading," "next trace," evidence basis — dossier language preserved end to end |
| 3 | User Control and Freedom | 3 | Expand/collapse per node, independent tier gating, removable pins, drawer closes 3 ways; no pin undo |
| 4 | Consistency and Standards | 4 | Reuses core-node-ui chrome, EVIDENTIARY_STATE_COLORS, NarrativeEdge dash grammar, EvidentiaryStateBadge, lucide icons |
| 5 | Error Prevention | 3 | Ghost edges prevent orphaned-node confusion; counter-reading slot makes every reading falsifiable; nothing destructive |
| 6 | Recognition Rather Than Recall | 3 | Legend annotates every gesture; tier badges inline on edges; label pills can still crowd at dense junctions |
| 7 | Flexibility and Efficiency | 2 | Canvas is mouse-first; +N chips and edge pills are now real buttons (tabbable, focus-visible) but no keyboard shortcuts or focus-to-inspect flow |
| 8 | Aesthetic and Minimalist Design | 4 | Restrained archival dark; all color budget spent on epistemic signal; collapsed `[ TIERS ]` legend at 390px; taped-note pin is characterful without kitsch |
| 9 | Error Recovery | 3 | Drawer: Escape / X / scrim; pins removable; collapse chips reverse every expansion |
| 10 | Help and Documentation | 3 | Legend hint line documents all four gestures; no first-run affordance for edge-pill inspection |
| **Total** | | **31/40** | **Strong, with two bounded gaps** |

## Design Specificity Verdict

Authored, not category-interchangeable. The interface could only belong to this product: epistemic tiers are the entire color budget, every reading carries a counter-reading slot and a falsifiability prompt ("what evidence would change this reading?"), and the pinned-note metaphor is an archival dossier gesture. Nothing here reads as generic graph-SaaS.

**Deterministic scan**: `impeccable detect --json` → `[]` (zero findings, both pre- and post-roundtable-fix runs) across connections-canvas/ and canvas-drawer.tsx.

**Browser evidence**: 11 scripted journey states captured to `.impeccable/roundtable/` — opening cluster, +N reveal, ego focus, tier toggle, drawer (relation/tier/evidence basis/counter-reading/next trace), session pin, fully-expanded stress, 390px.

## What's Working

- **Tier grammar is honest**: Corroborated now reads heavier than Observed (weight ramp, not just hue); Contested amber dash-dot; ghosted hidden tiers keep topology visible without promoting the claim.
- **Progressive disclosure preserves orientation**: +N reveal reframes only when new content lands offscreen; collapse chips restore; opening view is 6 nodes, not 15.
- **The drawer is a real dossier**: relation stamped as sentence, tier badge, evidence basis with source types, counter-reading with an explicit "none recorded yet — what cuts against this?" empty state, next-trace prompt.

## Priority Issues (post-fix status)

- **[P1] Keyboard path is partial**: chips/pills/close are real buttons with focus-visible rings and aria-labels, but there is no key to cycle nodes/edges and no shortcut layer. Fix: arrow-key node cycling + Enter-to-inspect. `$impeccable harden`
- **[P1] Edge-label crowding at junctions**: opaque pills mostly fixed occlusion, but two pills near the Nimitz/Fravor junction still nudge. Fix: label collision offset or labels-on-selection. `$impeccable polish`
- **[P2] Pin affordance is discoverable only via hint text**: dbl-click gesture has no visual invitation. Fix: subtle pane hint or context menu entry. `$impeccable onboard`
- **[P2] Fixture provenance labels**: via-list shows source *types* (DOCUMENT, TESTIMONY) but not titles/links yet — fine for fixture, needed before live data. `$impeccable document`

## Resolved this round (consensus blockers, all verified in re-captures)

- Observed vs Corroborated were visually identical → weight + luminance ramp
- Edge labels were passive divs on 2px SVG paths → real buttons, opaque pills, aria-labels
- No edge directionality → ArrowClosed markers on non-ghost edges
- Pulsing gradient drawer handle (unexplained right-edge artifact) → flat handle, hidden in this usage
- Drawer had no dismiss semantics → role=dialog, aria-modal, Escape, explicit close
- Amber +N chip collided with Contested amber → zinc dashed treatment
- Fixture misgradings (r5 Corroborated→Observed-classed, r12 inferred-as-contested) → re-graded with counter-readings
- Kevin Day revealed offscreen → conditional fitView on out-of-viewport reveal
- AATIP orphaned when Inferred tier hidden → ghost-edge topology (verified faint dash, non-interactive)

## Persona Red Flags

**Power user**: no keyboard shortcuts; no multi-select; pins are session-only with no export. Acceptable for fixture, flagged for live port.
**First-timer**: four gestures live in one small hint block; edge pills look decorative until hovered — hover affordance (border brightening) mitigates but doesn't announce clickability.
**Screen-reader user**: canvas is inherently visual; drawer is a labeled dialog; edge pills and chips carry aria-labels; node cards are not yet grouped under a navigable landmark.

## Roundtable consensus

Three isolated reviewers (design-director, UX/journey, voice-contract) returned PASS-WITH-FIXES; every shared blocker above is now fixed and re-verified in browser. Two P1s remain open and bounded — consensus: **PASSES for user review**, P1s deferred as named follow-ups.
