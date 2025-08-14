import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { CardCorners } from './sections'


const meta = {
  title: 'Mindmap/cards/entity-group-card/sections',
  component: CardCorners,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof CardCorners>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
