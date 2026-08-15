import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ButtonHandle } from './button-handle'


const meta = {
  title: 'Mindmap/button-handle',
  component: ButtonHandle,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ButtonHandle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
