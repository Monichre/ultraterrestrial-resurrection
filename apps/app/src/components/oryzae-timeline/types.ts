import type { ReactNode } from 'react'

export type MemorySide = 'left' | 'right'

export type OryzaeNavItem = '今日' | '今週' | '今月' | '半年' | '今年'

export interface CardSpec {
  width: number
  bg: string
  pad: string
  baseRotate: number
  hoverRotate: number
  body: ReactNode
  shadow?: string
}

export interface MemoryNode {
  id: number
  side: MemorySide
  date: string | null
  dayLabel: string | null
  dimmed?: boolean
  card: CardSpec
}

export const ORYZAE_NAV_ITEMS: OryzaeNavItem[] = ['今日', '今週', '今月', '半年', '今年']

export const ORYZAE_COLORS = {
  void: '#1a1a1a',
  paper: '#e8e8e8',
  muted: '#9ca3af',
  faint: '#6b7280',
  accent: '#4a9e8e',
  accentSoft: '#5cb8a8',
  card: '#222222',
  cardWarm: '#262622',
  cardOlive: '#2a2a26',
  ink: '#d8d3c4',
  inkSoft: '#d1d1c8',
} as const
