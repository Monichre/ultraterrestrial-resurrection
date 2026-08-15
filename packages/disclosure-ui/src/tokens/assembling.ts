/** Assembling-components semantic aliases. Runtime values live in styles/tokens.css. */

export const ASSEMBLING_COLOR_ALIASES = {
  '--color-bg-primary': 'var(--du-desk-base)',
  '--color-bg-secondary': 'var(--du-desk-panel)',
  '--color-bg-tertiary': 'var(--du-desk-card)',
  '--color-bg-elevated': 'var(--du-desk-card)',
  '--color-text-primary': 'var(--du-desk-ink)',
  '--color-text-secondary': 'var(--du-desk-muted)',
  '--color-text-tertiary': 'var(--du-desk-muted)',
  '--color-border-primary': 'var(--du-desk-line)',
  '--color-border-focus': 'var(--color-primary)',
  '--color-primary': 'var(--du-desk-amber)',
  '--color-success': 'var(--du-desk-green)',
  '--color-warning': 'var(--du-desk-amber)',
  '--color-error': 'var(--du-reading-stamp)',
  '--color-info': 'var(--du-desk-teal)',
} as const

export const ASSEMBLING_CHART_COLORS = {
  '--chart-color-1': 'var(--du-desk-teal)',
  '--chart-color-2': 'var(--du-desk-amber)',
  '--chart-color-3': 'var(--du-desk-green)',
  '--chart-color-4': 'var(--du-desk-purple)',
  '--chart-color-5': 'var(--du-reading-stamp)',
} as const

export const ASSEMBLING_SPACING = {
  '--spacing-xs': 'var(--space-1)',
  '--spacing-sm': 'var(--space-2)',
  '--spacing-md': 'var(--space-4)',
  '--spacing-lg': 'var(--space-6)',
  '--spacing-xl': 'var(--space-8)',
  '--spacing-2xl': 'var(--space-12)',
} as const

export const ASSEMBLING_DURATION = {
  '--duration-fast': '150ms',
  '--duration-normal': '200ms',
  '--duration-slow': '300ms',
} as const

export const ASSEMBLING_Z_INDEX = {
  '--z-dropdown': 1000,
  '--z-sticky': 1020,
  '--z-fixed': 1030,
  '--z-modal-backdrop': 1040,
  '--z-modal': 1050,
  '--z-popover': 1060,
  '--z-tooltip': 1070,
  '--z-toast': 1080,
} as const

export type AssemblingColorAlias = keyof typeof ASSEMBLING_COLOR_ALIASES
export type AssemblingChartColor = keyof typeof ASSEMBLING_CHART_COLORS
