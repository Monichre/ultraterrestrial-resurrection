import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { CanvasRevealEffect } from './entity-group-card-bg'


const meta = {
  title: 'Mindmap/cards/entity-group-card/entity-group-card-bg',
  component: CanvasRevealEffect,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof CanvasRevealEffect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
