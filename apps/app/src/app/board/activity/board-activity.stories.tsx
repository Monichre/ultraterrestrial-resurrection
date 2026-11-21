// Storybook preview does not load canvas-animations.css, so import it here for
// --ut-* tokens, .ut-mono and .ut-redaction.
import '@/features/mindmap/research-canvas/canvas-animations.css'

import type {Meta, StoryObj} from '@storybook/nextjs'
import {AgentFacepile, TicketActivityRow} from './board-activity'
import type {SessionActivity} from './types'

const NOW = Date.UTC(2026, 10, 6, 15, 0, 0)
const ago = (min: number) => new Date(NOW - min * 60_000).toISOString()

const session = (over: Partial<SessionActivity>): SessionActivity => ({
  id: over.title ?? 'x',
  agent: 'Claude Code',
  title: 'build ticket t 049',
  startedAt: ago(90),
  lastWriteAt: ago(4),
  recency: 'active',
  tickets: ['T-049'],
  ...over,
})

const LIVE: SessionActivity[] = [
  session({title: 'build ticket t 049', agent: 'Claude Code', lastWriteAt: ago(2), recency: 'active'}),
  session({title: 'spacetime dial brush', agent: 'Codex CLI', lastWriteAt: ago(9), recency: 'active', tickets: ['T-047']}),
  session({title: 'review dogfood vs todo', agent: 'Cursor IDE', lastWriteAt: ago(180), recency: 'recent', tickets: ['T-065', 'T-050', 'T-053']}),
  session({title: 'pilot transcripts', agent: 'Factory Droid', lastWriteAt: ago(600), recency: 'recent', tickets: ['T-084']}),
  session({title: 'pigtail again', agent: 'Antigravity', lastWriteAt: ago(2000), recency: 'dormant', tickets: []}),
  session({title: 'docs pruning', agent: 'Pi', lastWriteAt: ago(5000), recency: 'dormant', tickets: []}),
  session({title: 'untitled session', agent: 'Unknown', lastWriteAt: ago(9000), recency: 'dormant', tickets: []}),
]

// Mirrors the real repo state on November 6th, 2026: capture stopped
// October 1st, 2026, so every session is dormant.
const DORMANT: SessionActivity[] = LIVE.slice(0, 4).map((s, i) => ({
  ...s,
  lastWriteAt: ago(36 * 24 * 60 + i * 30),
  recency: 'dormant',
}))

function Frame({children}: {children: React.ReactNode}) {
  return (
    <div className='dark flex min-h-[420px] justify-end gap-10 p-6' style={{background: 'var(--ut-void)', color: 'var(--ut-paper)'}}>
      {children}
    </div>
  )
}

function Card({s, loading}: {s?: SessionActivity | null; loading?: boolean}) {
  return (
    <div className='flex w-[280px] flex-col gap-1 border px-3 py-2.5' style={{borderColor: 'var(--ut-line)', background: 'var(--ut-surface)'}}>
      <span className='ut-mono text-[9px]' style={{color: 'var(--ut-ink-faint)'}}>T-049</span>
      <p className='text-[12.5px]' style={{color: 'var(--ut-paper)'}}>Board — live agent/session activity view</p>
      <TicketActivityRow session={s} loading={loading} now={NOW} />
    </div>
  )
}

const meta = {
  title: 'Board/Activity',
  component: AgentFacepile,
  parameters: {layout: 'fullscreen'},
  args: {sessions: LIVE, now: NOW},
} satisfies Meta<typeof AgentFacepile>

export default meta
type Story = StoryObj<typeof meta>

export const Populated: Story = {
  render: (args) => (
    <Frame>
      <Card s={LIVE[0]} />
      <AgentFacepile {...args} />
    </Frame>
  ),
}

export const Loading: Story = {
  args: {loading: true, sessions: []},
  render: (args) => (
    <Frame>
      <Card loading />
      <AgentFacepile {...args} />
    </Frame>
  ),
}

export const Dormant: Story = {
  args: {sessions: DORMANT},
  render: (args) => (
    <Frame>
      <Card s={DORMANT[0]} />
      <AgentFacepile {...args} />
    </Frame>
  ),
}

export const Overflow: Story = {
  args: {sessions: [...LIVE, ...LIVE.map((s) => ({...s, id: `${s.id}-2`}))], max: 4},
  render: (args) => (
    <Frame>
      <AgentFacepile {...args} />
    </Frame>
  ),
}

export const Unavailable: Story = {
  args: {unavailable: true, sessions: []},
  render: (args) => (
    <Frame>
      <Card s={null} />
      <AgentFacepile {...args} />
    </Frame>
  ),
}
