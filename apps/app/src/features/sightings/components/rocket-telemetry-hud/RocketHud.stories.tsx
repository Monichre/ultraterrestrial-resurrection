'use client'

import type {Meta, StoryObj} from '@storybook/nextjs'
import {fn} from '@storybook/test'
import {RocketHud} from './RocketHud'
import {SAMPLE_HOTSPOTS, SAMPLE_POSITION_LOG, SAMPLE_SIGHTINGS_METRICS} from './fixtures'

const meta = {
  title: 'Features/Sightings/RocketTelemetryHud',
  component: RocketHud,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof RocketHud>

export default meta

type Story = StoryObj<typeof meta>

/** Pixel-faithful v0 reference HUD (solar map center). */
export const ReferenceHud: Story = {}

/** Sightings-adapted rails with placeholder globe stage. */
export const SightingsChrome: Story = {
  args: {
    identityLabel: 'UAP-SCAN-01',
    metrics: SAMPLE_SIGHTINGS_METRICS,
    hotspots: SAMPLE_HOTSPOTS,
    positionLog: SAMPLE_POSITION_LOG,
    showSaturnFocus: false,
    onHotspotFocus: fn(),
    centerOverlay: (
      <div className='absolute left-3 top-3 rounded border border-hud-border bg-black/80 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-hud-text-secondary'>
        Year / time controls
      </div>
    ),
    center: (
      <div className='flex h-full w-full items-center justify-center border border-hud-border-faint bg-black/40'>
        <div className='text-center font-mono text-xs tracking-[0.2em] text-hud-text-secondary'>
          <div className='mb-2 text-hud-accent'>◉</div>
          3D GLOBE STAGE
          <div className='mt-1 text-hud-text-muted'>HudUapInterface → telemetry mode</div>
        </div>
      </div>
    ),
  },
}
