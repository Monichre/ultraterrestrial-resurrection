import type {Meta, StoryObj} from '@storybook/react'
import {EVIDENTIARY_STATES} from '@/features/mindmap/utils/evidentiary-state'
import {ConnectionsCanvas} from './ConnectionsCanvas'
import {NIMITZ_ENTITIES, NIMITZ_POSITIONS, NIMITZ_RELATIONS} from './nimitz.fixture'
import type {EvidenceRelation} from './types'

const meta = {
  title: 'Features/Research Canvas/Case Files/Connections Canvas',
  component: ConnectionsCanvas,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '"Follow the thread" — entities and evidence on a ReactFlow canvas with progressive disclosure: the seed entity starts expanded, everything else hides behind +N chips. Every edge carries an epistemic tier (stroke + dash + badge, shared vocabulary with the mindmap); weak tiers (Speculative/Resonant/Unverified/Disconfirmed) start collapsed in the legend. Click a node for its ego-network, click an edge to inspect its basis and counter-reading, double-click the canvas to pin a session note.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='h-screen w-screen'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ConnectionsCanvas>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The Nimitz cluster, seeded at the event. Only degree-1 neighbors visible;
 * expand "+N" chips to pull the thread. Weak tiers hidden until toggled.
 */
export const Nimitz: Story = {
  args: {
    entities: NIMITZ_ENTITIES,
    relations: NIMITZ_RELATIONS,
    positions: NIMITZ_POSITIONS,
    seedId: 'event_nimitz',
  },
}

/**
 * Same cluster with interpretive edges pushed toward Contested/Speculative,
 * all tiers visible — stress-tests the tier grammar and legend.
 * NOTE: tiers here are synthetic (deliberately degraded) — not the fixture's grading.
 */
export const ContestedHeavy: Story = {
  args: {
    entities: NIMITZ_ENTITIES,
    positions: NIMITZ_POSITIONS,
    seedId: 'event_nimitz',
    initialVisibleTiers: [...EVIDENTIARY_STATES],
    relations: NIMITZ_RELATIONS.map(
      (r): EvidenceRelation =>
        ['r3', 'r9', 'r10', 'r13', 'r15'].includes(r.id)
          ? {...r, tier: r.id === 'r10' ? 'Contested' : 'Speculative'}
          : r,
    ),
  },
}

/**
 * Pre-focused ego-network on Fravor — the "start from this person" entry
 * point. Seeded and focused on him; pull +N to widen.
 */
export const EgoNet: Story = {
  args: {
    entities: NIMITZ_ENTITIES,
    relations: NIMITZ_RELATIONS,
    positions: NIMITZ_POSITIONS,
    seedId: 'fig_fravor',
    focusEntityId: 'fig_fravor',
  },
}

/** Fully expanded, all tiers — the "show me everything" state (overwhelming on purpose, for comparison). */
export const FullyExpanded: Story = {
  args: {
    entities: NIMITZ_ENTITIES,
    relations: NIMITZ_RELATIONS,
    positions: NIMITZ_POSITIONS,
    seedId: 'event_nimitz',
    initialVisibleTiers: [...EVIDENTIARY_STATES],
  },
  play: async ({canvasElement}) => {
    // Expand every +N chip via user-like clicks until none remain
    for (let i = 0; i < 20; i++) {
      const chips = canvasElement.querySelectorAll<HTMLButtonElement>('button[title^="reveal"]')
      if (!chips.length) break
      chips.forEach((c) => c.click())
      await new Promise((r) => setTimeout(r, 100))
    }
  },
}
