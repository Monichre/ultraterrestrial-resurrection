import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { SmartBottomMenuWithSharedContext } from './smart-bottom-menu-with-shared-context'


const meta = {
  title: 'Mindmap/menus/mindmap-bottom-menu/smart-bottom-menu-with-shared-context',
  component: SmartBottomMenuWithSharedContext,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof SmartBottomMenuWithSharedContext>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
