import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { CardStack } from './card-stack'


const meta = {
  title: 'Mindmap/cards/card-stack/card-stack',
  component: CardStack,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof CardStack>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
