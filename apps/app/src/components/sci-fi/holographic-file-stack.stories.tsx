import type {Meta, StoryObj} from '@storybook/react'
import {HolographicFileStack} from './holographic-file-stack'

const meta: Meta<typeof HolographicFileStack> = {
  title: 'Sci-Fi/HolographicFileStack',
  component: HolographicFileStack,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    files: [
      {id: 'doc1', title: 'Confidential Report', color: '#4f46e5'},
      {id: 'doc2', title: 'Evidence XK-467', color: '#8b5cf6'},
      {id: 'doc3', title: 'Testimony Recording', color: '#ec4899'},
      {id: 'doc4', title: 'Research Data', color: '#f43f5e'},
      {id: 'doc5', title: 'Location Map', color: '#10b981'},
    ],
    spacing: 0.1,
    rotationFactor: 0.3,
  },
}

export const EmptyStack: Story = {
  args: {
    files: [],
  },
}

export const SingleFile: Story = {
  args: {
    files: [{id: 'doc1', title: 'Classified Document', color: '#4f46e5'}],
    spacing: 0.05,
    rotationFactor: 0.2,
  },
}
