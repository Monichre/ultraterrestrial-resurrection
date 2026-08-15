import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ContentItemMenu } from './ContentItemMenu'


const meta = {
  title: 'Mindmap/note/menus/ContentItemMenu/ContentItemMenu',
  component: ContentItemMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ContentItemMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
