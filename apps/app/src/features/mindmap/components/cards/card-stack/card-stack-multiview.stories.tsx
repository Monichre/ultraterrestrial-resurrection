import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import StackedCollapsibleCards from './card-stack-multiview'


const meta = {
  title: 'Mindmap/cards/card-stack/card-stack-multiview',
  component: StackedCollapsibleCards,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof StackedCollapsibleCards>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
