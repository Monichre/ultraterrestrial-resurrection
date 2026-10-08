import type {Meta, StoryObj} from '@storybook/react'
import {ReactFlowProvider, type NodeProps} from '@xyflow/react'

import {RecordDossierNode} from './record-dossier-node'

// Synthetic fixtures, shaped like the canvas add paths' node data.
const nodeProps = (id: string, data: Record<string, unknown>, selected = false) =>
  ({id, data, selected, type: 'eventsNode'}) as unknown as NodeProps

const meta: Meta<typeof RecordDossierNode> = {
  title: 'Research Canvas/RecordDossierNode',
  component: RecordDossierNode as any,
  decorators: [
    (Story) => (
      <ReactFlowProvider>
        <div style={{padding: 32, background: '#11120f', minHeight: '100vh'}}>
          <Story />
        </div>
      </ReactFlowProvider>
    ),
  ],
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RecordDossierNode>

export const ArchiveEvent: Story = {
  render: () => (
    <RecordDossierNode
      {...nodeProps('rec_example_event', {
        table: 'events',
        name: 'Malmstrom Air Force Base missile shutdown',
        location: 'Great Falls, Montana',
        date: '1967-03-16',
        description:
          'On the morning of March 16th, 1967, ten Minuteman missiles at Echo Flight went off alert in rapid succession while security personnel reported a light over the site.',
      })}
    />
  ),
}

export const ArchiveKeyFigureWithPlate: Story = {
  render: () => (
    <RecordDossierNode
      {...nodeProps('rec_example_figure', {
        table: 'key_figures',
        name: 'Robert Salas',
        role: 'Former USAF missile launch officer',
        photo: [{url: '/astro-3.png'}],
        bio: 'Retrospective witness to the 1967 Oscar Flight shutdown; co-author of Faded Giant.',
      })}
    />
  ),
}

export const BrokenPhotoFallsBack: Story = {
  render: () => (
    <RecordDossierNode
      {...nodeProps('rec_example_broken', {
        table: 'key_figures',
        name: 'George Knapp',
        role: 'Chief investigative reporter',
        photo: [{url: ''}],
      })}
    />
  ),
}

export const AgentNamedEntity: Story = {
  render: () => (
    <RecordDossierNode
      {...nodeProps('event_echo_flight_inferred', {
        type: 'events',
        provenance: 'agent',
        label: 'Echo Flight, March 16',
        date: '1967-03-16',
        description: 'Named by the agent from its answer; no archive record backs this card.',
      })}
    />
  ),
}

export const Selected: Story = {
  render: () => (
    <RecordDossierNode
      {...nodeProps(
        'rec_example_selected',
        {
          table: 'topics',
          title: 'Nuclear–UAP nexus',
          summary: 'Reports clustered at weapons sites.',
        },
        true
      )}
    />
  ),
}
