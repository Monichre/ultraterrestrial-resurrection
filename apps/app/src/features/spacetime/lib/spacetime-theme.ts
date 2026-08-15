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
 * from the boards. Swapping registers should be a change to this file only —
 * that is why these are constants rather than hex scattered across components.
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
  faint: '#4d5c62',
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
