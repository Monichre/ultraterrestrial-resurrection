import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { TextMenu } from './TextMenu'


const meta = {
  title: 'Mindmap/note/menus/TextMenu/TextMenu',
  component: TextMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof TextMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
