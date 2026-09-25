import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Icon } from './Icon'


const meta = {
  title: 'Mindmap/note/ui/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
