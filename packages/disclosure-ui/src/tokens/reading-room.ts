/** Archival-material register — reading room / dossier surfaces. */
export const READING_ROOM_TOKENS = {
  ink: 'oklch(0.22 0.02 70)',
  paper: 'oklch(0.88 0.03 85)',
  leather: 'oklch(0.18 0.02 55)',
  bronze: 'oklch(0.62 0.09 75)',
  bronzeSoft: 'oklch(0.62 0.09 75 / 0.28)',
  metal: 'oklch(0.42 0.02 70)',
  stamp: 'oklch(0.48 0.18 25)',
  panel: 'oklch(0.16 0.015 55)',
  line: 'oklch(0.55 0.04 75 / 0.45)',
} as const

export type ReadingRoomTokenKey = keyof typeof READING_ROOM_TOKENS
