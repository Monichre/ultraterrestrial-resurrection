import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { EntityCardTooltip } from './entity-card-tooltip'


const meta = {
  title: 'Mindmap/cards/entity-card/entity-card-tooltip',
  component: EntityCardTooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof EntityCardTooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
