import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ModelAvatar } from './connection-list'


const meta = {
  title: 'Mindmap/connection-list',
  component: ModelAvatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ModelAvatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
