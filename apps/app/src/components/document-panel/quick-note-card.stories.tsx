import type {Meta, StoryObj} from '@storybook/react'
import {QuickNoteCard} from './quick-note-card'
import type {QuickNote} from './lib/document-panel-data'

const meta = {
  title: 'Components/DocumentPanel/QuickNoteCard',
  component: QuickNoteCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className='dp-shell dp-grain w-full max-w-sm p-4'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof QuickNoteCard>

export default meta
type Story = StoryObj<typeof meta>

const goldNote: QuickNote = {
  id: 'n1',
  category: 'Lead',
  body: 'Check library microfilm for Roswell Daily Record archives.',
  signature: '— L.E.',
  tone: 'gold',
}

const greenNote: QuickNote = {
  id: 'n2',
  category: 'Hypothesis Test',
  body: 'Compare isotopic signatures with known meteoritic samples.',
  tone: 'green',
}

const blueNote: QuickNote = {
  id: 'n3',
  category: 'Next Steps',
  body: 'Schedule interview with Col. Salas (follow up).',
  tone: 'blue',
}

export const Gold: Story = {
  args: {
    note: goldNote,
    onOpen: () => {},
  },
}

export const Green: Story = {
  args: {
    note: greenNote,
    onOpen: () => {},
  },
}

export const Blue: Story = {
  args: {
    note: blueNote,
    onOpen: () => {},
  },
}

export const AllTones: Story = {
  render: () => (
    <div className='dp-note-grid'>
      <QuickNoteCard note={goldNote} onOpen={() => {}} />
      <QuickNoteCard note={greenNote} onOpen={() => {}} />
      <QuickNoteCard note={blueNote} onOpen={() => {}} />
    </div>
  ),
}
