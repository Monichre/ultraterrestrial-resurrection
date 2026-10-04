import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { MindMapSideMenu } from './MindMapSideMenu'


const meta = {
  title: 'Mindmap/menus/mindmap-side-menu/MindMapSideMenu',
  component: MindMapSideMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof MindMapSideMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
