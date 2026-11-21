import { READING_ROOM_TOKENS } from './reading-room'
import { RESEARCH_DESK_TOKENS } from './research-desk'

/** Flat map of CSS custom property names → OKLCH values for `styles/tokens.css`. */
export const CSS_TOKEN_MAP = {
  '--du-reading-ink': READING_ROOM_TOKENS.ink,
  '--du-reading-paper': READING_ROOM_TOKENS.paper,
  '--du-reading-leather': READING_ROOM_TOKENS.leather,
  '--du-reading-bronze': READING_ROOM_TOKENS.bronze,
  '--du-reading-bronze-soft': READING_ROOM_TOKENS.bronzeSoft,
  '--du-reading-metal': READING_ROOM_TOKENS.metal,
  '--du-reading-stamp': READING_ROOM_TOKENS.stamp,
  '--du-reading-panel': READING_ROOM_TOKENS.panel,
  '--du-reading-line': READING_ROOM_TOKENS.line,
  '--du-desk-base': RESEARCH_DESK_TOKENS.base,
  '--du-desk-panel': RESEARCH_DESK_TOKENS.panel,
  '--du-desk-card': RESEARCH_DESK_TOKENS.card,
  '--du-desk-line': RESEARCH_DESK_TOKENS.line,
  '--du-desk-ink': RESEARCH_DESK_TOKENS.ink,
  '--du-desk-muted': RESEARCH_DESK_TOKENS.muted,
  '--du-desk-amber': RESEARCH_DESK_TOKENS.amber,
  '--du-desk-teal': RESEARCH_DESK_TOKENS.teal,
  '--du-desk-purple': RESEARCH_DESK_TOKENS.purple,
  '--du-desk-green': RESEARCH_DESK_TOKENS.green,
} as const

export type CssTokenName = keyof typeof CSS_TOKEN_MAP
