import type {Meta, StoryObj} from '@storybook/react'
import * as React from 'react'
import {
  FONT_LUKAS_SANS,
  FONT_MONUMENT_GROTESK,
  FONT_MONUMENT_GROTESK_MONO,
  FONT_NEUE_HAAS_GROTESK,
  FONT_JUST_ANOTHER_HAND,
  FONT_JET_BRAINS_MONO,
  FONT_MARTIAN_MONO,
  FONT_NOTO_SANS,
  FONT_CAVEAT,
  FONT_SPECIAL_ELITE,
  FONT_ANTON,
  FONT_SPACE_GROTESK,
  FONT_LEAGUE_SPARTAN,
} from '@/app/fonts'
import {Typography} from './Typography'

type FontSpec = {
  label: string
  cssVar: string
  className: string
}

const FONTS: FontSpec[] = [
  {
    label: 'Neue Haas Grotesk',
    cssVar: FONT_NEUE_HAAS_GROTESK.variable,
    className: 'font-neue-haas',
  },
  {label: 'Monument Grotesk', cssVar: FONT_MONUMENT_GROTESK.variable, className: 'font-monument'},
  {
    label: 'Monument Grotesk Mono',
    cssVar: FONT_MONUMENT_GROTESK_MONO.variable,
    className: 'font-monument-mono',
  },
  {label: 'Lukas Sans', cssVar: FONT_LUKAS_SANS.variable, className: 'font-lukas'},
  {
    label: 'Just Another Hand',
    cssVar: FONT_JUST_ANOTHER_HAND.variable,
    className: 'font-handwriting',
  },
  {label: 'Caveat', cssVar: FONT_CAVEAT.variable, className: 'font-caveat'},
  {label: 'Special Elite', cssVar: FONT_SPECIAL_ELITE.variable, className: 'font-typewriter'},
  {label: 'Anton', cssVar: FONT_ANTON.variable, className: 'font-anton'},
  {
    label: 'JetBrains Mono',
    cssVar: FONT_JET_BRAINS_MONO.variable,
    className: 'font-jetbrains-mono',
  },
  {label: 'Martian Mono', cssVar: FONT_MARTIAN_MONO.variable, className: 'font-martian-mono'},
  {label: 'Noto Sans', cssVar: FONT_NOTO_SANS.variable, className: 'font-noto-sans'},
  {label: 'Space Grotesk', cssVar: FONT_SPACE_GROTESK.variable, className: 'font-space-grotesk'},
  {label: 'League Spartan', cssVar: FONT_LEAGUE_SPARTAN.variable, className: 'font-league-spartan'},
]

const meta: Meta = {
  title: 'Design System/Typography/Fonts',
  parameters: {layout: 'fullscreen'},
}

export default meta
type Story = StoryObj

const cardStyle: React.CSSProperties = {
  padding: 16,
  border: '1px solid #222',
  borderRadius: 8,
  background: 'rgba(255,255,255,0.02)',
}

export const AllFonts: Story = {
  render: () => (
    <div style={{padding: 24}}>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16}}>
        {FONTS.map((font) => (
          <section key={font.label} className={`${font.cssVar}`} style={cardStyle}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
              <Typography variant='data-label'>Font</Typography>
              <Typography variant='data-value'>{font.label}</Typography>
            </div>
            <div className={font.className}>
              <Typography variant='h4'>The quick brown fox</Typography>
              <Typography variant='body'>jumps over the lazy dog 0123456789</Typography>
              <Typography variant='caption' color='muted'>
                ABCDEFGHIJKLMNOPQRSTUVWXYZ
              </Typography>
            </div>
          </section>
        ))}
      </div>
    </div>
  ),
}

export const FontWeightsAndSizes: Story = {
  render: () => (
    <div style={{padding: 24}}>
      {FONTS.map((font) => (
        <section
          key={font.label}
          className={`${font.cssVar}`}
          style={{...cardStyle, marginBottom: 16}}>
          <Typography variant='subheading'>{font.label}</Typography>
          <div
            className={font.className}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 12,
              marginTop: 8,
            }}>
            {(['light', 'normal', 'medium', 'semibold', 'bold', 'black'] as const).map((w) => (
              <div key={w}>
                <Typography variant='caption' color='muted'>
                  weight="{w}"
                </Typography>
                <Typography variant='body' weight={w as any}>
                  The quick brown fox
                </Typography>
              </div>
            ))}
            {(['xs', 'sm', 'base', 'lg', 'xl', '2xl'] as const).map((s) => (
              <div key={s}>
                <Typography variant='caption' color='muted'>
                  size="{s}"
                </Typography>
                <Typography variant='body' size={s as any}>
                  The quick brown fox
                </Typography>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
}
