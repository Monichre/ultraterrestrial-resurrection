import type {Meta, StoryObj} from '@storybook/react'
import {DocumentToolbar, type ToolId} from './document-toolbar'

const meta = {
  title: 'Components/DocumentPanel/DocumentToolbar',
  component: DocumentToolbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className='dp-shell dp-grain w-full max-w-2xl p-4'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DocumentToolbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    activeTools: new Set<ToolId>(),
    onToggleTool: () => {},
    onOpenTemplates: () => {},
  },
}

export const WithActiveTools: Story = {
  args: {
    activeTools: new Set<ToolId>(['bold', 'h1', 'ul']),
    onToggleTool: () => {},
    onOpenTemplates: () => {},
  },
}
