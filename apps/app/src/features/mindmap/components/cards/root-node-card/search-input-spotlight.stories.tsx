import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { InputBorderSpotlight } from './search-input-spotlight'


const meta = {
  title: 'Mindmap/cards/root-node-card/search-input-spotlight',
  component: InputBorderSpotlight,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof InputBorderSpotlight>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
