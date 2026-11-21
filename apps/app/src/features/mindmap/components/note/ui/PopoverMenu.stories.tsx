import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Trigger } from './PopoverMenu'


const meta = {
  title: 'Mindmap/note/ui/PopoverMenu',
  component: Trigger,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof Trigger>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
