import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { LightsBackground } from './lights-background'


const meta = {
  title: 'Mindmap/cards/entity-group-card/lights-background',
  component: LightsBackground,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof LightsBackground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
