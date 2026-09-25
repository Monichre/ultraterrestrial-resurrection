import {create} from '@storybook/theming'

// Theme values aligned to tokens from src/app/globals.css (dark mode)
// Primary accent color and neutrals derived from CSS vars
const ACCENT = '#27F1FF'
const BG_DARK = '#000000'
const CONTENT_BG = '#0a0a0a'
const TEXT = '#e5e7eb'
const BAR_BG = '#0f172a'
const BORDER = '#1f2937'

export default create({
  base: 'dark',
  brandTitle: 'Ultraterrestrial',
  brandUrl: 'ultraterrestrial.app',
  brandImage: '/ultraterrestrial-logo-radar.svg',
  colorPrimary: ACCENT,
  colorSecondary: '#78efff',

  appBg: BG_DARK,
  appContentBg: CONTENT_BG,
  appBorderColor: BORDER,
  appBorderRadius: 6,

  fontBase: 'Inter, system-ui, ui-sans-serif, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  fontCode: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',

  textColor: TEXT,
  barBg: BAR_BG,
  barTextColor: TEXT,
  barSelectedColor: ACCENT,
})
