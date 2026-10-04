'use client'

import type {Meta, StoryObj} from '@storybook/nextjs'
import {fn} from '@storybook/test'
import {FloatCard} from './FloatCard'
import {MemoryRow} from './MemoryRow'
import {OryzaeTimeline} from './OryzaeTimeline'
import {SAMPLE_MEMORIES} from './fixtures'
import {ORYZAE_COLORS} from './types'

const meta = {
  title: 'Components/OryzaeTimeline',
  component: OryzaeTimeline,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    memories: SAMPLE_MEMORIES,
    initialNav: '今週',
    showIndexLink: false,
    onNavChange: fn(),
  },
} satisfies Meta<typeof OryzaeTimeline>

export default meta

type Story = StoryObj<typeof meta>

/** Full memory timeline — vertical spine with floating cards. */
export const Default: Story = {}

/** Range nav starts on 今日. */
export const TodayRange: Story = {
  args: {
    initialNav: '今日',
  },
}

/** Shows the fixed Index → link (Storybook-safe href). */
export const WithIndexLink: Story = {
  args: {
    showIndexLink: true,
    indexHref: '#index',
  },
}

/** Alternate brand title. */
export const CustomTitle: Story = {
  args: {
    title: 'Ultraterrestrial',
  },
}

/** Isolated floating cards (hover in canvas). */
export const FloatingCards: StoryObj = {
  render: () => (
    <div
      style={{
        minHeight: '100vh',
        background: ORYZAE_COLORS.void,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 48,
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 48,
      }}>
      {SAMPLE_MEMORIES.map((memory) => (
        <FloatCard key={memory.id} spec={memory.card} hovered={false} />
      ))}
    </div>
  ),
}

/** Single row with left card + date label. */
export const SingleRow: StoryObj = {
  render: () => (
    <div
      style={{
        minHeight: '100vh',
        background: ORYZAE_COLORS.void,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
      }}>
      <div style={{width: '100%', maxWidth: 896, position: 'relative'}}>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: 1,
            background: 'rgba(74,158,142,0.2)',
            transform: 'translateX(-50%)',
          }}
        />
        <MemoryRow memory={SAMPLE_MEMORIES[0]} index={0} total={1} />
      </div>
    </div>
  ),
}

/** Dimmed “昨日” memory undims on hover. */
export const DimmedMemory: StoryObj = {
  render: () => (
    <div
      style={{
        minHeight: '100vh',
        background: ORYZAE_COLORS.void,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
      }}>
      <div style={{width: '100%', maxWidth: 896}}>
        <MemoryRow memory={SAMPLE_MEMORIES[5]} index={0} total={1} />
      </div>
    </div>
  ),
}
