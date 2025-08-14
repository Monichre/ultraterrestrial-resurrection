import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { ColorButton } from './ColorButton'


const meta = {
  title: 'Mindmap/note/panels/Colorpicker/ColorButton',
  component: ColorButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ColorButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
