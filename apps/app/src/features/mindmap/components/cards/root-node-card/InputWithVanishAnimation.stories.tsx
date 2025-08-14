import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { InputWithVanishAnimation } from './InputWithVanishAnimation'


const meta = {
  title: 'Mindmap/cards/root-node-card/InputWithVanishAnimation',
  component: InputWithVanishAnimation,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof InputWithVanishAnimation>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
