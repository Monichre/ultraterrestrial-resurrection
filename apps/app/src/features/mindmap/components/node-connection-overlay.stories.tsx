import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { NodeConnectionOverlay } from './node-connection-overlay'


const meta = {
  title: 'Mindmap/node-connection-overlay',
  component: NodeConnectionOverlay,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof NodeConnectionOverlay>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
