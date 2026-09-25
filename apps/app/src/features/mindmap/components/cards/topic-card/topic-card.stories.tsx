import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { TopicCard } from './topic-card'


const meta = {
  title: 'Mindmap/cards/topic-card/topic-card',
  component: TopicCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof TopicCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
