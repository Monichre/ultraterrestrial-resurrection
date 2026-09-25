import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { MenuList } from './MenuList'


const meta = {
  title: 'Mindmap/note/extensions/SlashCommand/MenuList',
  component: MenuList,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof MenuList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
