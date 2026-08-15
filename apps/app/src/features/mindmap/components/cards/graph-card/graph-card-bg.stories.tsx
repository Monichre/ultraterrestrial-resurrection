import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { GridPattern } from './graph-card-bg'


const meta = {
  title: 'Mindmap/cards/graph-card/graph-card-bg',
  component: GridPattern,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof GridPattern>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
