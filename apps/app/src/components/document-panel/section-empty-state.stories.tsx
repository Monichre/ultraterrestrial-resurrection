import type {Meta, StoryObj} from '@storybook/react'
import {SectionEmptyState} from './section-empty-state'

const meta = {
  title: 'Components/DocumentPanel/SectionEmptyState',
  component: SectionEmptyState,
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
} satisfies Meta<typeof SectionEmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    message: 'No records linked to this document yet.',
  },
}

export const NoNotes: Story = {
  args: {
    message: 'No quick notes captured yet.',
  },
}
