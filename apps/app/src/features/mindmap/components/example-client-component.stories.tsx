import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { MindmapExplorer } from './example-client-component'


const meta = {
  title: 'Mindmap/example-client-component',
  component: MindmapExplorer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof MindmapExplorer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
