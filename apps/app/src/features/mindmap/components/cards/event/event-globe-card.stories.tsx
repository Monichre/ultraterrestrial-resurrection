import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Globe } from './event-globe-card'


const meta = {
  title: 'Mindmap/cards/event/event-globe-card',
  component: Globe,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof Globe>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
