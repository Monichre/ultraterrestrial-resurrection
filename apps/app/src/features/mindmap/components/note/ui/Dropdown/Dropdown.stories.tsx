import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { DropdownCategoryTitle } from './Dropdown'


const meta = {
  title: 'Mindmap/note/ui/Dropdown/Dropdown',
  component: DropdownCategoryTitle,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof DropdownCategoryTitle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
