import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { EM } from './entity-card-utility-menu'


const meta = {
  title: 'Mindmap/cards/entity-card/entity-card-utility-menu',
  component: EM,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof EM>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
