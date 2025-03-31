import React from 'react'
import type {Meta, StoryObj} from '@storybook/react'
import ToolbarExpandable from './toolbar-expandable'

// Add a decorator to properly wrap the component
const meta = {
  title: 'Components/Toolbars/Expandable Toolbar',
  component: ToolbarExpandable,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className='flex items-center justify-center min-h-screen'>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof ToolbarExpandable>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

// Add another variant to test a different initial state
export const ExpandedState: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The toolbar in an expanded state with the first item active',
      },
    },
  },
}
