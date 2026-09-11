# impeccable audit — Spacetime Canvas

**Target:** http://localhost:3737/spacetime · `apps/app/src/features/spacetime/`
**Date:** 2026-09-09 · **Register:** product (explicit in PRODUCT.md)
**Method:** live DOM measurement at 1600×960 and 500×844, plus static scan of 19 feature files.

> DESIGN.md lists **Temporal Observatory as explicitly out of scope**, so this surface
> has no canonical visual contract. Theming is scored against the app's existing
> `--ut-*` tokens and the shared OKLCH law, with that caveat noted.

## Audit Health Score

| # | Dimension | Score | Key finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 2 | 36 text nodes below WCAG AA contrast; worst 2.81:1 |
| 2 | Performance | 3 | 60fps measured idle and under globe drag; 0 long frames |
| 3 | Responsive | 1 | No breakpoints; header wraps one letter per line at 500px |
| 4 | Theming | 1 | 228 hard-coded hex/rgba, 0 design tokens, 0 OKLCH |
| 5 | Anti-Patterns | 3 | Distinctive and intentional; glassmorphism near-default |
| **Total** | | **10/20** | **Acceptable — significant work needed** |

## Anti-Patterns verdict: PASS

Does this look AI-generated? **No.** It is a committed, legible instrument aesthetic that
could not be guessed from the category. Checked and clean:

- Side-stripe borders: **none**
- Gradient text / `bg-clip-text`: **none**
- Hero-metric template: **none** (the topbar readout is compact and functional)
- Identical card grids: **none**
- Modal-as-first-thought: **none** — the inspector is a docked aside

Two real tells:

- **Glassmorphism as default** — 7 live `backdrop-blur(12px)` layers (inspector, legend,
  dial, 3× map controls, readout). The skill allows blur "rare and purposeful"; 7 on one
  surface is the default setting, not a decision.
- **Em dashes in prose copy** — `event-inspector.tsx:28,29,30`. Note the standalone `'—'`
  at `:118,:126` is the absent-data marker and is *correct*; only the sentence-joining
  dashes violate.

## Detailed findings

### [P1] 36 text nodes fail WCAG AA contrast
**Location:** every component using `#4d5c62` (STC.faint) · **Category:** Accessibility
**Measured:** worst 2.81:1 against `#05080b`; AA requires 4.5:1. Affects "On canvas",
"Mapped", "Span", all four rail labels, the narrative footer, the topbar subtitle.
**Impact:** the labels naming every readout are the least readable text on screen.
**WCAG:** 1.4.3 Contrast (Minimum). **Fix:** lift `faint` to ≈`#7d8f95` (already the
`muted` value, which passes). Single-token change, ~36 call sites inherit it.

### [P1] No responsive behaviour below ~900px
**Location:** `spacetime-canvas-shell.tsx` grid · **Category:** Responsive
**Measured at 500px:** header lockup wraps to one letter per line ("O/B/S/E"); evidence
legend clips mid-word; "ADAPTIVE TEMPORA L DIAL" breaks; 8+ elements spill past the right
edge (right 507–527 vs viewport 500); narrative column takes 304px = **61% of viewport**,
leaving ~124px of globe.
**Impact:** unusable under tablet width. **Fix:** collapse the narrative to a sheet and
the rail to icons below `lg`. Screenshot: `docs/dogfood-output/spacetime-demo-2026-09-09/05-narrow-500px.png`
**Caveat:** Chrome clamps to 500px minimum, so true 390px was **not tested**.

### [P1] 228 hard-coded colors, zero design tokens
**Location:** 15 of 19 feature files · **Category:** Theming
**Measured:** 228 hex/rgba literals; `--ut-*` usage = **0**; `oklch()` usage = **0**.
`lib/spacetime-theme.ts` exists to centralise this but its neutral palette `STC` is
referenced **0 times** in components — only `STC_LAYER_COLOR`/`STC_EPISTEMIC_COLOR` (22
uses) took. The file's own docstring claims "a register swap is one file"; that is
currently false for every neutral.
**Impact:** no theme switching, no dark/light variance, register swap requires 15 files.

### [P2] 28 of 44 interactive targets below 44×44px
**Location:** `playback-transport.tsx`, `waypoint-narrative.tsx` · **Category:** A11y
**Measured:** speed buttons 25×14, transport buttons 20×20, chapter arrows 24×24.
**WCAG:** 2.5.8 Target Size (AA, 24×24 minimum) — the 25×14 speed buttons fail even that.
**Mitigation:** desktop-instrument surface with mouse input, so impact is lower than the
count suggests. Fix by padding the hit area without growing the visual control.

### [P2] Body text at 7–8px
**Location:** rail labels (7px), topbar readout labels (8px) · **Category:** A11y
**Impact:** below the practical floor for sustained reading; compounds the contrast
failure on the same nodes.

### [P2] Four arbitrary text-size classes not emitted
**Location:** `spacetime-topbar.tsx:38,41`, `waypoint-narrative.tsx`
"Temporal Observatory" (`text-[10px]`), its subtitle (`text-[9px]`), "Guided
investigation" and "Guided · scroll advances the chapter" (`text-[8px]`) all compute to
**15px** — the inherited default. 27 of 29 other `text-[8px]` nodes are correct, so this
is per-class, not app-wide. Survives a cache-ignoring reload. Root cause **not
established**: zero font-size rules are enumerable in `document.styleSheets` (1,066 rules)
or `adoptedStyleSheets`.
**Effect:** header lockup and narrative headings render ~50% oversized vs the storyboard.

### [P3] `transition-all` on dial chips
**Location:** `temporal-dial.tsx:169` · **Category:** Performance
Animates every property including layout. Narrow to `transition-colors`.

## Patterns & systemic issues

1. **The token layer was designed but never adopted.** One file centralises the palette;
   the components ignore its neutrals and inline hex. This is the root of the Theming
   score and makes the contrast fix 36× harder than it should be.
2. **One faint neutral causes every contrast failure.** `#4d5c62` is a single-value fix
   with outsized payoff.
3. **Desktop-only assumption is unstated.** PRODUCT.md says users work "on large screens",
   which may justify the responsive gap — but nothing in the code declares a minimum
   width or degrades deliberately, so it reads as an oversight rather than a decision.

## Positive findings

- **Performance is genuinely good.** 60fps idle *and* during globe drag, 0 frames >20ms,
  28 `useMemo`. The blur stack costs nothing measurable here.
- **Focus is handled.** Every one of 14 sampled controls shows a 2px amber outline (app
  globals). `aria-disabled` rail items are correctly non-tabbable — inert without being a
  keyboard trap.
- **Landmark and ARIA structure is solid**: `main`, `navigation`, `complementary`,
  `region`, descriptive `aria-label` on every icon-only control, `aria-pressed` on toggles.
- **The epistemic-honesty design survives contact with real data.** `SOURCES —` /
  `CREDIBILITY —` each print a reason ("corpus carries no score") rather than inventing a
  number. This is the product's stated soul, implemented literally.
- **Distinctive.** Passes both altitudes of the category-reflex check.

## Recommended commands, priority order

1. **[P1] `impeccable colorize`** — lift `#4d5c62`, clearing all 36 contrast failures.
2. **[P1] `impeccable adapt`** — breakpoints below `lg`; collapse narrative and rail.
3. **[P1] `impeccable extract`** — move the 228 literals into `--ut-*` OKLCH tokens and
   make `STC` actually load-bearing.
4. **[P2] `impeccable clarify`** — remove em dashes from inspector prose, keeping the
   `—` absent-data markers.
5. **[P3] `impeccable polish`** — final pass.
