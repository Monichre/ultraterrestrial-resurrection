/** Techno-analytical register — research desk / HUD surfaces. */
export const RESEARCH_DESK_TOKENS = {
  base: 'oklch(0.14 0.02 255)',
  panel: 'oklch(0.19 0.02 255)',
  card: 'oklch(0.24 0.02 255)',
  line: 'oklch(0.55 0.02 255 / 0.35)',
  ink: 'oklch(0.92 0.01 255)',
  muted: 'oklch(0.68 0.02 255)',
  amber: 'oklch(0.78 0.14 75)',
  teal: 'oklch(0.72 0.1 195)',
  purple: 'oklch(0.68 0.14 300)',
  green: 'oklch(0.72 0.12 155)',
} as const

export type ResearchDeskTokenKey = keyof typeof RESEARCH_DESK_TOKENS
