/**
 * Spacetime Canvas visual tokens.
 *
 * Register: **techno-analytical** (docs/vision/DESIGN_REGISTERS.md) — coordinates,
 * HUD/OSINT chrome, near-black ground with cyan instrument light. Sampled from
 * `docs/vision/storyboards/concept-01-spacetime-canvas.png`, which is the board
 * literally titled "SPACETIME CANVAS"; concept-02 frame 2 uses the same palette.
 *
 * The warmer microfilm study at `docs/vision/prototypes/03-temporal-geospatial-
 * observatory.html` shares this *layout* (72px rail · ~68px topbar · docked
 * bottom instrument) but not this palette. Layout was taken from both; colour
 * from the boards.
 *
 * ## Read this before trusting the constants below
 *
 * **The neutrals are NOT single-sourced, and a register swap is NOT one file.**
 * An earlier version of this comment claimed it was. It was not true then and
 * is not true now: the `STC` neutrals are referenced **zero** times by the 14
 * components (audit 2026-09-09). Every panel, label and hairline carries the
 * hex inline as a Tailwind arbitrary value.
 *
 * That is not laziness — Tailwind's scanner only sees *static* class strings,
 * so `text-[${STC.faint}]` never emits a rule. The constants here and the
 * literals in components are a hand-maintained mirror. Change one, grep the
 * other.
 *
 * The real fix is to declare these as CSS custom properties and use
 * `text-[var(--stc-faint)]`, which is static enough for the scanner and makes
 * the swap genuinely one file. Still not done, but no longer blocked — the
 * reason given here previously (an "unexplained Tailwind emission failure")
 * was wrong: it was never an emission problem. Doing the custom-property
 * migration is now just unscheduled work.
 *
 * `STC_LAYER_COLOR` / `STC_EPISTEMIC_COLOR` below ARE genuinely single-sourced
 * (24 references) — they are passed to Mapbox as JS values, never as classes,
 * which is exactly why they escaped the problem.
 */

export const STC = {
  /** Page ground — darker than the map so the globe reads as the lit object. */
  ground: '#05080b',
  /** Docked chrome surfaces. Translucent so the globe shows through at edges. */
  panel: 'rgba(8,13,17,0.82)',
  panelSolid: '#080d11',
  /** Hairlines. Cool, not neutral — neutral greys read as generic dashboard. */
  line: 'rgba(125,190,210,0.16)',
  lineStrong: 'rgba(125,190,210,0.32)',
  text: '#dbe7ea',
  muted: '#7d8f95',
  /**
   * Third de-emphasis tier. Was `#4d5c62` until 2026-09-09, which failed WCAG
   * AA at **2.81:1** on `panelSolid` and accounted for all 36 contrast failures
   * on the surface — one value, 18 call sites.
   *
   * `#707f86` is the *lowest* value that clears 4.5:1 on both grounds
   * (4.85 on `ground`, 4.71 on `panelSolid`). Chosen deliberately over simply
   * reusing `muted`: these labels are 8–10px, so they need small-text AA, but
   * collapsing `faint` into `muted` would erase the two-tier hierarchy the
   * chrome depends on to keep captions behind values. Staying just over the
   * line preserves the step while passing.
   *
   * If you lower this, re-check it: 8–10px mono is small text, 4.5:1, not 3:1.
   *
   * It also absorbed `#6b7c83` (4.49 — missed by 0.01) and `#5d6d74` (3.63) on
   * 2026-09-09. Those were three near-identical greys doing the same job at
   * three different contrast ratios, two of them failing. One tier, one value.
   */
  faint: '#707f86',
  /**
   * Inactive controls only — layer rows with no records, unreachable
   * credibility tiers. Always paired with `cursor-not-allowed` +
   * `aria-disabled`.
   *
   * 2.17:1, and deliberately left failing: WCAG 1.4.3 exempts text that is
   * part of an inactive user interface component, and here the dimness *is*
   * the affordance — it is how "there is nothing behind this control" is
   * communicated before the user clicks. Raising it to AA would make disabled
   * rows read as available. Never use this for text the user can act on.
   */
  inactive: '#3f4b50',
} as const

/**
 * Layer colours. These are the legend — the globe paint, the layer panel dots,
 * and the dial chips all read from here, so a swatch can never disagree with
 * the pin it claims to describe.
 */
export const STC_LAYER_COLOR = {
  sightings: '#4fd8e8',
  historicalEvents: '#f0a860',
  investigations: '#8b7fd4',
  correlated: '#e879c8',
} as const

/**
 * Epistemic colours. Deliberately *not* the layer colours: a layer says what
 * kind of thing a record is, epistemic status says how well it is attested.
 * Collapsing them would make "documented" and "sighting" the same visual claim.
 */
export const STC_EPISTEMIC_COLOR = {
  documented: '#4fd8e8',
  inferred: '#8fa3ab',
  disputed: '#e8748c',
} as const

/** Shared class fragments so every docked panel is the same object. */
export const stcPanel =
  'rounded-xl border border-[rgba(125,190,210,0.16)] bg-[rgba(8,13,17,0.82)] backdrop-blur-md'

/** Micro-label: mono, uppercase, wide tracking — the board's caption voice. */
export const stcLabel =
  'font-mono text-[9px] uppercase tracking-[0.22em] text-[#7d8f95]'
