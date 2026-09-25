import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { BaseHandle } from './base-handle'


const meta = {
  title: 'Mindmap/base-handle',
  component: BaseHandle,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof BaseHandle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
