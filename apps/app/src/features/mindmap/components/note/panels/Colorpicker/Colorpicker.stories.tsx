import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ColorPicker } from './Colorpicker'


const meta = {
  title: 'Mindmap/note/panels/Colorpicker/Colorpicker',
  component: ColorPicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ColorPicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
