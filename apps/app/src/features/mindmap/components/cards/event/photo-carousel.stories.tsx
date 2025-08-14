import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { PhotoCarousel } from './photo-carousel'


const meta = {
  title: 'Mindmap/cards/event/photo-carousel',
  component: PhotoCarousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof PhotoCarousel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
