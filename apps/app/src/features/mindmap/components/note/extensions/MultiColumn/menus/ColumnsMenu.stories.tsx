import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ColumnsMenu } from './ColumnsMenu'


const meta = {
  title: 'Mindmap/note/extensions/MultiColumn/menus/ColumnsMenu',
  component: ColumnsMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ColumnsMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
