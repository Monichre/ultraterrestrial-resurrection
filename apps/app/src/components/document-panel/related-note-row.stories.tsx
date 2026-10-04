import type {Meta, StoryObj} from '@storybook/react'
import {RelatedNoteRow} from './related-note-row'
import type {RelatedNote} from './lib/document-panel-data'

const meta = {
  title: 'Components/DocumentPanel/RelatedNoteRow',
  component: RelatedNoteRow,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className='dp-shell dp-grain w-full max-w-md p-4'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RelatedNoteRow>

export default meta
type Story = StoryObj<typeof meta>

const sampleNote: RelatedNote = {
  id: 'rn1',
  title: 'Roswell Debris Analysis',
  updatedLabel: 'Updated 2d ago',
}

export const Default: Story = {
  args: {
    note: sampleNote,
    selected: false,
    onSelect: () => {},
    onOverflow: () => {},
  },
}

export const Selected: Story = {
  args: {
    note: sampleNote,
    selected: true,
    onSelect: () => {},
    onOverflow: () => {},
  },
}
