import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { SmartGraphWithSharedContext } from './smart-graph-with-shared-context'


const meta = {
  title: 'Mindmap/smart-graph/smart-graph-with-shared-context',
  component: SmartGraphWithSharedContext,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof SmartGraphWithSharedContext>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
