import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { GroupBoundary } from './group-boundary'


const meta = {
  title: 'Mindmap/grouping/group-boundary',
  component: GroupBoundary,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof GroupBoundary>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
