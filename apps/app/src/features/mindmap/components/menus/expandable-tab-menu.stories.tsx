import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import ExpandableTabs from './expandable-tab-menu'


const meta = {
  title: 'Mindmap/menus/expandable-tab-menu',
  component: ExpandableTabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ExpandableTabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
