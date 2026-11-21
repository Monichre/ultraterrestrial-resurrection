import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { TestimonyCoreNodeBottom } from './testimony-card'


const meta = {
  title: 'Mindmap/cards/testimony-card',
  component: TestimonyCoreNodeBottom,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof TestimonyCoreNodeBottom>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
