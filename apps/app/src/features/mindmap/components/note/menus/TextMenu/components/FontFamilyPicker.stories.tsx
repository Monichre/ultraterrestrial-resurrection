import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { FontFamilyPicker } from './FontFamilyPicker'


const meta = {
  title: 'Mindmap/note/menus/TextMenu/components/FontFamilyPicker',
  component: FontFamilyPicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof FontFamilyPicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
