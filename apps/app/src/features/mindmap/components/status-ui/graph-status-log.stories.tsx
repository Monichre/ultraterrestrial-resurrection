import type {Meta, StoryObj} from '@storybook/react'
import {GraphStatusLog} from './graph-status-log'

const meta = {
  title: 'Features/Mindmap | Status UI | GraphStatusLog',
  component: GraphStatusLog,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#000000',
        },
      ],
    },
  },
} satisfies Meta<typeof GraphStatusLog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// Example with custom styling
export const CustomPosition: Story = {
  decorators: [
    (Story) => (
      <div style={{width: '800px', height: '600px', position: 'relative'}}>
        <Story />
      </div>
    ),
  ],
}

// Example showing the component in a layout context
export const InLayout: Story = {
  decorators: [
    (Story) => (
      <div className='flex min-h-screen bg-black/90'>
        <div className='flex-1 relative'>
          <Story />
        </div>
      </div>
    ),
  ],
}
