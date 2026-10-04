import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { NodeMenu } from './NodeMenu'


const meta = {
  title: 'Mindmap/menus/NodeMenu',
  component: NodeMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof NodeMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
